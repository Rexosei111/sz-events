import { fetcher } from "@/utils/swr_fetcher";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import GridLoading from "../shared/loading/gridLoading";
import { SnackbarContext } from "@/pages/_app";
import { APIClient } from "@/utils/axios";
import useDebounce from "@/hooks/debounce";
import {
  Check,
  CloseOutlined,
  DeleteOutline,
  ImportExport,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import theme from "@/theme";
import AttendeeDetails from "../shared/dialog/attendeeDetails";
import AttendeeDeleteConfirmation from "../shared/dialog/attendeeDeleteConfirmation";

import { exportToExcel } from "@/utils/excelExport";
import { objectToQueryString } from "@/utils/queryParams";

function countObjectsWithPresentTrue(arr = [], value = true) {
  return arr.reduce((count, obj) => count + (obj.present === value ? 1 : 0), 0);
}

export default function Attendance({ event = "", query = "", params = {} }) {
  const debouncedQuery = useDebounce(query, 500);
  const [groupedItems, setGroupedItems] = useState({});
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [openAttendeeDetails, setOpenAttendeeDetails] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [openAttendeeDeleteConfirmation, setOpenAttendeeDeleteConfirmation] =
    useState(false);
  const [attendee, setAttendee] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);

  const {
    data: attendance,
    error,
    isLoading,
    mutate,
  } = useSWR(
    () =>
      `attendance/${
        event?.id
      }?query=${debouncedQuery}&page=${pageNumber}&${objectToQueryString(
        params
      )}`,
    fetcher
  );

  useEffect(() => {
    if (attendance !== undefined) {
      setAttendanceSummary((prevState) => ({
        ...prevState,
        total: attendance.total,
        present: countObjectsWithPresentTrue(attendance.items, true),
        absent: countObjectsWithPresentTrue(attendance.items, false),
      }));
    }
  }, [attendance]);
  const handleDownloadAttendance = async () => {
    setExporting(true);
    try {
      const { data } = await APIClient.get(
        `attendance/${
          event?.id
        }/download?query=${debouncedQuery}&${objectToQueryString(params)}`
      );
      const fileName = `${event?.name}_attendance.xlsx`;
      exportToExcel(data, fileName);
    } catch (error) {
      console.log(error);
    } finally {
      setExporting(false);
    }
  };
  const handleOpenAttendeeDetails = (attendee) => {
    setAttendee(attendee);
    setOpenAttendeeDetails(!openAttendeeDetails);
  };
  const handleOpenAttendeeDeleteConfirmation = (attendee) => {
    setAttendee(attendee);
    setOpenAttendeeDeleteConfirmation(!openAttendeeDeleteConfirmation);
  };

  useEffect(() => {
    if (attendance !== undefined) {
      setTotalPageCount(Math.ceil(attendance.total / 50));

      const sortedItems = attendance.items.sort((a, b) => {
        return a.first_name.localeCompare(b.first_name);
      });
      // Create an object to group items by the first letter of their 'first_name'
      const groupedItems = sortedItems.reduce((acc, item) => {
        const firstLetter = item.first_name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(item);
        return acc;
      }, {});
      setGroupedItems(groupedItems);
    }
  }, [attendance]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };
  if (event === "") {
    return (
      <Paper
        sx={{ width: "100%", minHeight: 300, bgcolor: "transparent" }}
        component={Stack}
        alignItems={"center"}
        justifyContent={"center"}
        elevation={0}
      >
        <Typography
          variant="subtitle2"
          fontSize={18}
          fontWeight={700}
          color={"rgba(0,0,0,0.6)"}
        >
          Select an event
        </Typography>
      </Paper>
    );
  }

  if (error) {
    setSnackSeverity("error");
    handleSnackbarOpen("Unable to load data!");
  }

  if (isLoading) {
    return <GridLoading />;
  }

  const handleMarkAttendance = async (attendee, present) => {
    try {
      const { data } = await APIClient.patch(
        `attendance/${event.id}?attendee_id=${attendee.id}&present=${present}`
      );
      mutate();
      setAttendanceSummary((prevState) => ({
        ...prevState,
        present: present === true ? prevState?.present + 1 : prevState?.present,
        absent: present === false ? prevState.absent + 1 : prevState.absent,
      }));
    } catch (error) {
      setSnackSeverity("error");
      handleSnackbarOpen(
        `Unable to take attendance for ${attendee.first_name}`
      );
    }
  };

  const deleteAttendee = async (attendee) => {
    try {
      await APIClient.delete(
        `attendance/${event.id}?attendee_id=${attendee.id}`
      );
      mutate();
      setAttendanceSummary((prevState) => ({
        ...prevState,
        total: prevState.total - 1,
        present:
          attendee.present === true
            ? prevState?.present - 1
            : prevState?.present,
        absent:
          attendee.present === false ? prevState.absent - 1 : prevState.absent,
      }));
      setOpenAttendeeDetails(false);
    } catch (error) {
      setSnackSeverity("error");
      handleSnackbarOpen(`Unable to remove attendee ${attendee.first_name}`);
    }
  };
  return (
    <Paper
      sx={{ width: "100%", minHeight: 300, bgcolor: "transparent" }}
      elevation={0}
    >
      {attendanceSummary && (
        <Stack
          width={"100%"}
          flexDirection={"row"}
          gap={2}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
          justifyContent={"space-between"}
          mb={2}
        >
          <Stack
            gap={2}
            flexDirection={"row"}
            alignItems={"center"}
            sx={{ display: { xs: "none", md: "block" } }}
            order={{ xs: 2, md: 1 }}
            ml={{ xs: "auto", md: 0 }}
          >
            {attendance && attendance.total !== 0 && (
              <LoadingButton
                disableElevation
                onClick={handleDownloadAttendance}
                loading={exporting}
                sx={{
                  textTransform: "capitalize",
                }}
                startIcon={<ImportExport />}
                variant="contained"
              >
                Download attendance
              </LoadingButton>
            )}
          </Stack>
          <Stack
            gap={2}
            flexDirection={"row"}
            order={{ xs: 1, md: 2 }}
            // ml={"auto"}
            alignItems={"center"}
          >
            <Chip label={`Total: ${attendanceSummary.total}`} />
            <Chip label={`Present: ${attendanceSummary.present}`} />
            <Chip label={`Absent: ${attendanceSummary.absent}`} />
          </Stack>
        </Stack>
      )}
      {attendance && attendance?.total === 0 && (
        <Stack
          width={"100%"}
          height={300}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h5" textAlign={"center"}>
            There are no attendee(s) {query !== "" && `with name "${query}"`}{" "}
            for this event.
          </Typography>
        </Stack>
      )}
      {attendance !== undefined &&
        attendance?.total > 0 &&
        Object.keys(groupedItems).map((letter, index) => (
          <Box key={index} mb={4}>
            <Typography
              variant="h6"
              mb={2}
              color={"text.secondary"}
              fontWeight={700}
            >
              {letter}
            </Typography>

            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {groupedItems[letter].map((item, index) => (
                <Grid item xs={12} sm={4} md={3} lg={3} xl={2} key={index}>
                  <Card>
                    <CardActionArea
                      sx={{ p: 2 }}
                      onClick={() => handleOpenAttendeeDetails(item)}
                    >
                      <Stack
                        flexDirection={"column"}
                        gap={1}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Avatar sx={{ width: 80, height: 80 }}>
                          {item.first_name.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="caption"
                          fontSize={15}
                          fontWeight={700}
                          mt={1}
                          // gutterBottom
                        >
                          {`${item.first_name} ${item.last_name}`}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontSize={13}
                          // fontWeight={700}
                        >
                          Status: {item?.present ? "Present" : "Absent"}
                        </Typography>
                      </Stack>
                    </CardActionArea>
                    <CardActions>
                      <Stack
                        width={"100%"}
                        flexDirection={"row"}
                        gap={2}
                        px={2}
                        justifyContent={"space-between"}
                      >
                        <Tooltip title={"Present"}>
                          <IconButton
                            // label={"P"}

                            onClick={() => handleMarkAttendance(item, true)}
                            sx={{
                              fontSize: 18,
                              width: 40,
                              height: 40,
                              bgcolor:
                                item.present === true
                                  ? theme.palette.primary.main
                                  : null,
                              "&: hover": {
                                bgcolor:
                                  item.present === true
                                    ? theme.palette.primary.dark
                                    : null,
                              },
                            }}
                          >
                            <Check
                              htmlColor={
                                item.present === true
                                  ? "white"
                                  : theme.palette.text.primary
                              }
                            />
                          </IconButton>
                        </Tooltip>
                        {/* <MarkAttendanceBtn item={item} present={true} />
                      <MarkAttendanceBtn item={item} present={false} /> */}

                        <Tooltip title={"Absent"}>
                          <IconButton
                            onClick={() => handleMarkAttendance(item, false)}
                            size="small"
                            sx={{
                              fontSize: 18,
                              width: 40,
                              height: 40,
                              bgcolor:
                                item.present === false
                                  ? theme.palette.primary.main
                                  : null,
                              "&: hover": {
                                bgcolor:
                                  item.present === false
                                    ? theme.palette.primary.dark
                                    : null,
                              },
                            }}
                          >
                            <CloseOutlined
                              htmlColor={
                                item.present === false
                                  ? "white"
                                  : theme.palette.text.primary
                              }
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete"}>
                          <IconButton
                            onClick={() =>
                              handleOpenAttendeeDeleteConfirmation(item)
                            }
                            sx={{
                              fontSize: 18,
                              width: 40,
                              height: 40,
                            }}
                          >
                            <DeleteOutline htmlColor={"text.primary"} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      <AttendeeDetails
        open={openAttendeeDetails}
        handleClose={handleOpenAttendeeDetails}
        attendee={attendee}
        mutate={mutate}
        summaryMutate={setAttendanceSummary}
        event_id={event?.id}
        summary={attendanceSummary}
        handleMarkAttendance={handleMarkAttendance}
        handleDeleteConfirmation={handleOpenAttendeeDeleteConfirmation}
        deleteAttendee={deleteAttendee}
      />
      <AttendeeDeleteConfirmation
        open={openAttendeeDeleteConfirmation}
        handleClose={handleOpenAttendeeDeleteConfirmation}
        attendee={attendee}
        handleDelete={deleteAttendee}
      />
      {attendance && attendance.items.length > 0 && (
        <Stack alignItems={"center"} justifyContent={"center"} mt={2}>
          <Pagination
            count={totalPageCount}
            page={pageNumber}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
            hideNextButton
            hidePrevButton
          />
        </Stack>
      )}
    </Paper>
  );
}
