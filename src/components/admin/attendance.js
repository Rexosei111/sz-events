import { fetcher } from "@/utils/swr_fetcher";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Pagination,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import GridLoading from "../shared/loading/gridLoading";
import { SnackbarContext } from "@/pages/_app";
import { APIClient } from "@/utils/axios";
import useDebounce from "@/hooks/debounce";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  borderRadius: 10,
  textAlign: "center",
  minHeight: 200,
  boxShadow: "0px 3px 17px 0px rgba(0,0,0,0.1)",
  color: theme.palette.text.secondary,
}));

function countObjectsWithPresentTrue(arr, value = true) {
  return arr.reduce((count, obj) => count + (obj.present === value ? 1 : 0), 0);
}

export default function Attendance({ event = "", query = "" }) {
  const debouncedQuery = useDebounce(query, 500);
  const [groupedItems, setGroupedItems] = useState({});
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);

  const {
    data: attendance,
    error,
    isLoading,
    mutate,
  } = useSWR(
    () => `attendance/${event?.id}?query=${debouncedQuery}&page=${pageNumber}`,
    fetcher
  );

  const {
    data: summary,
    error: summaryError,
    isLoading: summaryLoading,
    mutate: summaryMutate,
  } = useSWR(() => `attendance/${event?.id}/summary`, fetcher);

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
      summaryMutate({
        ...summary,
        present: present === true ? summary?.present + 1 : summary?.present,
        absent: present === false ? summary.absent + 1 : summary.absent,
      });
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
      summaryMutate({
        ...summary,
        total: summary.total - 1,
        present:
          attendee.present === true ? summary?.present - 1 : summary?.present,
        absent:
          attendee.present === false ? summary.absent - 1 : summary.absent,
      });
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
      {summary && (
        <Stack
          width={"100%"}
          flexDirection={"row"}
          gap={2}
          justifyContent={"flex-end"}
        >
          <Chip label={`Total: ${summary.total}`} />
          <Chip label={`Present: ${summary.present}`} />
          <Chip label={`Absent: ${summary.absent}`} />
        </Stack>
      )}
      {Object.keys(groupedItems).map((letter, index) => (
        <Box key={index} mb={4}>
          <Typography variant="h5" mb={2} color={"rgba(0,0,0,0.8)"}>
            {letter}
          </Typography>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {groupedItems[letter].map((item, index) => (
              <Grid item xs={12} sm={4} md={3} lg={3} xl={2} key={index}>
                <Item>
                  <Stack
                    flexDirection={"column"}
                    gap={2}
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
                    >
                      {`${item.first_name} ${item.last_name}`}
                    </Typography>
                    <Stack
                      width={"100%"}
                      flexDirection={"row"}
                      gap={2}
                      px={2}
                      justifyContent={"space-between"}
                    >
                      <Chip
                        label={"P"}
                        onClick={() => handleMarkAttendance(item, true)}
                        sx={{
                          fontSize: 18,
                          width: 40,
                          height: 40,
                          bgcolor: item.present === true ? "#05df05" : null,
                          color:
                            item.present === true ? "white" : "rgba(0,0,0,0.4)",
                          borderRadius: "50%",
                        }}
                      />
                      <Chip
                        label={"A"}
                        onClick={() => handleMarkAttendance(item, false)}
                        sx={{
                          fontSize: 18,
                          width: 40,
                          height: 40,
                          bgcolor: item.present === false ? "#dd125b" : null,
                          color:
                            item.present === false
                              ? "white"
                              : "rgba(0,0,0,0.4)",
                          borderRadius: "50%",
                        }}
                      />
                      <Chip
                        label={"D"}
                        onClick={() => deleteAttendee(item)}
                        sx={{
                          fontSize: 18,
                          width: 40,
                          height: 40,
                          bgcolor: "red",
                          color: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </Stack>
                  </Stack>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
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
