import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import { fetcher } from "@/utils/swr_fetcher";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Markdown from "react-markdown";
import {
  DateRange,
  Delete,
  LocationCity,
  LocationOn,
} from "@mui/icons-material";
import Link from "@/components/shared/Link";
import { ImageCarousel, ImageRender } from "@/components/shared/gallery";
import Head from "next/head";
import { APIClient } from "@/utils/axios";
import { isAxiosError } from "axios";
import { SnackbarContext } from "@/pages/_app";
import { LoadingButton } from "@mui/lab";
import { SecondaryLoadingButton } from "@/components/btn/loadingBtn";
import { PrimaryButton } from "@/components/btn/baseBtn";
import { formatEventDate } from "@/utils/dateFormat";

const DetailsLoadingSkeleton = () => {
  return (
    <Stack flexDirection={"column"} gap={2} width={"100%"} height={"89vh"}>
      <Skeleton variant="rectangular" width={"100%"} height={"30%"} />
      <Skeleton variant="text" width={"70%"} height={"8%"} />
      <Box width={"100%"}>
        {Array.from(Array(10)).map((_, index) => (
          <Skeleton variant="text" width={"80%"} height={"8%"} key={index} />
        ))}
      </Box>
    </Stack>
  );
};

export default function EventDetailsPage() {
  const { setTopBarTitle, topbarTitle } = useContext(LayoutContext);
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const [eventImages, setEventImages] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();
  const {
    data: event,
    error,
    isLoading,
    mutate,
  } = useSWR("events/" + router.query.id, fetcher);

  useEffect(() => {
    if (event !== undefined) {
      setTopBarTitle(event?.name);
      setEventImages(() => event?.images.map((image, index) => image.url));
    }
  }, [event]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await APIClient.delete(`events/${router.query.id}`);
      router.push("/admin/events");
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to delete this event!");
      }
    } finally {
      setDeleting(false);
    }
  };
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const { data } = await APIClient.patch(`events/${router.query.id}`, {
        ...event,
        published: !event?.published,
      });
      setSnackSeverity("success");
      handleSnackbarOpen(
        `Event has been ${!event?.published ? "published" : "unpublished"}`
      );
      mutate(data);
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to publish this event");
      }
    } finally {
      setPublishing(false);
    }
  };
  if (isLoading) {
    return <DetailsLoadingSkeleton />;
  }
  return (
    <Paper sx={{ width: "100%", p: 3 }} elevation={0}>
      <Head>
        <title>{topbarTitle}</title>
      </Head>
      <Stack
        flexDirection={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
        mb={2}
      >
        <SecondaryLoadingButton
          onClick={handlePublish}
          loading={publishing}
          disableElevation
          variant="outlined"
          color="primary"
        >
          {event?.published ? "Unpublish" : "Publish"}
        </SecondaryLoadingButton>
      </Stack>
      <Typography
        variant="h4"
        fontSize={35}
        fontWeight={700}
        gutterBottom
        color={"text.primary"}
        mb={2}
      >
        {event?.name}
      </Typography>
      <Stack
        flexDirection={"row"}
        gap={{ xs: 1, sm: 2 }}
        alignItems={"center"}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
      >
        <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
          <LocationOn fontSize="small" />
          <Typography variant="subtitle2" fontSize={13} component={"span"}>
            {event?.address}
          </Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
          <DateRange fontSize="small" />
          <Typography variant="subtitle2" fontSize={13} component={"span"}>
            {formatEventDate(event?.start_date)}
          </Typography>
        </Stack>
      </Stack>
      {/* <Box height={450} width={"100%"} my={2}>
        <img
          src={event?.cover_image}
          alt="event_image"
          // fill
          style={{ objectFit: "fill", height: "100%", width: "100%" }}
        />
      </Box> */}
      <Box
        variant="outlined"
        sx={{
          width: "100%",
          height: { xs: 450, md: 555 },
          position: "relative",
          my: 2,
        }}
      >
        {event?.cover_image !== null && (
          <Image
            src={event?.cover_image}
            alt="event_image"
            fill
            // width={0}
            // unoptimized={true}
            style={{ objectFit: "cover" }}
          />
        )}
      </Box>
      <Markdown components={{ h1: "h3" }}>{event?.description}</Markdown>

      <Stack
        my={10}
        width={"100%"}
        maxHeight={300}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <ImageCarousel images={eventImages} />
      </Stack>
      <Stack
        width={"100%"}
        flexDirection={"row"}
        justifyContent={"flex-end"}
        gap={2}
        mt={5}
      >
        <SecondaryLoadingButton
          loading={deleting}
          variant="outlined"
          onClick={handleDelete}
          startIcon={<Delete fontSize="small" />}
          disableElevation
        >
          Delete
        </SecondaryLoadingButton>
        <PrimaryButton
          component={Link}
          href={{ pathname: `/admin/events/${event?.id}/edit` }}
          variant="contained"
          disableElevation
        >
          Edit
        </PrimaryButton>
      </Stack>
    </Paper>
  );
}

EventDetailsPage.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
