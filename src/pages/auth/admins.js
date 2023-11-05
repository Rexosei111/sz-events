import LoginForm from "@/components/shared/loginForm";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import loginSVG from "../../../public/file.png";
import Head from "next/head";

export default function AdminLoginPage() {
  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <Stack flexDirection={"row"} width={"100vw"} minHeight={"100vh"}>
        <Box width={{ xs: "100%", md: "50%" }} minHeight={"100%"} p={2}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Admin
          </Typography>

          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            minHeight={"90%"}
          >
            <LoginForm auth_endpoint="/admins/auth/login" type="admin" />
          </Stack>
        </Box>
        <Box
          width={{ xs: 0, md: "50%" }}
          minHeight={{ xs: 0, md: "100%" }}
          position={"relative"}
        >
          <Image
            src={loginSVG}
            priority
            alt="login image"
            fill
            style={{ objectFit: "cover", filter: "brightness(0.8)" }}
          />
        </Box>
      </Stack>
    </>
  );
}
