import { Box } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Carousel } from "rsuite";

const handleDragStart = (e) => e.preventDefault();

// const items = [
//   <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
//   <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
//   <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
// ];

const ImageRender = ({ height = 300, image_url }) => {
  return (
    <Box
      variant="outlined"
      sx={{
        width: { xs: "100%" },
        height: height,
        position: "relative",
        my: 2,
        // mr: 2,
        // borderStyle: "dotted",
      }}
    >
      <Image
        src={image_url}
        alt="event_image"
        fill
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
};

export const ImageCarousel = ({ images = [] }) => {
  return (
    <Carousel autoplay className="custom-slider">
      {images.map((url, index) => (
        <img src={url} height={"100"} />
      ))}
    </Carousel>
  );
};
