import LayoutTwo from "@/components/users/layoutTwo";
import {
  Box,
  Container,
  Grid,
  Pagination,
  Stack,
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
  FollowingOrganiserCard,
  UserEventListingCard,
} from "@/components/admin/eventListing";
import { useState } from "react";
import { useEffect } from "react";
import useDebounce from "@/hooks/debounce";

import { removeNullStrings } from "@/utils/clip";
import GridLoading from "@/components/shared/loading/gridLoading";

export default function FollowingPage() {
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const {
    data: following,
    error,
    isLoading,
  } = useSWR(`users/me/following?query=${debounceQuery}`, fetcher);

  useEffect(() => {
    if (following !== undefined) {
      setTotalPageCount(Math.ceil(following.total / 50));
    }
  }, [following]);

  const handleQueryChange = (value) => {
    setQuery(value);
  };
  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ px: { xs: 2, md: 0 } }}>
      <Head>
        <title>Following</title>
      </Head>

      <Stack
        flexDirection={"row"}
        justifyContent="space-between"
        gap={1}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" color={"text.primary"}>
          Following
        </Typography>
        <InputGroup inside style={{ width: sm ? "100%" : 300 }}>
          <Input
            placeholder="Search organisers"
            onChange={handleQueryChange}
            style={{ backgroundColor: "#1c1f20" }}
          />
          <InputGroup.Button>
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>
      </Stack>

      {isLoading && <GridLoading />}

      {!isLoading && following?.items && following?.items.length > 0 && (
        <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
          {following.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={2} key={index}>
              <FollowingOrganiserCard organiser={item} />
            </Grid>
          ))}
        </Grid>
      )}
      {following && following.items.length > 0 && (
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

FollowingPage.getLayout = function (page) {
  return <LayoutTwo>{page}</LayoutTwo>;
};
