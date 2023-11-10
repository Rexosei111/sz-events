import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Stack,
} from "@mui/material";
import React, { useContext } from "react";
import { TextInputField } from "../inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  EmailOutlined,
  LocationOnOutlined,
  Person2Outlined,
  PhoneAndroidOutlined,
} from "@mui/icons-material";
import { SnackbarContext } from "@/pages/_app";
import { LoadingButton } from "@mui/lab";
import { isAxiosError } from "axios";
import { AntSwitch } from "../switches";
import { APIClient } from "@/utils/axios";
import { SecondaryButton } from "@/components/btn/baseBtn";
import { PrimaryLoadingButton } from "@/components/btn/loadingBtn";

const attendeeSchema = yup
  .object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    phone_number: yup.string().required(),
    email: yup.string().email(),
    location: yup.string(),
    present: yup.boolean().default(false),
  })
  .required();
export default function NewAttendee({ open, handleClose, event_id, mutate }) {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    resolver: yupResolver(attendeeSchema),
  });

  const onSubmit = async (form_data) => {
    // console.log(form_data);
    try {
      const { data } = await APIClient.post(
        `/attendance/${event_id}`,
        form_data
      );
      reset({
        first_name: null,
        last_name: null,
        phone_number: null,
        email: null,
        location: null,
        present: false,
      });
      //   handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to add new attendee!");
      }
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add new attendee to event</DialogTitle>
      <DialogContent>
        <form
          method="POST"
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          id="attendee-form"
        >
          <Stack flexDirection={"column"} gap={2}>
            <TextInputField
              {...register("first_name")}
              variant="outlined"
              type={"text"}
              label="First name"
              error={errors.first_name ? true : false}
              helperText={errors.first_name ? errors.first_name?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person2Outlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 13 },
              }}
              fullWidth
              placeholder="Enter first name here"
            />
            <TextInputField
              {...register("last_name")}
              variant="outlined"
              type={"text"}
              label="Last name"
              error={errors.last_name ? true : false}
              helperText={errors.last_name ? errors.last_name?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person2Outlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 13 },
              }}
              fullWidth
              placeholder="Enter last name here"
            />
            <TextInputField
              {...register("phone_number")}
              variant="outlined"
              type={"text"}
              label="Phone Number"
              error={errors.phone_number ? true : false}
              helperText={
                errors.phone_number ? errors.phone_number?.message : null
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidOutlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 13 },
              }}
              fullWidth
              placeholder="223 54 3524 258"
            />
            <TextInputField
              {...register("email")}
              variant="outlined"
              type={"email"}
              label="Email address"
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 13 },
              }}
              fullWidth
              placeholder="user@example.com"
            />
            <TextInputField
              {...register("location")}
              variant="outlined"
              type={"text"}
              label="Location"
              error={errors.location ? true : false}
              helperText={errors.location ? errors.location?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 13 },
              }}
              fullWidth
              placeholder="Location of the attendee"
            />
          </Stack>
          <Box>
            <div>
              <FormControlLabel
                control={<AntSwitch {...register("present")} sx={{ m: 1 }} />}
                label="is attendee present?"
                componentsProps={{
                  typography: {
                    fontSize: 13,
                  },
                }}
              />
            </div>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          variant="outlined"
          onClick={handleClose}
          disableElevation
        >
          Close
        </SecondaryButton>
        <PrimaryLoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          variant="contained"
          type="submit"
          form="attendee-form"
          disableElevation
        >
          Submit
        </PrimaryLoadingButton>
      </DialogActions>
    </Dialog>
  );
}
