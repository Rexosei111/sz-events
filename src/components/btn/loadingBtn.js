import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import theme from "@/theme";
import { LoadingButton } from "@mui/lab";

export const PrimaryLoadingButton = styled(LoadingButton)({
  textTransform: "capitalize",
  "&:hover": {
    color: theme.palette.text.primary,
  },
  "&:active": {
    color: theme.palette.text.primary,
  },
  "&:focus": {
    color: theme.palette.text.primary,
  },
});

export const SecondaryLoadingButton = styled(LoadingButton)({
  textTransform: "capitalize",
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
  borderColor: theme.palette.text.secondary,
  "&:hover": {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
  "&:active": {
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
  },
  "&:focus": {
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.secondary,
  },
});
