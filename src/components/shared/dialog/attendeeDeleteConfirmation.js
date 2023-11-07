import { DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function AttendeeDeleteConfirmation({
  open,
  handleClose,
  attendee,
  handleDelete,
}) {
  const [deleting, setDeleting] = useState(false);
  const handleAttendeeDelete = async () => {
    setDeleting(true);
    await handleDelete(attendee);
    setDeleting(false);
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent
        sx={{
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, md: 6 },
        }}
      >
        <Typography variant="h5" textAlign={"center"} fontSize={17}>
          Are you sure you want to delete this attendee (
          {`${attendee?.first_name} ${attendee?.last_name}`}
          )?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          sx={{ textTransform: "capitalize" }}
          color="info"
          onClick={handleClose}
          disableElevation
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={deleting}
          startIcon={<DeleteOutline />}
          onClick={handleAttendeeDelete}
          sx={{ textTransform: "capitalize" }}
          color="error"
          disableElevation
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
