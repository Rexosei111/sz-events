import { SnackbarContext } from "@/pages/_app";
import { Box, Stack } from "@mui/material";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "rsuite";

const handleDragStart = (e) => e.preventDefault();

// const items = [
//   <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
//   <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
//   <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
// ];

export const ImageRender = ({ height = 300, image_url }) => {
  return (
    <Box
      sx={{
        width: { xs: "100%" },
        height: height,
        position: "relative",
        // my: 2,
        // mr: 2,
        // borderStyle: "dotted",
      }}
    >
      <img
        src={image_url}
        alt="event_image"
        // fill
        style={{ objectFit: "cover", height: "100%" }}
      />
    </Box>
  );
};

export const ImageCarousel = ({ images = [] }) => {
  const {
    handleOpen: handleSnackbarOpen,
    setSnackSeverity,
    desktopDrawerOpen,
    drawerWidth,
  } = useContext(SnackbarContext);
  return (
    // <Carousel autoplay className="custom-slider" shape="bar">
    <div
      style={{
        overflowX: "auto",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowX: "auto",
        width: "1024px",
        maxWidth: "100%",
        position: "relative",
        // height: "100%",
      }}
      // alignItems={"center"}
      // width={"100%"}
    >
      {images.map((url, index) => (
        <ImageRender image_url={url} key={index} />
        // <Image
        //   src={url}
        //   alt="event_image"
        //   fill
        //   style={{ objectFit: "cover" }}
        // />
      ))}
    </div>
    // </Carousel>
  );
};
