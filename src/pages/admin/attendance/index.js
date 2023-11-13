import Attendance from "@/components/admin/attendance";
import AttendeeFilter from "@/components/admin/attendeeFilter";
import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import { PrimaryButton, SecondaryButton } from "@/components/btn/baseBtn";
import { SecondaryLoadingButton } from "@/components/btn/loadingBtn";
import NewAttendee from "@/components/shared/dialog/new_attendee";
import {
  BootstrapInput,
  StyledInputBase,
  TextInputField,
} from "@/components/shared/inputs";
import { APIClient } from "@/utils/axios";
import { exportToExcel } from "@/utils/excelExport";
import { objectToQueryString } from "@/utils/queryParams";
import { fetcher } from "@/utils/swr_fetcher";
import { Filter1Outlined, FilterListOutlined } from "@mui/icons-material";
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
  const [params, setParams] = useState({
    occupations: [],
    invitations: [],
    present: null,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };
  const handleOpen = () => {
    setNewAttendeeOpen(!newAttendeeOpen);
  };

  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen);
  };
  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleDownloadAttendance = async () => {
    setExporting(true);
    try {
      const { data } = await APIClient.get(
        `attendance/${
          selectedEvent?.id
        }/download?query=${query}&${objectToQueryString(params)}`
      );
      const fileName = `${selectedEvent?.name}_attendance.xlsx`;
      exportToExcel(data, fileName);
    } catch (error) {
      console.log(error);
    } finally {
      setExporting(false);
    }
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
          alignItems={"flex-start"}
          width={"100%"}
          gap={2}
          sx={{ my: 3 }}
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
              <Stack
                flexDirection={"column"}
                minWidth={{ xs: "100%", sm: 300 }}
                order={{ xs: 2, sm: 2 }}
              >
                <StyledInputBase
                  placeholder="Search attendee by name"
                  onChange={handleQueryChange}
                  fullWidth
                />
                <SecondaryButton
                  variant="text"
                  onClick={handleFilterOpen}
                  size="small"
                  sx={{ mr: "auto" }}
                  startIcon={<FilterListOutlined fontSize="small" />}
                >
                  Filter
                </SecondaryButton>
              </Stack>
              <Stack
                flexDirection={"row"}
                justifyContent={"flex-end"}
                gap={2}
                sx={{
                  ml: "auto",
                  order: { xs: 3, sm: 3 },
                }}
              >
                <SecondaryLoadingButton
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                  onClick={handleDownloadAttendance}
                  loading={exporting}
                  variant="outlined"
                  disableElevation
                >
                  Download Attendance
                </SecondaryLoadingButton>
                <PrimaryButton
                  variant="contained"
                  disableElevation
                  onClick={handleOpen}
                >
                  Add Attendee
                </PrimaryButton>
              </Stack>
            </>
          )}
        </Stack>
        {selectedEvent === "" && (
          <Stack height={300} alignItems={"center"} justifyContent={"center"}>
            <Typography variant="subtitle1" fontSize={20}>
              Select an event
            </Typography>
          </Stack>
        )}
        {selectedEvent !== "" && (
          <Attendance event={selectedEvent} query={query} params={params} />
        )}
      </Box>
      <NewAttendee
        open={newAttendeeOpen}
        handleClose={handleOpen}
        event_id={selectedEvent?.id}
      />
      <AttendeeFilter
        open={filterOpen}
        handleClose={handleFilterOpen}
        params={params}
        setParams={setParams}
      />
    </>
  );
}

Index.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
