import { Box } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
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

const responsive = {
  0: { items: 1 },
  500: { items: 2 },
  900: { items: 3 },
  1024: { items: 4 },
};
export const Gallery = ({ images = [] }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const data = images.map((image, index) => (
      <ImageRender image_url={image} />
    ));
    setItems(data);
  }, [images]);

  const onRenderDotsItem = (e) => {
    console.log(e);
  };
  return (
    <AliceCarousel
      mouseTracking
      items={items}
      responsive={responsive}
      controlsStrategy="responsive"
      //   renderDotsItem={onRenderDotsItem}
      renderSlideInfo={onRenderDotsItem}
    />
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
