import { Paper, Stack, InputAdornment } from "@mui/material";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { APIClient } from "@/utils/axios";
import { SnackbarContext } from "@/pages/_app";
import { TextInputField } from "../shared/inputs";
import { PersonOutline } from "@mui/icons-material";
import Link from "next/link";

const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirm_password: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    phone_number: yup.string().required("Phone number is required"),
  })
  .required();

export default function RegistrationForm({
  type = "user",
  auth_endpoint = "/users/auth/register",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter();
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);

  const onSubmit = async (form_data) => {
    try {
      const { data } = await APIClient.post(auth_endpoint, form_data);
      router.push("/auth/users");
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Registration was unsuccessful!");
      }
    }
  };

  // Watch the password field to validate confirm_password in real-time
  const password = watch("password");

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2, md: 2 },
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
          Log in to your account
        </Link>
      </Stack>
      <p style={{ marginBottom: "30px" }}>Create new account</p>
      <form method="POST" action="#" onSubmit={handleSubmit(onSubmit)}>
        <Stack flexDirection={"column"} gap={2}>
          <TextInputField
            {...register("first_name")}
            variant="outlined"
            type="text"
            label="First name"
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
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
            type="text"
            label="Last name"
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
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
            type="text"
            label="Phone number"
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
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
            type="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
            placeholder="example@provider.com"
          />
          <TextInputField
            {...register("password")}
            variant="outlined"
            type="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextInputField
            {...register("confirm_password")}
            variant="outlined"
            type="password"
            label="Confirm Password"
            error={
              !!errors.confirm_password ||
              (!!touchedFields.confirm_password &&
                watch("confirm_password") !== password)
            }
            helperText={
              !!touchedFields.confirm_password &&
              (errors.confirm_password?.message ||
                (watch("confirm_password") !== password
                  ? "Passwords must match"
                  : ""))
            }
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
