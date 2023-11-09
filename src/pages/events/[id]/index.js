import { ImageCarousel } from "@/components/shared/gallery";
import EventDetailLoading from "@/components/users/eventDetailsLoading";
import LayoutTwo from "@/components/users/layoutTwo";
import RSVPModal, { SuccessModal } from "@/components/users/rsvpModal";
import { SnackbarContext } from "@/pages/_app";
import { APIClient } from "@/utils/axios";
import { formatDateInCustomFormat } from "@/utils/dateFormat";
import { fetcher } from "@/utils/swr_fetcher";
import {
  AddOutlined,
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
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { IconButton, Panel } from "rsuite";
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
        <meta property="og:title" content={event?.name} />
        <meta property="og:description" content={event?.summary} />
        <meta property="og:image" content={event?.cover_image} />
        <meta
          property="og:url"
          content={`https://sz-events.vercel.app/events/${event?.id}`}
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
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ px: { xs: 2, md: 0 } }}>
        <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
          <Typography
            variant="caption"
            color={"text.secondary"}
            sx={{ fontSize: 18 }}
          >
            {formatDateInCustomFormat(event?.start_date)}
          </Typography>
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
              {new Date(event?.start_date).toUTCString()}
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
                  <IconButton
                    icon={
                      <LocationOn
                        fontSize="small"
                        htmlColor="rgba(0,0,0,0.8)"
                      />
                    }
                    active
                    disabled
                  />
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
          <Button
            disableElevation
            color="primary"
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleOpen}
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            Attend
          </Button>
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
                variant="subtitle2"
                sx={{ mt: 2, fontSize: 16, textAlign: "center" }}
              >
                organised by
              </Typography>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{ mt: 2, textAlign: "center" }}
              >
                {event?.organiser?.name}
              </Typography>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: "center" }}
                  textAlign={"center"}
                >
                  {event?.organiser?.followers_count}
                </Typography>
                <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                  follower(s)
                </Typography>
              </Box>
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
              <Typography
                sx={{ mt: 2, fontSize: 16, textAlign: "center" }}
                variant="subtitle1"
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

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       event_mini: {},
//     },
//   };
// }
EventDetails.getLayout = function (page) {
  return <LayoutTwo>{page}</LayoutTwo>;
};
