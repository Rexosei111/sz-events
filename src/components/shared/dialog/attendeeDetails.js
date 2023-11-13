import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { TextInputField } from "../inputs";
import {
  Check,
  CheckCircleOutline,
  CheckOutlined,
  CloseOutlined,
  CloseRounded,
  DeleteOutline,
  EmailOutlined,
  LocationOnOutlined,
  Person2Outlined,
  PhoneOutlined,
} from "@mui/icons-material";
import { AntSwitch } from "../switches";
import { LoadingButton } from "@mui/lab";
import { APIClient } from "@/utils/axios";
import { SnackbarContext } from "@/pages/_app";
import BasicAccordion from "@/components/admin/viewMoreAccordion";
import {
  PrimaryLoadingButton,
  SecondaryLoadingButton,
} from "@/components/btn/loadingBtn";

export default function AttendeeDetails({
  open,
  handleClose,
  attendee,
  mutate,
  summaryMutate,
  summary,
  event_id,
  deleteAttendee,
  handleDeleteConfirmation,
}) {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const [presentLoading, setPresentLoading] = useState(false);
  const [absentLoading, setAbsentLoading] = useState(false);
  const handleMarkAttendance = async (attendee, present) => {
    if (present) {
      setPresentLoading(true);
    } else {
      setAbsentLoading(true);
    }
    try {
      const { data } = await APIClient.patch(
        `attendance/${event_id}?attendee_id=${attendee.id}&present=${present}`
      );
      mutate();
      summaryMutate((prevState) => ({
        ...prevState,
        present: present === true ? prevState?.present + 1 : prevState?.present,
        absent: present === false ? prevState.absent + 1 : prevState.absent,
      }));
      handleClose();
    } catch (error) {
      setSnackSeverity("error");
      handleSnackbarOpen(
        `Unable to take attendance for ${attendee.first_name}`
      );
    } finally {
      setPresentLoading(false);
      setAbsentLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h5">Details of Attendee</Typography>
          <IconButton onClick={() => handleDeleteConfirmation(attendee)}>
            <DeleteOutline />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <TextInputField
            variant="outlined"
            type={"text"}
            label="First name"
            value={attendee?.first_name}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person2Outlined fontSize="small" />
                </InputAdornment>
              ),
              style: { fontSize: 13 },
            }}
            fullWidth
          />
          <TextInputField
            variant="outlined"
            type={"text"}
            label="Last name"
            disabled
            value={attendee?.last_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person2Outlined fontSize="small" />
                </InputAdornment>
              ),
              style: { fontSize: 13 },
            }}
            fullWidth
          />
          <TextInputField
            variant="outlined"
            type={"text"}
            label="Phone number"
            disabled
            value={attendee?.phone_number}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlined fontSize="small" />
                </InputAdornment>
              ),
              style: { fontSize: 13 },
            }}
            fullWidth
          />
          <TextInputField
            variant="outlined"
            type={"email"}
            label="Email address"
            disabled
            value={attendee?.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined fontSize="small" />
                </InputAdornment>
              ),
              style: { fontSize: 13 },
            }}
            fullWidth
          />
          <TextInputField
            variant="outlined"
            type={"text"}
            label="Location"
            disabled
            value={attendee?.location}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlined fontSize="small" />
                </InputAdornment>
              ),
              style: { fontSize: 13 },
            }}
            fullWidth
          />
          {attendee && attendee?.occupation !== null && (
            <BasicAccordion attendee={attendee} />
          )}
          <Box width={"100%"}>
            <PrimaryLoadingButton
              variant="contained"
              disableElevation
              startIcon={<Check />}
              loading={presentLoading}
              // color="success"
              onClick={() => handleMarkAttendance(attendee, true)}
              sx={{ textTransform: "capitalize", ml: "auto", mr: 2 }}
            >
              Present
            </PrimaryLoadingButton>
            <SecondaryLoadingButton
              loading={absentLoading}
              disableElevation
              startIcon={<CloseOutlined />}
              variant="outlined"
              onClick={() => handleMarkAttendance(attendee, false)}
              sx={{ textTransform: "capitalize" }}
            >
              Absent
            </SecondaryLoadingButton>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
