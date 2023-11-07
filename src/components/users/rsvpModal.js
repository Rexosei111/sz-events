import React, { useContext, useState } from "react";
import {
  Modal,
  Toggle,
  ButtonToolbar,
  Placeholder,
  IconButton,
  Button,
} from "rsuite";
import { TextInputField } from "../shared/inputs";
import {
  Box,
  FormControlLabel,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isAxiosError } from "axios";
import {
  CheckCircle,
  EmailOutlined,
  Person2Outlined,
  PhoneAndroidOutlined,
} from "@mui/icons-material";
import { SnackbarContext } from "@/pages/_app";
import { LoadingButton } from "@mui/lab";
import { APIClient } from "@/utils/axios";

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

export const SuccessModal = ({ open, handleClose, event_name }) => {
  return (
    <Modal overflow={true} open={open} onClose={handleClose}>
      <Modal.Body>
        <Stack height={200} alignItems={"center"} justifyContent={"center"}>
          <IconButton
            circle
            size="lg"
            icon={<CheckCircle htmlColor="green" fontSize="large" />}
          />
          <h5 style={{ marginTop: "10px", textAlign: "center" }}>
            You have successfully registered for {event_name}
          </h5>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

export default function RSVPModal({
  open,
  handleClose,
  handleSuccessOpen,
  event_id,
}) {
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
    try {
      const { data } = await APIClient.post(
        `users/event/${event_id}`,
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
      handleSuccessOpen();
      handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to add new attendee!");
      }
    }
  };
  return (
    <>
      <Modal overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>RSVP {"🎉"}</Modal.Title>
          <Typography variant="subtitle2" mt={1} fontSize={13}>
            Kindly fill out this form
          </Typography>
        </Modal.Header>
        <form
          method="POST"
          action="#"
          id="rsvp-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Modal.Body>
            <Stack flexDirection={"column"} gap={2}>
              <TextInputField
                {...register("first_name")}
                variant="outlined"
                type={"text"}
                label="First name"
                error={errors.first_name ? true : false}
                helperText={
                  errors.first_name ? errors.first_name?.message : null
                }
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
                      <Person2Outlined fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: 13 },
                }}
                fullWidth
                placeholder="Location of the attendee"
              />
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              appearance="primary"
              type="submit"
              form="rsvp-form"
              loading={isSubmitting}
            >
              Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
