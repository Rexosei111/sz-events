import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import {
  Box,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import RichTextEditor from "./textEditor";
import { TextInputField } from "../shared/inputs";
import { SnackbarContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { APIClient } from "@/utils/axios";
import { isAxiosError } from "axios";
import { fetcher } from "@/utils/swr_fetcher";
import useSWR from "swr";
import { LoadingButton } from "@mui/lab";

export function OrganiserUpdateForm({ register, setValue, errors, organiser }) {
  const [description, setDescription] = useState(null);

  useEffect(() => {
    setValue("description", description);
  }, [description]);

  useEffect(() => {
    if (organiser !== null) {
      setDescription(organiser?.description);
    }
  }, [organiser]);
  return (
    <Stack flexDirection={"column"} gap={3}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box width={{ xs: "100%", md: "60%" }}>
          <InputLabel shrink htmlFor="name">
            Organiser's name
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
            placeholder="Name"
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
    </Stack>
  );
}
