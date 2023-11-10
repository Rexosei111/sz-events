import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { pink, purple } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "#1C38D2",
      light: "#495FDB",
      dark: "#132793",
      contrastText: "#FFFFFF",
    },
    primary: {
      main: "#86005e",
      light: "#A7516F",
      dark: "#6e024e",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#66bb6a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#1c1f20",
      paper: "#181a1b",
    },
    text: {
      primary: "#dedede",
      secondary: "#979797",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => {
          theme.unstable_sx({
            textTransform: "capitalize",
          });
        },
      },
    },
    // MuiButton: {
    //   styleOverrides: {
    //     text: {
    //       textTransform: "capitalize",
    //     },
    //   },
    // },
  },
  typography: {
    fontFamily:
      "Apple-System,Arial,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,STXihei,sans-serif",
  },
});

export default theme;
