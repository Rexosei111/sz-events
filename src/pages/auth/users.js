import LoginForm from "@/components/shared/loginForm";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import loginSVG from "../../../public/file.png";
import Head from "next/head";
import { Animation, Navbar } from "rsuite";

export default function UserLoginPage() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginShow = () => {
    setShowLogin(!showLogin);
  };
  return (
    <>
      <Head>
        <title>User Login</title>
      </Head>
      <Stack flexDirection={"row"} width={"100vw"} minHeight={"100vh"}>
        <Box width={{ xs: "100%", md: "50%" }} minHeight={"100%"} p={2}>
          <Navbar style={{ backgroundColor: "transparent" }}>
            <Navbar.Brand href="/events">Home</Navbar.Brand>
          </Navbar>
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            minHeight={"90vh"}
          >
            <Animation.Slide in={showLogin} placement="right">
              {(props, ref) => (
                <LoginForm
                  {...props}
                  ref={ref}
                  handleLoginShow={handleLoginShow}
                />
              )}
            </Animation.Slide>
            {/* <LoginForm /> */}
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
