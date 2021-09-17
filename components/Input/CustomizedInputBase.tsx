import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import styles from '../../styles/Home.module.css'

interface Props {
  onInputChange?: any
}

export default function CustomizedInputBase({onInputChange}:Props) {

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  }

  return (
    <>
      <Paper component="form" className={styles.main}>
        <IconButton className={styles.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <InputBase
          fullWidth={true}
          className={styles.input}
          placeholder="Address "
          onChange={handleChangeInput}
        />
        <Divider orientation="vertical" />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
}
