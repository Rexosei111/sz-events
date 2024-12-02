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
import { TextInputField } from "./inputs";
import { Google } from "@mui/icons-material";
import { SnackbarContext } from "@/pages/_app";
import Link from "next/link";

const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export default function LoginForm({
  type = "user",
  auth_endpoint = "/users/auth/login",
  handleLoginShow,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();
  const [token, setToken] = useToken("szevent_token", null);
  useEffect(() => {
    if (router.isReady === true) {
      if (router.pathname.startsWith("/auth")) {
        window.localStorage.removeItem("szevent_token");
      }
    }
  }, [router.isReady]);
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
    const formData = new URLSearchParams();
    formData.append("username", form_data.email);
    formData.append("password", form_data.password);
    try {
      const { data } = await APIClient.post(auth_endpoint, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setToken(data);
      if (type === "user") {
        router.push("/");
      } else {
        router.push("/admin/events");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to login! Check your credentials!");
      }
    }
  };
  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2, md: 2 },
        // width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
        width: { xs: "100%" },
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
        <h2>Log in</h2>
        {type === "user" && (
          <Link
            as={"a"}
            href="/auth/register"
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            Create account
          </Link>
        )}
      </Stack>
      {type === "user" && (
        <Typography variant="subtitle2" gutterBottom mb={6}>
          Log in to your account
        </Typography>
      )}
      {type !== "user" && (
        <Typography variant="subtitle2" gutterBottom mb={6}>
          Log in as an admin
        </Typography>
      )}
      <form method="POST" action="#" onSubmit={handleSubmit(onSubmit)}>
        <Stack flexDirection={"column"} gap={2}>
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
                fontSize: 16,
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
                fontSize: 16,
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
