import { ImageCarousel } from "@/components/shared/gallery";
import EventDetailLoading from "@/components/users/eventDetailsLoading";
import LayoutTwo from "@/components/users/layoutTwo";
import RSVPModal, { SuccessModal } from "@/components/users/rsvpModal";
import { SnackbarContext } from "@/pages/_app";
import { APIClient } from "@/utils/axios";
import { formatDateInCustomFormat } from "@/utils/dateFormat";
import { fetcher } from "@/utils/swr_fetcher";
import { useTheme } from "@emotion/react";
import {
  CheckCircle,
  DateRange,
  FacebookOutlined,
  Instagram,
  LocationOn,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button, IconButton, Panel, Whisper } from "rsuite";
import useSWR from "swr";

export default function EventDetails() {
  const [eventImages, setEventImages] = useState([]);
  const [rsvpOpen, setRSVPOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const handleSuccessOpen = () => {
    setSuccessOpen(!successOpen);
  };

  const handleOpen = () => {
    setRSVPOpen(!rsvpOpen);
  };
  const router = useRouter();
  const {
    data: event,
    error,
    isLoading,
    mutate,
  } = useSWR("users/events/" + router.query.id, fetcher);

  const {
    data: following,
    error: followingError,
    isLoading: followingIsLoading,
  } = useSWR(
    () =>
      event?.organiser.id ? "users/me/following/" + event?.organiser.id : null,
    fetcher
  );

  const handleFollow = async () => {
    try {
      await APIClient.post("users/me/following/" + event.organiser.id);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response.status === 401) {
          setSnackSeverity("info");
          handleSnackbarOpen("You must login to follow an organiser!");
          router.push("/auth/users");
        }
      }
    }
  };

  useEffect(() => {
    if (event !== undefined) {
      setEventImages(() => event?.images.map((image, index) => image.url));
    }
  }, [event]);

  if (isLoading) {
    return <EventDetailLoading />;
  }
  return (
    <>
      <Head>
        <title>{event !== undefined && event.name}</title>
      </Head>
      <Box
        variant="outlined"
        sx={{
          width: "100%",
          height: 450,
          position: "relative",
          mb: 2,
          // borderStyle: "dotted",
        }}
      >
        <Image
          src={event?.cover_image}
          alt="event_image"
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ px: { xs: 2, md: 0 } }}>
        <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
          <p style={{ fontSize: 18 }}>
            {formatDateInCustomFormat(event?.start_date)}
          </p>
        </Stack>

        <h1>{event?.name}</h1>
        <p style={{ marginTop: "20px" }}>{event?.summary}</p>

        <Box my={2}>
          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Date and Time
          </h4>
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <DateRange fontSize="small" />
            <p style={{ fontSize: "15px" }}>
              {new Date(event?.start_date).toUTCString()}
            </p>
          </Stack>
        </Box>

        <Box my={2}>
          <h4 style={{ marginTop: "20px", marginBottom: "0px" }}>Location</h4>
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <List dense>
              <ListItem disableGutters disablePadding>
                <ListItemIcon>
                  <IconButton
                    icon={
                      <LocationOn
                        fontSize="small"
                        htmlColor="rgba(0,0,0,0.5)"
                      />
                    }
                    active
                    disabled
                  />
                </ListItemIcon>
                <ListItemText>
                  <h6 style={{ fontSize: "15px" }}>
                    {event?.address?.split(", ")[0]}
                  </h6>
                  <Stack flexDirection={"column"} gap={1} my={1}>
                    <p>{event?.address?.split(",").slice(1).join(", ")}</p>
                  </Stack>
                </ListItemText>
              </ListItem>
            </List>
          </Stack>
        </Box>

        <Box sx={{ my: 2 }}>
          <h4 style={{ marginBottom: 10 }}>About this event</h4>

          <Markdown components={{ h1: "h3", h2: "h4", h3: "h5", h4: "h5" }}>
            {event?.description}
          </Markdown>
        </Box>

        <Stack
          my={10}
          width={"100%"}
          maxHeight={300}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
        >
          <ImageCarousel images={eventImages} />
        </Stack>
        <Stack
          width={"100%"}
          flexDirection={"row"}
          justifyContent={"flex-start"}
          mt={5}
        >
          <Button
            color="green"
            appearance="primary"
            startIcon={<CheckCircle />}
            onClick={handleOpen}
          >
            Attend
          </Button>
        </Stack>
        {event?.organiser?.name && (
          <Stack flexDirection={"column"} gap={2} my={2}>
            <h4>About organiser</h4>
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                circle
                icon={
                  <Avatar
                    src={event?.organiser?.logo}
                    alt={event?.organiser?.name}
                    sx={{ height: "90px", width: "90px" }}
                  />
                }
              />
              <p
                style={{ marginTop: "15px", fontSize: 16, textAlign: "center" }}
              >
                organised by
              </p>
              <h2 style={{ marginTop: "15px", textAlign: "center" }}>
                {event?.organiser?.name}
              </h2>
              <Box>
                <h6 style={{ textAlign: "center" }}>
                  {event?.organiser?.followers_count}
                </h6>
                <Typography variant="subtitl1" style={{ textAlign: "center" }}>
                  followers
                </Typography>
              </Box>
              {following !== true && (
                <Button
                  onClick={handleFollow}
                  appearance="primary"
                  style={{
                    marginTop: "5px",
                  }}
                >
                  Follow
                </Button>
              )}
              <Typography
                style={{ marginTop: "15px", fontSize: 16, textAlign: "center" }}
                variant="subtitle2"
              >
                {event?.organiser?.summary}
              </Typography>
              <Stack my={2} flexDirection={"row"} gap={2}>
                <FacebookOutlined />
                <Instagram />
                <Telegram />
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>

      <RSVPModal
        open={rsvpOpen}
        handleClose={handleOpen}
        handleSuccessOpen={handleSuccessOpen}
        event_id={event?.id}
      />
      <SuccessModal
        open={successOpen}
        handleClose={handleSuccessOpen}
        event_name={event?.name}
      />
    </>
  );
}

EventDetails.getLayout = function (page) {
  return <LayoutTwo>{page}</LayoutTwo>;
};
