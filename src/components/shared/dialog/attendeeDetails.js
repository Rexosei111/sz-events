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
  CheckCircleOutline,
  CheckOutlined,
  CloseOutlined,
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
      summaryMutate({
        ...summary,
        present: present === true ? summary?.present + 1 : summary?.present,
        absent: present === false ? summary.absent + 1 : summary.absent,
      });
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
          <Box width={"100%"}>
            <LoadingButton
              variant="contained"
              disableElevation
              startIcon={<CheckCircleOutline />}
              loading={presentLoading}
              color="success"
              onClick={() => handleMarkAttendance(attendee, true)}
              sx={{ textTransform: "capitalize", ml: "auto", mr: 2 }}
            >
              Present
            </LoadingButton>
            <LoadingButton
              loading={absentLoading}
              disableElevation
              startIcon={<CloseOutlined />}
              variant="contained"
              onClick={() => handleMarkAttendance(attendee, false)}
              color="error"
              sx={{ textTransform: "capitalize" }}
            >
              Absent
            </LoadingButton>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
