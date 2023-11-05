import React, { useEffect, useState } from "react";
import * as yup from "yup";
import {
  Box,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import { StaticDatePicker, StaticTimePicker } from "@mui/x-date-pickers";
import TitleIcon from "@mui/icons-material/Title";
import { createContext } from "react";
import RichTextEditor from "./textEditor";
import { TextInputField } from "../shared/inputs";
import { get_datetime_string } from "@/utils/dateFormat";
import dayjs from "dayjs";

export default function EventBasicForm({
  register,
  setValue,
  getValues,
  errors,
}) {
  const [dateTime, setDateTime] = useState({
    startDate: null,
    startTime: null,
  });
  const [description, setDescription] = useState(null);

  useEffect(() => {
    setValue("description", description);
  }, [description]);

  const handleDateChange = (dateObj) => {
    if (dateObj === null) {
      setDateTime((prevState) => ({
        ...prevState,
        startDate: null,
      }));
      return null;
    }
    setDateTime((prevState) => ({
      ...prevState,
      startDate: dateObj?.$d,
    }));
    setValue(
      "start_date",
      get_datetime_string(dateTime.startDate, dateTime.startTime)
    );
  };

  const handleTimeChange = (timeObj) => {
    if (timeObj === null) {
      setDateTime((prevState) => ({
        ...prevState,
        startTime: null,
      }));
      return null;
    }
    setDateTime((prevState) => ({
      ...prevState,
      startTime: timeObj?.$d,
    }));
    setValue(
      "start_date",
      get_datetime_string(dateTime.startDate, dateTime.startTime)
    );
  };

  return (
    <Stack flexDirection={"column"} gap={3}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "60%" }}>
          <InputLabel shrink htmlFor="name">
            Name of Event
          </InputLabel>
          <TextInputField
            fullWidth
            id="name"
            {...register("name")}
            variant="outlined"
            type={"text"}
            error={errors.name ? true : false}
            helperText={errors.name ? errors.name?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder="Title"
          />
        </Box>
        <Typography variant="subtitle2" color={"GrayText"}>
          This title will be displayed on the event page
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "60%" }}>
          <InputLabel shrink htmlFor="summary">
            Summary
          </InputLabel>
          <TextInputField
            fullWidth
            id="summary"
            {...register("summary")}
            multiline
            rows={3}
            variant="outlined"
            type={"text"}
            error={errors.summary ? true : false}
            helperText={errors.summary ? errors.summary?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon fontSize="small" />
                </InputAdornment>
              ),
              style: {
                fontSize: 13,
              },
            }}
            placeholder="Short description of event."
          />
        </Box>
        <Typography variant="subtitle2" color={"GrayText"}>
          This information will be displayed on the event listing page
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%" }}>
          <InputLabel shrink htmlFor="description">
            Description
          </InputLabel>
          <RichTextEditor value={description} setValue={setDescription} />
        </Box>
        <Typography variant="subtitle2" color={"GrayText"} my={1}>
          Description about the event. This information will be displayed on the
          event details page
        </Typography>
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "50%" }}>
          <InputLabel shrink htmlFor="date">
            Start Date
          </InputLabel>
          <StaticDatePicker
            onChange={handleDateChange}
            id="date"
            sx={{ bgcolor: "#f5f5f599", borderRadius: "20px 0 0 20px" }}
            disablePast
          />
        </Box>
        <Box width={{ xs: "100%", md: "50%" }}>
          <InputLabel shrink htmlFor="time">
            Start time
          </InputLabel>
          <StaticTimePicker
            onChange={handleTimeChange}
            id="time"
            sx={{ bgcolor: "#f5f5f599", borderRadius: "0 20px 20px 0" }}
          />
        </Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        spacing={2}
        flexWrap={{ xs: "wrap", md: "wrap" }}
      >
        <Typography variant="subtitle2" color={"GrayText"}>
          This will be displayed as the cover photo on the event listing and
          detail page.
        </Typography>
      </Stack>
    </Stack>
  );
}

