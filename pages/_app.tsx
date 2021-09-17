import React from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#71CEF3',
      },
      secondary: {
        main: '#242057',
      },
      success: {
        main: '#399E72',
      },

      error: {
        main: '#FF4848',
      },
      background: {
        default: '#fff',
      },
    },
  });

  return (
    <React.StrictMode>
      <React.Fragment>
        <Head>
          <title>Jiru Nguyen</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </React.Fragment>
    </React.StrictMode>
  )
}
export default MyApp
