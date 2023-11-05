import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import UserLayout from "@/components/users/layout";
import hero_image from "../../public/hero_section.svg";
import Image from "next/image";
import LayoutTwo from "@/components/users/layoutTwo";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady === true) {
      router.push("/events");
    }
  }, [router.isReady]);
  return (
    <>
      <Head>
        <title>SZ events</title>
      </Head>
      <Stack height={300} alignItems={"center"} justifyContent={"center"}>
        <Typography variant="h6">Redirecting...</Typography>
      </Stack>
    </>
  );
}

Home.getLayout = function (page) {
  return <LayoutTwo>{page}</LayoutTwo>;
};
