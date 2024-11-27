import LoginForm from "@/components/shared/loginForm";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import loginSVG from "../../../public/file.png";
import Head from "next/head";
import { Animation, Navbar } from "rsuite";
import { useRouter } from "next/router";
import theme from "@/theme";

export default function UserLoginPage() {
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  const handleLoginShow = () => {
    setShowLogin(!showLogin);
  };

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
        <title>User Login</title>
      </Head>
      <Stack flexDirection={"row"} bgcolor={"background.default"}>
        <Box width={{ xs: "100%" }} minHeight={"100%"} p={2}>
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
            minHeight={"85vh"}
          >
            <Box maxWidth={420} width={"100%"}>
              <Animation.Slide in={showLogin} placement="right">
                {(props, ref) => (
                  <LoginForm
                    {...props}
                    ref={ref}
                    handleLoginShow={handleLoginShow}
                  />
                )}
              </Animation.Slide>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
