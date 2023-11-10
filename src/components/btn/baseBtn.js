import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import theme from "@/theme";

export const PrimaryButton = styled(Button)({
  textTransform: "capitalize",
  "&:hover": {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  "&:active": {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  "&:focus": {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
});

export const SecondaryButton = styled(Button)({
  textTransform: "capitalize",
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
  borderColor: "transparent",
  "&:hover": {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  "&:active": {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  "&:focus": {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
});
