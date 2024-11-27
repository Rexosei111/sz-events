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
      router.push("/events/638dd663-90fe-4fa5-8021-50f7d66cd9b1");
    }
  }, [router.isReady]);
  return (
    <>
      <Head>
        <title>GOOD SHEPHERD CONFERENCE: THE CALL</title>
        <meta
          property="og:title"
          content="GOOD SHEPHERD CONFERENCE: THE CALL"
        />
        <meta
          property="og:description"
          content="Good Shepherd Conference (GSC) is a program the Lord is using as an avenue to equip his people to become good shepherds after the pattern of Jesus Christ. It’s an encounter that leaves participants with a hunger to make an impact. GSC is a channel the Lord is using to raise for himself, men after his own heart"
        />
        <meta
          property="og:image"
          content="https://szevent-bucket.s3.eu-north-1.amazonaws.com/d906118e-dd1c-4a84-92ef-cc9f847c1d09.jpeg"
        />
        <meta
          property="og:url"
          content="https://gsc.szfamily.org/events638dd663-90fe-4fa5-8021-50f7d66cd9b1"
        />
        <meta property="og:type" content="website" />
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
