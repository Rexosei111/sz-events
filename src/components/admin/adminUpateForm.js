import { Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InputAdornment from "@mui/material/InputAdornment";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { APIClient } from "@/utils/axios";
import useToken from "@/hooks/token";
// import { TextInputField } from "./inputs";
import { Google, PersonOutline } from "@mui/icons-material";
import { SnackbarContext } from "@/pages/_app";
import { TextInputField } from "../shared/inputs";
import { Button, Divider } from "rsuite";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/utils/swr_fetcher";

const loginSchema = yup
  .object({
    email: yup.string().email().nullable(),
    password: yup.string().nullable(),
    first_name: yup.string().nullable(),
    last_name: yup.string().nullable(),
    phone_number: yup.string().nullable(),
  })
  .required();

export default function AdminUpdateForm({ auth_endpoint = "/admins/me" }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);

  const {
    data: admin,
    error: adminError,
    isLoading: adminLoading,
    mutate,
  } = useSWR("/admins/me", fetcher);

  useEffect(() => {
    if (admin !== undefined) {
      reset(admin);
    }
  }, [admin]);

  const onSubmit = async (form_data) => {
    if (form_data.password === "") {
      delete form_data.password;
    }
    try {
      const { data } = await APIClient.patch(auth_endpoint, form_data);
      mutate(data);
      setSnackSeverity("success");
      handleSnackbarOpen("Admin profile update successful!");
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Registration was unsuccesfful!");
      }
    }
  };
  return (
    <Paper
      sx={{
        // p: { xs: 1, sm: 2, md: 2 },
        width: { xs: "100%" },
      }}
      elevation={0}
    >
      <form method="POST" action="#" onSubmit={handleSubmit(onSubmit)}>
        <Stack flexDirection={"column"} gap={2}>
          <TextInputField
            {...register("first_name")}
            variant="outlined"
            type={"text"}
            label="First name"
            error={errors.first_name ? true : false}
            helperText={errors.first_name ? errors.first_name?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextInputField
            {...register("last_name")}
            variant="outlined"
            type={"text"}
            label="Last name"
            error={errors.last_name ? true : false}
            helperText={errors.last_name ? errors.last_name?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextInputField
            {...register("phone_number")}
            variant="outlined"
            type={"text"}
            label="Phone number"
            error={errors.phone_number ? true : false}
            helperText={
              errors.phone_number ? errors.phone_number?.message : null
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextInputField
            {...register("email")}
            variant="outlined"
            type={"email"}
            label="Email"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
            focused
            placeholder="example@provider.com"
          />
          <TextInputField
            {...register("password")}
            variant="outlined"
            type={"password"}
            label="Password"
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password?.message : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <LoadingButton
            variant="contained"
            disableElevation
            sx={{ textTransform: "capitalize", ml: "auto" }}
            // appearance={isValid ? "primary" : "default"}
            loading={isSubmitting}
            type="submit"

            // sx={{ textTransform: "capitalize", height: 45, fontSize: 17 }}
          >
            Update
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
}