export function EventEditBasicForm({
  register,
  setValue,
  getValues,
  errors,
  event,
}) {
  const [dateTime, setDateTime] = useState({
    startDate: null,
    startTime: null,
  });
  const [description, setDescription] = useState(null);

  useEffect(() => {
    setValue("description", description);
  }, [description]);

  const handleDateChange = (dateObj) => {
    if (dateObj === null) {
      setDateTime((prevState) => ({
        ...prevState,
        startDate: null,
      }));
      return null;
    }
    setDateTime((prevState) => ({
      ...prevState,
      startDate: dateObj?.$d,
    }));
    setValue(
      "start_date",
      get_datetime_string(
        dateTime.startDate?.$d ? dateTime.startDate?.$d : dateTime.startDate,
        dateTime.startTime?.$d ? dateTime.startTime?.$d : dateTime.startTime
      )
    );
  };

  const handleTimeChange = (timeObj) => {
    if (timeObj === null) {
      setDateTime((prevState) => ({
        ...prevState,
        startTime: null,
      }));
      return null;
    }
    setDateTime((prevState) => ({
      ...prevState,
      startTime: timeObj?.$d,
    }));
    setValue(
      "start_date",
      get_datetime_string(
        dateTime.startDate?.$d ? dateTime.startDate?.$d : dateTime.startDate,
        dateTime.startTime?.$d ? dateTime.startTime?.$d : dateTime.startTime
      )
    );
  };

  useEffect(() => {
    if (event !== undefined) {
      setDescription(event?.description);
      setDateTime({
        startDate: new dayjs(event?.start_date),
        startTime: new dayjs(event?.start_date),
      });
    }
  }, [event]);

  return (
    <Stack flexDirection={"column"} gap={3}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "60%" }}>
          <InputLabel shrink htmlFor="name">
            Name of Event
          </InputLabel>
          <TextInputField
            fullWidth
            id="name"
            {...register("name")}
            variant="outlined"
            type={"text"}
            error={errors.name ? true : false}
            helperText={errors.name ? errors.name?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder="Title"
          />
        </Box>
        <Typography variant="subtitle2" color={"GrayText"}>
          This title will be displayed on the event page
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "60%" }}>
          <InputLabel shrink htmlFor="summary">
            Summary
          </InputLabel>
          <TextInputField
            fullWidth
            id="summary"
            {...register("summary")}
            multiline
            rows={3}
            variant="outlined"
            type={"text"}
            error={errors.summary ? true : false}
            helperText={errors.summary ? errors.summary?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon fontSize="small" />
                </InputAdornment>
              ),
              style: {
                fontSize: 13,
              },
            }}
            placeholder="Short description of event."
          />
        </Box>
        <Typography variant="subtitle2" color={"GrayText"}>
          This information will be displayed on the event listing page
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%" }}>
          <InputLabel shrink htmlFor="description">
            Description
          </InputLabel>
          <RichTextEditor value={description} setValue={setDescription} />
        </Box>
        <Typography variant="subtitle2" color={"GrayText"} my={1}>
          Description about the event. This information will be displayed on the
          event details page
        </Typography>
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "50%" }}>
          <InputLabel shrink htmlFor="date">
            Start Date
          </InputLabel>
          <StaticDatePicker
            onChange={handleDateChange}
            value={dateTime?.startDate}
            id="date"
            sx={{ bgcolor: "#f5f5f599", borderRadius: "20px 0 0 20px" }}
            disablePast
          />
        </Box>
        <Box width={{ xs: "100%", md: "50%" }}>
          <InputLabel shrink htmlFor="time">
            Start time
          </InputLabel>
          <StaticTimePicker
            onChange={handleTimeChange}
            value={dateTime?.startTime}
            id="time"
            sx={{ bgcolor: "#f5f5f599", borderRadius: "0 20px 20px 0" }}
          />
        </Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        spacing={2}
        flexWrap={{ xs: "wrap", md: "wrap" }}
      >
        <Typography variant="subtitle2" color={"GrayText"}>
          This will be displayed as the cover photo on the event listing and
          detail page.
        </Typography>
      </Stack>
    </Stack>
  );
}
