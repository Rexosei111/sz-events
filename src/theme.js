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
    mode: "light",
    primary: {
      main: "#479696",
    },
    secondary: {
      main: "#FF3524",
    },
    text: {
      primary: "#575757",
      secondary: "#848385",
    },
    background: {
      default: "#ffffff",
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
    fontFamily: lato.style.fontFamily,
  },
});

export default theme;
