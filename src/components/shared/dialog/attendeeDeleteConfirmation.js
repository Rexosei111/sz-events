import theme from "@/theme";
import { DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  colors,
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
      <DialogTitle textAlign={"center"}>Confirm Delete</DialogTitle>
      <Divider variant="middle" />
      <DialogContent
        sx={{
          minHeight: 100,
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
          variant="outlined"
          sx={{
            textTransform: "capitalize",
            color: colors.common.white,
            borderColor: "transparent",
            "&: hover": {
              borderColor: theme.palette.common.white,
            },
          }}
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
          sx={{
            textTransform: "capitalize",
          }}
          color="primary"
          disableElevation
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
