import React, {useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import {Typography} from "@material-ui/core";
import styles from '../../styles/Home.module.css'
import {
  connectWallet,
  getBalanceETH,
  getBalanceWETH,
  getNetWork,
  parseAddress,
  parseBalance
} from "../../pages/helper";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

interface Props {
  onChangeAccount?: any,
  onOpenSnackBar?: any,
  messageSnackbar?: any
  onOpenInfoDialog?: any
  accountInfo?: any
}

export default function PrimaryAppBar({onOpenInfoDialog, onOpenSnackBar, messageSnackbar, accountInfo}:Props) {

  // section for useState
  const [account, setAccount] = React.useState<string | null>('');

  // section for useState
  useEffect(() => {
    const fetchAccountsBalance = async () => {
      try {
        const _balance = account && await getBalanceETH(account);
        const _balanceWETH = account && await getBalanceWETH(account);
        const _network = await getNetWork();

        const userInfo = {
          address: account,
          balanceETH: _balance,
          balanceWETH: _balanceWETH,
          network: _network,
        }

        accountInfo(userInfo)
      } catch (e:any) {
        onOpenSnackBar()
        messageSnackbar(e.message)
      }
    }

    fetchAccountsBalance()
  }, [account])

  // section for handle
  const handleClickOpen = async () => {
    try {
      // @ts-ignore
      const ethereum = window.ethereum;
      const accounts = await connectWallet(ethereum);
      ethereum.on('accountsChanged', () => { setAccount(null) })
      setAccount(accounts[0])
    }catch (e:any) {
      onOpenSnackBar()
      messageSnackbar(e.message)
    }
  };

  return (
    <div className={styles.grow}>
      <AppBar position="static" className={styles.appbar} color={'secondary'}>
        <Toolbar>
          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <AccountBalanceIcon />
          </IconButton>
          <div className={styles.grow} />
          <div className={styles.sectionDesktop}>
            {account && (
              <div
                style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}
                onClick={onOpenInfoDialog}
              >
                <Typography variant={'subtitle1'} style={{margin: '0 1rem'}}>{parseAddress(account)}</Typography>
                <ArrowDropDownIcon />
              </div>
            )}
            {!account && (
              <Button variant="contained" onClick={handleClickOpen} color={'primary'}>
                Connect Wallet
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
