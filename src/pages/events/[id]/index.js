import { PrimaryButton } from "@/components/btn/baseBtn";
import { ImageCarousel } from "@/components/shared/gallery";
import EventDetailLoading from "@/components/users/eventDetailsLoading";
import LayoutTwo from "@/components/users/layoutTwo";
import RSVPModal, { SuccessModal } from "@/components/users/rsvpModal";
import { SnackbarContext } from "@/pages/_app";
import { APIClient } from "@/utils/axios";
import { formatDateInCustomFormat, formatEventDate } from "@/utils/dateFormat";
import { fetcher } from "@/utils/swr_fetcher";
import {
  AddOutlined,
  CheckCircle,
  DateRange,
  Instagram,
  LocationOn,
  LocationOnOutlined,
  Telegram,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios, { isAxiosError } from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";
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
  } = useSWR("users/events/" + router.query.id, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: following,
    error: followingError,
    isLoading: followingIsLoading,
  } = useSWR(
    () =>
      event?.organiser.id ? "users/me/following/" + event?.organiser.id : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
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
        <title>{event?.name}</title>
        <meta
          property="og:title"
          content={"GOOD SHEPHERD CONFERENCE: SEED OF REVOLUTION"}
        />
        <meta
          property="og:description"
          content={
            "Good Shepherd Conference is an atmosphere of dynamic spiritual travail that is birthing forth a mass evolution all over the Earth according to the vision of the Lord Jesus Christ. It is a mega event in the timeline of the body of Christ subscribed to the mandate of perfecting the saints."
          }
        />
        <meta
          property="og:image"
          content={
            "https://sz-event-bucket.s3.eu-west-3.amazonaws.com/14cdcc91-1127-4921-8f98-8a73d4ccae58.png"
          }
        />
        <meta
          property="og:url"
          content={`https://sz-events.vercel.app/events/49a55f33-e2d1-4efd-bb6e-dee5fb7f4e4a`}
        />
        <meta property="og:type" content="website" />
      </Head>
      <Box
        variant="outlined"
        sx={{
          width: "100%",
          height: 450,
          position: "relative",
          mb: 2,
        }}
      >
        <Image
          src={event?.cover_image}
          alt="event_image"
          fill
          style={{ objectFit: "fill" }}
        />
      </Box>
      <Box sx={{ px: { xs: 2, md: 0 } }}>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          mb={2}
          gap={1}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent={{ xs: "flex-start", md: "space-between" }}
        >
          <Typography
            variant="caption"
            component={"div"}
            color={"text.secondary"}
            sx={{ fontSize: 18 }}
          >
            {formatDateInCustomFormat(event?.start_date)}
          </Typography>
          <PrimaryButton
            disableElevation
            // sx={{ ml: "auto" }}
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleOpen}
          >
            Attend
          </PrimaryButton>
        </Stack>

        <Typography
          variant="h1"
          fontSize={45}
          fontWeight={700}
          color={"text.primary"}
        >
          {event?.name}
        </Typography>
        <Typography
          variant="subtitle2"
          lineHeight={1.7}
          fontSize={15}
          color={"text.secondary"}
          sx={{ my: 2 }}
        >
          {event?.summary}
        </Typography>

        <Box my={2}>
          <Typography variant="h5" color={"text.primary"} sx={{ my: 2 }}>
            Date and Time
          </Typography>
          <Stack
            flexDirection={"row"}
            gap={1}
            alignItems={"center"}
            color={"text.secondary"}
          >
            <DateRange fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontSize: "15px" }}>
              {formatEventDate(event?.start_date)}
            </Typography>
          </Stack>
        </Box>

        <Box my={2} color={"text.secondary"}>
          <Typography variant="h5" sx={{ mt: 2 }} color={"text.primary"}>
            Location
          </Typography>
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <List dense>
              <ListItem disableGutters disablePadding>
                <ListItemIcon>
                  <IconButton disabled>
                    <LocationOnOutlined fontSize="medium" htmlColor="white" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body1"
                    color={"text.primary"}
                    sx={{ fontSize: "15px" }}
                  >
                    {event?.address?.split(", ")[0]}
                  </Typography>
                  <Stack flexDirection={"column"} gap={1} my={1}>
                    <Typography
                      variant="caption"
                      color={"text.secoondary"}
                      sx={{ fontSize: "15px" }}
                    >
                      {event?.address?.split(",").slice(1).join(", ")}
                    </Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
            </List>
          </Stack>
        </Box>

        <Box sx={{ my: 2 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color={"text.primary"}
            sx={{ mb: 2 }}
          >
            About this event
          </Typography>

          <Box fontSize={15} color={"text.secondary"} lineHeight={1.7}>
            <Markdown components={{ h1: "h3", h2: "h4", h3: "h5", h4: "h5" }}>
              {event?.description}
            </Markdown>
          </Box>
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
          <PrimaryButton
            disableElevation
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleOpen}
          >
            Attend
          </PrimaryButton>
        </Stack>
        {event?.organiser?.name && (
          <Stack flexDirection={"column"} gap={2} my={2}>
            <Typography variant="h5" fontWeight={700} color={"text.primary"}>
              About organiser
            </Typography>
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
              <Avatar
                src={event?.organiser?.logo}
                alt={event?.organiser?.name}
                sx={{ height: "90px", width: "90px" }}
              />

              <Typography
                variant="h3"
                fontWeight={700}
                gutterBottom
                sx={{ mt: 2, textAlign: "center" }}
              >
                {event?.organiser?.name}
              </Typography>
              <Typography
                sx={{ fontSize: 16, textAlign: "center" }}
                variant="subtitle1"
              >
                {event?.organiser?.summary}
              </Typography>

              {following !== true && (
                <Button
                  onClick={handleFollow}
                  disableElevation
                  variant="contained"
                  color="primary"
                  endIcon={<AddOutlined />}
                  sx={{
                    textTransform: "capitalize",
                    color: "text.primary",
                    mt: 2,
                  }}
                >
                  Follow
                </Button>
              )}

              <Box mt={1}>
                <Typography
                  variant="subtitle1"
                  style={{ textAlign: "center" }}
                  component={"span"}
                >
                  {event?.organiser?.followers_count} follower(s)
                </Typography>
              </Box>
              <Stack my={2} flexDirection={"row"} gap={1}>
                <IconButton
                  LinkComponent={Link}
                  href="https://instagram.com/spiritzone_?igshid=OGQ5ZDc2ODk2ZA=="
                  target="_blank"
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  LinkComponent={Link}
                  href="https://t.me/+TaU5tedtojdkMzU8"
                  target="_blank"
                >
                  <Telegram />
                </IconButton>
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
