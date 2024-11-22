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
    // mode: "dark",
    // secondary: {
    //   main: "#1C38D2",
    //   light: "#495FDB",
    //   dark: "#132793",
    //   contrastText: "#FFFFFF",
    // },
    // primary: {
    //   main: "#86005e",
    //   light: "#A7516F",
    //   dark: "#6e024e",
    //   contrastText: "#FFFFFF",
    // },

    // success: {
    //   main: "#66bb6a",
    //   contrastText: "#ffffff",
    // },
    // background: {
    //   default: "#1c1f20",
    //   paper: "#181a1b",
    // },
    // text: {
    //   primary: "#dedede",
    //   secondary: "#979797",
    // },
    mode: "light",
    secondary: {
      main: "#B4311E", // Keeping this consistent for brand identity
      light: "#6A7FDB", // Slightly lighter tone for light mode
      dark: "#12257E", // A darker, muted version of secondary for contrast
      contrastText: "#FFFFFF",
    },
    primary: {
      main: "#316397", // Keeping main consistent
      light: "#316397", // Lighter version for better contrast in light mode
      dark: "#26527f", // Keeping the dark version similar
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#43A047", // A slightly darker green for light mode
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Light gray for a clean look
      paper: "#ffffff", // White for paper elements
    },
    text: {
      primary: "#316397", // Darker text for light mode
      secondary: "#616161", // Lighter gray for secondary text
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
