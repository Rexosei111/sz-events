import EventListingCard from "@/components/admin/eventListing";
import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import { PrimaryButton } from "@/components/btn/baseBtn";
import { StyledInputBase } from "@/components/shared/inputs";
import GridLoading from "@/components/shared/loading/gridLoading";
import useDebounce from "@/hooks/debounce";
import { fetcher } from "@/utils/swr_fetcher";
import { Button, Grid, Pagination, Stack, Typography } from "@mui/material";
import Head from "next/head";
// import Link from "next/link";
import Link from "@/components/shared/Link";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";

export default function Index() {
  const [query, setQuery] = useState("");
  const { setTopBarTitle } = useContext(LayoutContext);

  const debouncedQuery = useDebounce(query, 500);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const {
    data: events,
    error,
    isLoading,
  } = useSWR(`/events/?query=${debouncedQuery}&page=${pageNumber}`, fetcher);
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  setTopBarTitle("Your events");
  useEffect(() => {
    if (events !== undefined) {
      setTotalPageCount(Math.ceil(events.total / 50));
    }
  }, [events]);
  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };
  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <Typography
        color={"text.primary"}
        fontWeight={700}
        variant="h5"
        gutterBottom
      >
        Events
      </Typography>
      <Stack
        width={"100%"}
        flexDirection={"row"}
        alignItems={"center"}
        flexWrap={{ xs: "wrap-reverse", md: "nowrap" }}
        gap={2}
        my={2}
        justifyContent={"space-between"}
      >
        <StyledInputBase
          placeholder="Search event by name"
          onChange={handleQueryChange}
          sx={{
            minWidth: { xs: "100%", sm: 300 },
          }}
        />

        <PrimaryButton
          variant="contained"
          component={Link}
          href="/admin/events/new"
          disableElevation
        >
          Create Event
        </PrimaryButton>
      </Stack>
      {isLoading && <GridLoading />}
      <Grid
        container
        rowSpacing={5}
        columnSpacing={{ xs: 2, sm: 3, md: 4 }}
        mt={2}
      >
        {events?.items &&
          events?.items.length > 0 &&
          events.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={5} lg={4} xl={2} key={index}>
              <EventListingCard event={item} />
            </Grid>
          ))}
      </Grid>
      {events && events.items.length > 0 && (
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
    </>
  );
}

Index.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
