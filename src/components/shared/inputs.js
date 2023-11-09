import { TextField, styled } from "@mui/material";
import InputBase from "@mui/material/InputBase";

export const TextInputField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#362B6A",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#D8D5E5",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {},
    "&:hover fieldset": {
      borderColor: "#D8D5E5",

      borderWidth: 1,
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D8D5E5",
      borderWidth: 1,
    },
  },
});

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // boxShadow:
    //   "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",

    border: `1px solid ${theme.palette.text.secondary}`,
    fontSize: 14,
    color: theme.palette.text.primary,
    // fontWeight: 700,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
  },
}));

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // boxShadow:
    //   "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",

    border: `1px solid ${theme.palette.text.secondary}`,
    fontSize: 14,
    color: theme.palette.text.primary,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.

    "&:focus": {
      borderRadius: 4,
      // borderColor: "#80bdff",
      // boxShadow: "0 0 0 0.2rem rgba(0,0,0,0.1)",
    },
  },
}));
