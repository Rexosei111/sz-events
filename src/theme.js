import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { Lato } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const lato = Lato({
  weight: ["300", "400", "700"],
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
      dark: "#8c006000",
      contrastText: "#FFFFFF",
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
    MuiButton: {
      styleOverrides: {
        text: {
          textTransform: "capitalize",
        },
      },
    },
  },
  typography: {
    fontFamily:
      "Apple-System,Arial,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,STXihei,sans-serif",
  },
});

export default theme;
