import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TextInputField } from "../shared/inputs";
import MultipleSelectPublicity from "../shared/select";
import { PrimaryButton, SecondaryButton } from "../btn/baseBtn";

export default function AttendeeFilter({
  open,
  handleClose,
  params,
  setParams,
}) {
  const [occupations, setOccupations] = useState([]);
  const [invitaions, setInvitations] = useState([]);
  const [present, setPresent] = useState(null);

  useEffect(() => {
    console.log(params);
    if (params !== null) {
      setOccupations(params?.occupations === null ? [] : params?.occupations);
      setInvitations(params?.invitaions === null ? [] : params?.invitaions);
      setPresent(params?.present);
    }
  }, [params]);
  const handlePresentChange = (event) => {
    setPresent(event.target.value);
  };

  const handleOccupationChange = (event) => {
    if (event.target.checked === true) {
      setOccupations((prevState) => [...prevState, event.target.value]);
    } else {
      setOccupations((prevState) =>
        prevState.filter((item) => item !== event.target.value)
      );
    }
  };

  const handleInvitaionsChange = (event) => {
    if (event.target.checked === true) {
      setInvitations((prevState) => [...prevState, event.target.value]);
    } else {
      setInvitations((prevState) =>
        prevState.filter((item) => item !== event.target.value)
      );
    }
  };

  const handleClearFilters = () => {
    setParams({ occupations: [], invitaions: [], present: null });
    // setOccupations([]);
    // setInvitations([]);
    // setPresent(null);
  };
  console.log(occupations);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Filter attendees</DialogTitle>
      <DialogContent>
        <Stack
          flexDirection={"row"}
          gap={2}
          alignItems={"flex-start"}
          flexWrap={{ xs: "wrap", sm: "nowrap" }}
        >
          <Box width={"100%"} sx={{ display: "flex" }}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel
                component="legend"
                sx={{ fontSize: 13, color: "text.primary" }}
              >
                Filter attendees by occupation
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={occupations.includes("student")}
                      size="small"
                      onChange={handleOccupationChange}
                      name={"Student"}
                      value={"student"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Student"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={occupations.includes("worker")}
                      size="small"
                      onChange={handleOccupationChange}
                      name="Worker"
                      value={"worker"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Worker"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={occupations.includes("other")}
                      size="small"
                      onChange={handleOccupationChange}
                      name="Other"
                      value={"other"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Other"
                />
              </FormGroup>
              {/* <FormHelperText>Filter attendees by occupation</FormHelperText> */}
            </FormControl>
          </Box>
          <Box width={"100%"} sx={{ display: "flex" }}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel
                component="legend"
                sx={{ fontSize: 13, color: "text.primary" }}
              >
                Filter attendees by mode of invitation
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleInvitaionsChange}
                      name={"via_whatsapp"}
                      value={"via_whatsapp"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Whatsapp"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleInvitaionsChange}
                      name="via_instagram"
                      value={"via_instagram"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Instagram"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleInvitaionsChange}
                      name="by_member"
                      value={"by_member"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Member"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleInvitaionsChange}
                      name="by_friend"
                      value={"by_friend"}
                    />
                  }
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Friend"
                />
              </FormGroup>
              {/* <FormHelperText>Filter attendees by occupation</FormHelperText> */}
            </FormControl>
          </Box>

          <Box width={"100%"} sx={{ display: "flex" }}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel
                component="legend"
                sx={{ fontSize: 13, color: "text.primary" }}
              >
                Filter attendees by Presence status
              </FormLabel>
              <RadioGroup value={present} onChange={handlePresentChange}>
                <FormControlLabel
                  value={true}
                  control={<Radio size="small" />}
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Present"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio size="small" />}
                  slotProps={{
                    typography: {
                      fontSize: 13,
                    },
                  }}
                  label="Absent"
                />
              </RadioGroup>
              {/* <FormHelperText>Filter attendees by occupation</FormHelperText> */}
            </FormControl>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          variant="outlined"
          disableElevation
          onClick={handleClearFilters}
        >
          Clear filters
        </SecondaryButton>
        <PrimaryButton variant="contained" disableElevation>
          Apply
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
