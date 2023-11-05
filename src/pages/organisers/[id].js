import { Gallery, ImageCarousel } from "@/components/shared/gallery";
import EventDetailLoading from "@/components/users/eventDetailsLoading";
import LayoutTwo from "@/components/users/layoutTwo";
import RSVPModal, { SuccessModal } from "@/components/users/rsvpModal";
import { fetcher } from "@/utils/swr_fetcher";
import { CheckCircle, DateRange, LocationOn } from "@mui/icons-material";
import {
  Box,
  Container,
  Paper,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Avatar, Button, Whisper } from "rsuite";
import useSWR from "swr";

export default function OrganiserDetails() {
  const router = useRouter();
  const {
    data: organiser,
    error,
    isLoading,
    mutate,
  } = useSWR(
    () =>
      router.isReady === true ? "users/organisers/" + router.query.id : null,
    fetcher
  );

  if (isLoading) {
    return <EventDetailLoading />;
  }
  return (
    <>
      <Head>{/* <title>{topbarTitle}</title> */}</Head>

      <Typography
        variant="h4"
        fontSize={24}
        fontWeight={700}
        color={(theme) => theme.palette.primary.main}
        gutterBottom
        mb={1}
      >
        {organiser?.name}
      </Typography>

      <Box
        variant="outlined"
        sx={{
          width: "100%",
          height: 300,
          position: "relative",
          my: 2,
        }}
      >
        <Image
          src={organiser?.logo}
          alt="organiser_image"
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Typography variant="subtitle" fontSize={14} my={2}>
        {organiser?.summary}
      </Typography>
      <Typography variant="h5" fontSize={20} my={2}>
        About Us
      </Typography>
      <Markdown components={{ h1: "h3" }}>{organiser?.description}</Markdown>
    </>
  );
}

OrganiserDetails.getLayout = function (page) {
  return <LayoutTwo>{page}</LayoutTwo>;
};
