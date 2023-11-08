import Attendance from "@/components/admin/attendance";
import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import NewAttendee from "@/components/shared/dialog/new_attendee";
import {
  BootstrapInput,
  StyledInputBase,
  TextInputField,
} from "@/components/shared/inputs";
import { fetcher } from "@/utils/swr_fetcher";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";

export default function Index() {
  const {
    data: events = [],
    error,
    isLoading,
  } = useSWR("events/mini", fetcher);
  const { setTopBarTitle, topbarTitle } = useContext(LayoutContext);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newAttendeeOpen, setNewAttendeeOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };
  const handleOpen = () => {
    setNewAttendeeOpen(!newAttendeeOpen);
  };
  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  useEffect(() => {
    if (selectedEvent !== "") {
      setTopBarTitle(selectedEvent.name);
    } else {
      setTopBarTitle("Attendance");
    }
  }, [selectedEvent]);

  return (
    <>
      <Head>
        <title>Attendance</title>
      </Head>
      <Box>
        <Typography
          color={"text.primary"}
          fontWeight={700}
          variant="h5"
          gutterBottom
        >
          Attendance
        </Typography>
        <Stack
          flexDirection={"row"}
          // justifyContent={"space-between"}
          flexWrap={{ xs: "wrap", lg: "nowrap" }}
          alignContent={"center"}
          width={"100%"}
          gap={2}
          sx={{ mt: 3, mb: 3 }}
        >
          <FormControl
            variant="standard"
            fullWidth
            sx={{ maxWidth: { xs: "100%", sm: 300 }, order: 1 }}
          >
            <Select
              fullWidth
              id="event-selection"
              labelId="event-selection-label"
              displayEmpty
              label="Select an event"
              value={selectedEvent}
              onChange={handleEventChange}
              input={
                <BootstrapInput
                  placeholder="Select an event"
                  label="Select an event"
                />
              }
            >
              {events?.items &&
                events?.items.map((event, index) => (
                  <MenuItem value={event}>{event.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
          {selectedEvent !== "" && (
            <>
              <StyledInputBase
                placeholder="Search attendee by name"
                onChange={handleQueryChange}
                sx={{
                  minWidth: { xs: "100%", sm: 300 },
                  order: { xs: 2, sm: 2 },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  ml: "auto",
                  order: { xs: 3, sm: 3 },
                }}
                disableElevation
                onClick={handleOpen}
              >
                Add Attendee
              </Button>
            </>
          )}
        </Stack>
        {selectedEvent === "" && (
          <Stack
            height={300}
            alignItems={"center"}
            // color={"text.primary"}
            justifyContent={"center"}
          >
            <Typography variant="subtitle1" fontSize={20}>
              Select an event
            </Typography>
          </Stack>
        )}
        {selectedEvent !== "" && (
          <Attendance event={selectedEvent} query={query} />
        )}
      </Box>
      <NewAttendee
        open={newAttendeeOpen}
        handleClose={handleOpen}
        event_id={selectedEvent?.id}
      />
    </>
  );
}

Index.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
