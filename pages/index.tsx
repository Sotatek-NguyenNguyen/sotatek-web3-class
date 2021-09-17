import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import PrimaryAppBar from "../components/AppBar";
import CustomizedInputBase from "../components/Input";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import {Link, Theme, Typography} from "@material-ui/core";
import {
  depositViaSmartContract,
  getBalanceETH,
  getBalanceWETH,
  getEvent,
  instance,
  parseBalance, withdrawViaSmartContract
} from "./helper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import {GridColDef, GridRowsProp, DataGrid} from "@mui/x-data-grid";
import {createStyles, makeStyles} from "@material-ui/styles";
import {EventData} from "web3-eth-contract";
import Image from 'next/image'
import ethIcon from '/icons/ethereum.svg'

// dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

// input
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import BigNumber from "bignumber.js";

interface PersonalAccount {
  address: string,
  balanceETH: string,
  balanceWETH: string,
  network: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiDataGrid-iconSeparator": { display: "none"},
    }
  }),
);

const Home: NextPage = () => {
  const classes = useStyles();

  // section for useState
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>('');
  const [eventsTransfer, setEventsTransfer] = useState<EventData[]>();
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);
  const [balance, setBalance] = useState<string| null>('');
  const [amountDeposit, setAmountDeposit] = useState<number>(0);
  const [amountWithdraw, setAmountWithdraw] = useState<number>(0);
  const [personalAccount, setPersonalAccount] = useState<PersonalAccount>({
    address: '',
    balanceETH: '',
    balanceWETH: '',
    network: '',
  });

  instance.events.Transfer()
    .on('data', (_: any) => {
      setIsNewEvent(true)
    })

  useEffect(() => {
    const getEventsTransfer = async () => {
      try {
        const results = await getEvent('Transfer');
        setEventsTransfer(results)
        setIsNewEvent(false)
      } catch (e:any) {
        setIsNewEvent(false)
        setMessageSnackbar(e.message)
        setOpenSnackbar(!openSnackbar)
      }
    }

    getEventsTransfer();
  }, [isNewEvent]);


  // for render data
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'blockNumber', headerName: 'Block Number', flex: 1 },
    { field: 'address', headerName: 'Address', headerAlign: 'center',flex: 1 },
    { field: 'transactionHash', headerName: 'Transaction Hash', headerAlign: 'center',flex: 1 },
    { field: 'event', headerName: 'Event', width: 150 },
  ];

  const rows: GridRowsProp = eventsTransfer && eventsTransfer?.length > 0 ? eventsTransfer : [];

  // section for useEffect
  useEffect(() => {
    const updateBalanceAccount = async () => {
      personalAccount.balanceETH = await getBalanceETH(personalAccount.address);
      personalAccount.balanceWETH = await getBalanceWETH(personalAccount.address);
    }

    if (transactionSuccess) {
      setTransactionSuccess(false);
      updateBalanceAccount();
    }
  }, [transactionSuccess])


  // section for handle
  const handleCloseSnackBar = () => {
    setOpenSnackbar(!openSnackbar)
  }

  const handleOpenSnackBar = () => {
    setOpenSnackbar(true)
  }

  const handleRetrieveMessageSnackBar = (message:string) => {
    setMessageSnackbar(message)
  }

  const handleOpenInfoDialog = () => {
    setOpenInfoDialog(true);
  };

  const handleClose = () => {
    setOpenInfoDialog(false);
  };

  const onInputChange = async (value: string) => {
    if (value !== '') {
      try {
        const _balance = await getBalanceETH(value);
        setBalance(_balance);
        return
      } catch (e:any) {
        setMessageSnackbar(e.message)
        setOpenSnackbar(!openSnackbar)
      }
    }
  }

  const getAccountInfo = (account:PersonalAccount) => {
    setPersonalAccount(account);
  }

  const handleSubmit = async (type:string) => {
    try {
      if (type === 'deposit') {
        const transactionHash = await depositViaSmartContract(
          personalAccount.address,
          amountDeposit.toString()
        );
        setMessageSnackbar(transactionHash);
        setTransactionSuccess(true);
      }

      if (type === 'withdraw') {
        const transactionHash = await withdrawViaSmartContract(
          personalAccount.address,
          amountWithdraw.toString()
        );
        setMessageSnackbar(transactionHash);
        setTransactionSuccess(true);
      }
    } catch (e:any) {
      setMessageSnackbar(e.message)
      setOpenSnackbar(!openSnackbar)
    }
  }

  const handleInputChange = (type:string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (isNaN(value)) {
      setAmountDeposit(0);
      return;
    }

    if (type === 'deposit') {
      setAmountDeposit(value);
      return;
    }

    if (type === 'withdraw') {
      setAmountWithdraw(value);
      return;
    }
  }

  return (
    <>
      <div className={styles.header}>
        <PrimaryAppBar
          onOpenSnackBar={handleOpenSnackBar}
          onOpenInfoDialog={handleOpenInfoDialog}
          messageSnackbar={handleRetrieveMessageSnackBar}
          accountInfo={getAccountInfo}
        />
      </div>
      <div className={styles.container}>

        {/*input search*/}
        <main className={styles.main}>
          <Grid item xs />
          <Grid item xs={6}>
            <CustomizedInputBase onInputChange={onInputChange}  />
            <div className={styles.accountBalance}>
              <AccountBalanceWalletOutlinedIcon fontSize={'medium'} style={{marginRight: '1rem'}}/>
              {balance && (
                <Typography variant={'button'} style={{fontWeight: 'bold'}}>
                  {parseBalance(balance)} ETH
                </Typography>
              )}
              {!balance && (
                <Typography variant={'button'} style={{fontWeight: 'bold'}}>
                  n/a
                </Typography>
              )}
            </div>
          </Grid>
          <Grid item xs />
        </main>

        {/*data table*/}
        <main className={styles.main}>
          <Grid item xs />
          <Grid item xs={10}>
            <div className={styles.eventTransfer}>
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    autoHeight
                    rows={rows}
                    columns={columns}
                    className={classes.root}
                    pageSize={10}
                  />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs />
        </main>

      </div>
      <div className={styles.footer}>
        <footer>Sotatek-PhucNguyen2</footer>
      </div>

      <Dialog
        open={openInfoDialog}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
        maxWidth={'md'}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant={'h5'}>Information</Typography>
            <CloseIcon fontSize={'medium'} onClick={handleClose} style={{cursor: 'pointer'}}/>
          </div>
        </DialogTitle>

        <DialogContent style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
          <div>
            <DialogContentText>
              <Typography variant={'caption'}>Account</Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant={'caption'}>ETH Balance</Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant={'caption'}>WETH Balance</Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant={'caption'}>Network</Typography>
            </DialogContentText>
          </div>

          <div style={{marginLeft: '10px'}}>
            <DialogContentText>
              <Typography variant={'caption'} style={{fontWeight: 'bold'}}>
                { personalAccount.address }
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant={'caption'} style={{fontWeight: 'bold'}}>
                { personalAccount.balanceETH && parseBalance(personalAccount.balanceETH) || 'N/a' }
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant={'caption'} style={{fontWeight: 'bold'}}>
                { personalAccount.balanceWETH && parseBalance(personalAccount.balanceWETH) || 'N/a' }
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant={'caption'} style={{fontWeight: 'bold'}}>{ personalAccount.network }</Typography>
            </DialogContentText>

          </div>
        </DialogContent>

        <DialogContent>
          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-amount">Deposit ETH</InputLabel>
              <OutlinedInput
                id="deposit"
                onChange={ (e:React.ChangeEvent<HTMLInputElement>) => {handleInputChange('deposit', e)} }
                placeholder={'Enter here'}
                startAdornment={<InputAdornment position="start"><Image src={ethIcon} /></InputAdornment>}
                endAdornment={
                  <Button
                    variant="text"
                    color={'primary'}
                    onClick={() => {handleSubmit('deposit') }}
                    style={{margin: '0 1rem'}}
                  >
                    Deposit
                  </Button>
                }
                labelWidth={90}
              />
            </FormControl>
          </div>
        </DialogContent>

        <DialogContent>
          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-amount">Withdraw WETH</InputLabel>
              <OutlinedInput
                id="withdraw"
                onChange={ (e:React.ChangeEvent<HTMLInputElement>) => {handleInputChange('withdraw', e)} }
                placeholder={'Enter here'}
                startAdornment={<InputAdornment position="start"><Image src={ethIcon} /></InputAdornment>}
                endAdornment={
                  <Button variant="text" color={'primary'} onClick={() => {handleSubmit('withdraw') }}>Withdraw</Button>
                }
                labelWidth={120}
              />
            </FormControl>
          </div>
        </DialogContent>

        <DialogActions />
      </Dialog>

      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={openSnackbar}
        message={messageSnackbar}
        onClose={handleCloseSnackBar}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={transactionSuccess}
        message={messageSnackbar}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  )
}

export default Home;
