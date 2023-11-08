import LayoutTwo from "@/components/users/layoutTwo";
import {
  Box,
  Container,
  Grid,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Head from "next/head";
import React from "react";
import { Cabin } from "next/font/google";
import { Input, InputGroup, Nav } from "rsuite";
import useSWR from "swr";
import SearchIcon from "@rsuite/icons/Search";
import { fetcher } from "@/utils/swr_fetcher";
import EventListingCard, {
  UserEventListingCard,
} from "@/components/admin/eventListing";
import { useState } from "react";
import { useEffect } from "react";
import useDebounce from "@/hooks/debounce";
import {
  getEndOfDayRange,
  getMonthToDateRange,
  getWeekDates,
  getWeekendDates,
} from "@/utils/dateFormat";
import { removeNullStrings } from "@/utils/clip";
import GridLoading from "@/components/shared/loading/gridLoading";
import { AntTab, AntTabs } from "@/components/shared/tabs";

export const cabin = Cabin({
  weight: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const styles = {
  width: 300,
  // marginBottom: 10,
};

const tabDateRange = {
  All: {},
  Today: getEndOfDayRange(),
  "This week": getWeekDates(),
  "This weekend": getWeekendDates(),
  "This month": getMonthToDateRange(),
};

export default function EventListing() {
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [activeTab, setActiveTab] = useState("All");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [dateRanges, setDateRanges] = useState({});
  const {
    data: events,
    error,
    isLoading,
  } = useSWR(
    removeNullStrings(
      `/users/events/mini?query=${debounceQuery}${
        dateRanges?.start_date ? `&start_date=${dateRanges?.start_date}` : null
      }${dateRanges?.end_date ? `&end_date=${dateRanges?.end_date}` : null}`
    ),
    fetcher
  );

  useEffect(() => {
    if (events !== undefined) {
      setTotalPageCount(Math.ceil(events.total / 50));
    }
  }, [events]);

  useEffect(() => {
    setDateRanges(tabDateRange[activeTab]);
  }, [activeTab]);

  const handleQueryChange = (value) => {
    setQuery(value);
  };
  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const handleTabChange = (event, newValue) => {
    console.log(newValue);
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 0 } }}>
      <Head>
        <title>Events</title>
      </Head>

      <Stack
        flexDirection={"row"}
        justifyContent="space-between"
        gap={1}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
        alignItems="center"
      >
        <Typography variant="h4" color={"text.primary"}>
          Events
        </Typography>

        <InputGroup inside style={{ width: sm ? "100%" : 300 }}>
          <Input
            placeholder="Search event"
            onChange={handleQueryChange}
            style={{ backgroundColor: "#1c1f20" }}
          />
          <InputGroup.Button>
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>
      </Stack>
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: 480, md: 600 },
          bgcolor: "background.default",
        }}
        my={2}
      >
        <AntTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
        >
          <AntTab
            label="All"
            value={"All"}
            sx={{
              textTransform: "capitalize",
              // color: (theme) => theme.palette.info.main,
            }}
          />
          <AntTab
            label="Today"
            value={"Today"}
            sx={{
              textTransform: "capitalize",
              // color: (theme) => theme.palette.info.main,
            }}
          />
          <AntTab
            label="This week"
            value={"This week"}
            sx={{
              textTransform: "capitalize",
              // color: (theme) => theme.palette.info.main,
            }}
          />
          <AntTab
            label="This weekend"
            value={"This weekend"}
            sx={{
              textTransform: "capitalize",
              // color: (theme) => theme.palette.info.main,
            }}
          />
          <AntTab
            label="This month"
            value={"This month"}
            sx={{
              textTransform: "capitalize",
              // color: (theme) => theme.palette.info.main,
            }}
          />
        </AntTabs>
      </Box>

      {isLoading && <GridLoading />}
      {!isLoading && events?.items && events?.items.length === 0 && (
        <Stack height={100} alignItems={"center"} justifyContent={"center"}>
          <Typography variant="subtitle" fontWeight={700} fontSize={22}>
            There are no events{" "}
            {activeTab !== "All" && `for ${activeTab.toLowerCase()}`}
          </Typography>
        </Stack>
      )}
      {!isLoading && events?.items && events?.items.length > 0 && (
        <Grid
          container
          rowSpacing={5}
          columnSpacing={{ xs: 2, sm: 3, md: 4 }}
          // mt={2}
        >
          {events.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={2} key={index}>
              <UserEventListingCard event={item} />
            </Grid>
          ))}
        </Grid>
      )}
      {events && events.items.length > 0 && (
        <Stack alignItems={"center"} justifyContent={"center"} mt={2}>
          <Pagination
            page={pageNumber}
            total={totalPageCount}
            limit={50}
            onChange={setPageNumber}
          />
        </Stack>
      )}
    </Box>
  );
}

EventListing.getLayout = function (page) {
  return <LayoutTwo>{page}</LayoutTwo>;
};
