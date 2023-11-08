import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { clipText } from "@/utils/clip";
import { ArrowForward } from "@mui/icons-material";

export default function EventListingCard({ event }) {
  const router = useRouter();
  const handleViewDetails = () => {
    router.push(`/admin/events/${event.id}`);
  };
  return (
    <Card elevation={0}>
      <CardActionArea onClick={handleViewDetails}>
        <CardMedia
          component="img"
          sx={{ height: 170 }}
          alt={event?.name}
          image={event?.cover_image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event?.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function UserEventListingCard({ event }) {
  const router = useRouter();
  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };
  return (
    <Card elevation={0} sx={{ bgcolor: "transparent" }}>
      <CardActionArea onClick={handleViewDetails}>
        <CardMedia
          component="img"
          sx={{ height: 170 }}
          alt={event?.name}
          image={event?.cover_image}
        />
        <CardContent>
          <h4>{event?.name}</h4>
          <Typography variant="subtitle2" color="text.secondary">
            {clipText(event?.summary, 30)}
          </Typography>
        </CardContent>
        <CardActions>
          {event?.organiser?.name !== null && (
            <Stack flexDirection={"column"} gap={0}>
              <Avatar
                src={event?.organiser?.logo}
                alt={event?.organiser?.name}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="subtitle2" component={"span"}>
                {event?.organiser?.name}
              </Typography>
            </Stack>
          )}
          <ArrowForward sx={{ ml: "auto" }} fontSize="small" />
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

export function FollowingOrganiserCard({ organiser }) {
  const router = useRouter();
  const handleViewDetails = () => {
    // router.push(`/organisers/${organiser.id}`);
    console.log(organiser.id);
  };
  return (
    <Card elevation={0} sx={{ bgcolor: "transparent" }}>
      <CardActionArea onClick={handleViewDetails}>
        <CardMedia
          component="img"
          sx={{ height: 170 }}
          alt={organiser?.organiser?.name}
          image={organiser?.organiser?.logo}
        />
        <CardContent>
          <h4>{organiser?.organiser.name}</h4>
          <Typography variant="subtitle2" color="text.secondary">
            {clipText(organiser?.organiser.summary, 30)}
          </Typography>
        </CardContent>
        <CardActions>
          {/* {organiser?.organiser.name !== null && (
            <Stack flexDirection={"column"} gap={0}>
              <Avatar
                src={organiser?.organiser.logo}
                alt={organiser?.organiser.name}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="subtitle2" component={"span"}>
                {organiser?.organiser.name}
              </Typography>
            </Stack>
          )} */}
          <ArrowForward sx={{ ml: "auto" }} fontSize="small" />
        </CardActions>
      </CardActionArea>
    </Card>
  );
}
