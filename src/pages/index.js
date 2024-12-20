import { PrimaryButton } from "@/components/btn/baseBtn";
import EventDetailLoading from "@/components/users/eventDetailsLoading";
import RSVPModal, { SuccessModal } from "@/components/users/rsvpModal";
import { SnackbarContext } from "@/pages/_app";
import { APIClient } from "@/utils/axios";
import { formatEventDate } from "@/utils/dateFormat";
import { fetcher } from "@/utils/swr_fetcher";
import {
  AddOutlined,
  CalendarMonthOutlined,
  CheckCircle,
  DateRange,
  Instagram,
  KeyboardDoubleArrowDown,
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
import { isAxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";
import useSWR from "swr";
import { NextSeo } from "next-seo";
import DetailsLayout from "@/components/users/detailsLayout";
import { atcb_action } from "add-to-calendar-button-react";

export default function EventDetails({ eventSummary }) {
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
  } = useSWR("users/events/" + eventSummary.id, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
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
      revalidateIfStale: true,
      revalidateOnFocus: true,
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

  // if (isLoading) {
  //   return <EventDetailLoading />;
  // }
  return (
    <>
      <NextSeo
        title={eventSummary?.name}
        description={eventSummary.summary}
        openGraph={{
          url: `https://gsc.szfamily.org/events/${eventSummary?.id}`,
          type: "",
          images: [
            {
              url: eventSummary.cover_image,

              alt: "Event cover image",
            },
          ],
          siteName: "sz-events",
        }}
      />
      {/* <Head>
        <title>{eventSummary.name}</title>
        <meta property="og:title" content={eventSummary?.name} />
        <meta property="og:description" content={eventSummary?.summary} />
        <meta
          property="og:image"
          content="https://sz-event-bucket.s3.eu-west-3.amazonaws.com/cover+image.png"
        />
        <meta
          property="og:url"
          content={`https://sz-events.vercel.app/events/${eventSummary?.id}`}
        />
        <meta property="og:type" content="website" />
      </Head> */}
      <Box
        variant="outlined"
        sx={{
          width: "100%",
          height: { xs: 550, md: 555 }, // Full viewport height on smaller screens
          position: "relative",
          // bgcolor: "primary.main",
          mb: 2,
          overflow: "hidden", // Ensures the pseudo-element doesn't extend beyond the Box
        }}
      >
        {/* Background Image */}
        <Image
          src={eventSummary?.cover_image}
          alt="event_image"
          fill
          style={{ objectFit: "cover" }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.0) 0%,  /* Dark at the top */
        rgba(0, 0, 0, 0) 30%,    /* Transparent in the middle */
        rgba(0, 0, 0, 0) 70%,    /* Transparent in the middle */
        rgba(0, 0, 0, 0.7) 100%  /* Dark at the bottom */
      )`,
            pointerEvents: "none",
          }}
        />

        {/* Scroll Indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: "30px", // Position slightly above the bottom
            right: "20px", // Position slightly from the right edge
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "bounce 2s infinite", // Add bounce animation
            color: "white", // Icon color
            fontSize: "24px", // Icon size
            "@keyframes bounce": {
              "0%, 100%": {
                transform: "translateY(0)", // Default position
              },
              "50%": {
                transform: "translateY(-10px)", // Move up slightly
              },
            },
          }}
        >
          <KeyboardDoubleArrowDown sx={{ width: 40, height: 40 }} />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 0 } }}>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          mb={2}
          gap={1}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
        >
          {/* <Typography
            variant="caption"
            component={"div"}
            color={"text.secondary"}
            sx={{ fontSize: 18 }}
          >
            {formatDateInCustomFormat(event?.createdAt?.toString())}
          </Typography> */}

          <PrimaryButton
            disableElevation
            sx={{
              height: 70,
              width: 180,
              fontSize: 23,
              "&:hover": {
                bgcolor: (theme) => theme.palette.primary.dark,
              },
            }}
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleOpen}
          >
            Register
          </PrimaryButton>
        </Stack>

        <Typography
          variant="h1"
          fontSize={40}
          fontWeight={700}
          color={"text.primary"}
        >
          {eventSummary?.name}
        </Typography>
        <Typography
          variant="subtitle2"
          lineHeight={1.7}
          fontSize={15}
          color={"text.secondary"}
          sx={{ my: 2 }}
        >
          {eventSummary?.summary}
        </Typography>
        {isLoading && <EventDetailLoading />}

        {!isLoading && typeof event !== undefined && (
          <>
            <Box my={2}>
              <Typography
                variant="h5"
                color={"text.primary"}
                fontWeight={700}
                sx={{ my: 2 }}
              >
                Date and Time
              </Typography>
              <Stack
                flexDirection={"row"}
                gap={1}
                alignItems={"center"}
                color={"text.secondary"}
              >
                <DateRange fontSize="small" htmlColor="black" />
                <Typography variant="subtitle1" sx={{ fontSize: "15px" }}>
                  {formatEventDate(event?.start_date)} GMT
                </Typography>
              </Stack>
            </Box>

            <Box my={2} color={"text.secondary"}>
              <Typography
                variant="h5"
                sx={{ mt: 2 }}
                color={"text.primary"}
                fontWeight={700}
              >
                Location
              </Typography>
              <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
                <List dense>
                  <ListItem disableGutters disablePadding>
                    <ListItemIcon>
                      <IconButton disabled sx={{ p: 0 }}>
                        <LocationOnOutlined
                          fontSize="medium"
                          htmlColor="black"
                        />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText sx={{ ml: -3 }}>
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
                <Markdown
                  components={{ h1: "h3", h2: "h4", h3: "h5", h4: "h5" }}
                >
                  {event?.description}
                </Markdown>
              </Box>
            </Box>

            {/* <Stack
              my={10}
              width={"100%"}
              maxHeight={300}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              position={"relative"}
            >
              <ImageCarousel images={eventImages.slice(0, -1)} />
            </Stack> */}
            <Box
              sx={{
                my: { xs: 5, md: 10 },
                width: "100%",
                position: "relative",
                height: 300,
              }}
            >
              <Image
                src={eventImages[0]}
                alt="Event image"
                layout="fill" // Make the image fill its parent
                objectFit="contain" // Adjust the image to cover the container
              />
            </Box>

            <Stack
              width={"100%"}
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent={{ xs: "center", md: "flex-start" }}
              alignItems={{ xs: "center", md: "center" }}
              // flexDirection={"row"}
              // justifyContent={"flex-start"}
              // alignItems={"center"}
              gap={3}
              mt={5}
            >
              <PrimaryButton
                disableElevation
                variant="contained"
                sx={{
                  height: 70,
                  width: 180,
                  fontSize: 23,
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.primary.dark,
                  },
                }}
                startIcon={<CheckCircle />}
                onClick={handleOpen}
              >
                Register
              </PrimaryButton>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  color: "primary.main",
                  borderColor: "primary.main",
                  height: 70,
                  fontSize: 17,
                  bgcolor: "white",
                }}
                startIcon={<CalendarMonthOutlined />}
                onClick={() =>
                  atcb_action({
                    proKey: process.env.NEXT_PUBLIC_ADD_TO_CALENDER_KEY,
                  })
                }
              >
                Add to Calender
              </Button>
              {/* <PrimaryButton
                variant="outlined"
                startIcon={<CalendarMonthOutlined />}
                onClick={() =>
                  atcb_action({
                    proKey: process.env.NEXT_PUBLIC_ADD_TO_CALENDER_KEY,
                  })
                }
                sx={{
                  height: 70,
                  fontSize: 17,
                  bgcolor: "white",
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.primary.dark,
                  },
                }}
              >
                Add to Calender
              </PrimaryButton> */}
            </Stack>
            {event?.organiser?.name && (
              <Stack flexDirection={"column"} gap={2} my={8}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={"text.primary"}
                >
                  The organiser
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
                    sx={{ fontSize: 16, textAlign: "center", mt: -2 }}
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
                        color: "white",
                        fontSize: 20,
                        mt: 2,
                        height: 60,
                        width: 200,
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
                  {/* <Stack my={2} flexDirection={"row"} gap={1}>
                    <IconButton
                      sx={{ width: 45, height: 45 }}
                      LinkComponent={Link}
                      href="https://instagram.com/spiritzone_?igshid=OGQ5ZDc2ODk2ZA=="
                      target="_blank"
                    >
                      <Instagram sx={{ width: 20, height: 20 }} />
                    </IconButton>
                    <IconButton
                      sx={{ width: 45, height: 45 }}
                      LinkComponent={Link}
                      href="https://t.me/+TaU5tedtojdkMzU8"
                      target="_blank"
                    >
                      <Telegram sx={{ width: 20, height: 20 }} />
                    </IconButton>
                    <IconButton
                      LinkComponent={Link}
                      href="https://www.tiktok.com/@spiritzone1?_t=8hLuzSBp18w&_r=1"
                      target="_blank"
                    >
                      <Image src={TicTokIcon} width={30} height={30} />
                    </IconButton>
                  </Stack> */}
                </Paper>
              </Stack>
            )}
          </>
        )}
      </Box>

      <RSVPModal
        open={rsvpOpen}
        handleClose={handleOpen}
        handleSuccessOpen={handleSuccessOpen}
        event_id={event?.id}
        eventName={event?.name}
      />
      <SuccessModal
        open={successOpen}
        handleClose={handleSuccessOpen}
        event_name={event?.name}
      />
    </>
  );
}

// export const getStaticPaths = async () => {
//   const { data } = await APIClient.get(`users/events/mini`);
//   const paths = data?.items.map((event) => {
//     return {
//       params: event,
//     };
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };

export const getStaticProps = async ({ params }) => {
  const { data } = await APIClient.get(
    `users/events/638dd663-90fe-4fa5-8021-50f7d66cd9b1/mini`
  );
  return { props: { eventSummary: data } };
};

EventDetails.getLayout = function (page) {
  return <DetailsLayout>{page}</DetailsLayout>;
};
