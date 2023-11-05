import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "rsuite/dist/rsuite.min.css";
// import "../styles/globals.css";
// import "../styles/globals.css";
// import { useTokenRefresh, useTokenValidation } from "@/hooks/token";
import { Alert, Snackbar, Typography } from "@mui/material";
import { createContext } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
export const SnackbarContext = createContext("snack!");
export default function MyApp(props) {
  // const isRefreshing = useTokenRefresh();
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState("");
  const [snackSeverity, setSnackSeverity] = React.useState("success");

  const handleOpen = (message) => {
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  // useTokenValidation();

  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;

  const getLayout = Component.getLayout || ((page) => page);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarContext.Provider
          value={{
            snackOpen,
            handleOpen,
            handleClose,
            setSnackMessage,
            setSnackSeverity,
          }}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {getLayout(<Component {...pageProps} />)}
          </LocalizationProvider>
          <Snackbar
            open={snackOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              variant="filled"
              severity={snackSeverity}
              sx={{ width: "100%" }}
            >
              {snackMessage !== null && Array.isArray(snackMessage) && (
                <>
                  <Typography variant="subtitle2" fontSize={15}>
                    There are errors in the form
                  </Typography>
                  <ul>
                    {snackMessage.map((error, index) => (
                      <li key={index}>
                        <b>{error.propertyPath}:</b> {error.message}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {snackMessage !== null && typeof snackMessage === "string" && (
                <>
                  <Typography variant="subtitle2" fontSize={15}>
                    {snackMessage}
                  </Typography>
                </>
              )}
            </Alert>
          </Snackbar>
        </SnackbarContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
