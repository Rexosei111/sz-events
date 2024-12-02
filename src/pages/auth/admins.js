import LoginForm from "@/components/shared/loginForm";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import loginSVG from "../../../public/gsc.jpg";
import Head from "next/head";
import { Navbar } from "rsuite";
import theme from "@/theme";
import { useRouter } from "next/router";

export default function AdminLoginPage() {
  const router = useRouter();

  const handleNavigation = (event, url = null) => {
    event.preventDefault();
    if (url !== null) {
      router.push(url);
    } else {
      router.push(event.target?.href ?? "/events");
    }
  };
  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <Stack
        flexDirection={"row"}
        width={"100vw"}
        minHeight={"100vh"}
        bgcolor={"background.default"}
      >
        <Box width={{ xs: "100%", md: "50%" }} minHeight={"100%"} p={2}>
          <Navbar style={{ backgroundColor: "transparent" }}>
            <Navbar.Brand
              href="/events"
              onClick={handleNavigation}
              style={{ color: theme.palette.text.primary, fontWeight: 700 }}
            >
              <Image src={"/logo.png"} width={30} height={30} alt="Logo" />
            </Navbar.Brand>
          </Navbar>

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
