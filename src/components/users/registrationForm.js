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

const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    phone_number: yup.string().required(),
  })
  .required();

export default function RegistrationForm({
  type = "user",
  auth_endpoint = "/users/auth/register",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);

  const handleGoogleAuth = async () => {
    try {
      const { data } = await APIClient.get("users/auth/google/authorize");
      console.log(data);
      const newWindow = window.open(
        data.authorization_url,
        "Auth",
        "width=500,height=500"
      );
    } catch (err) {
      console.log("Google auth failed");
    }
  };

  const onSubmit = async (form_data) => {
    try {
      const { data } = await APIClient.post(auth_endpoint, form_data);
      router.push("/auth/users");
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
        p: { xs: 1, sm: 2, md: 2 },
        width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
        bgcolor: "transparent",
      }}
      elevation={0}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={2}
      >
        <h2>Register</h2>
        <Link
          as={"a"}
          href="/auth/users"
          style={{ textAlign: "center", cursor: "pointer" }}
        >
          Login to your account
        </Link>
      </Stack>
      <p style={{ marginBottom: "30px" }}>Create new account</p>
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
              style: {
                fontSize: 13,
              },
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
              style: {
                fontSize: 13,
              },
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
              style: {
                fontSize: 13,
              },
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
              style: {
                fontSize: 13,
              },
            }}
            fullWidth
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
              style: {
                fontSize: 13,
              },
            }}
            fullWidth
          />
          <LoadingButton
            // appearance={isValid ? "primary" : "default"}
            variant="contained"
            color="primary"
            disabled={!isValid}
            disableElevation
            loading={isSubmitting}
            type="submit"
            sx={{ textTransform: "capitalize" }}
          >
            Submit
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
}
