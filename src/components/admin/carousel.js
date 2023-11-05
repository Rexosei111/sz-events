import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import sliderStyles from "../styles/slider.module.css";

// import required modules
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper";
// import Image from "next/image";

export default function ImageDisplay({ images = [] }) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={10}
      centeredSlides={true}
      freeMode={true}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
      }}
      modules={[Autoplay, FreeMode, Pagination, Navigation]}
      // className={sliderStyles.swiper}
    >
      {/* {images.map((image, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <Image
                src={image}
                height={300}
                width={500}
                alt=""
                objectFit="cover"
                layout={"responsive"}
                style={{ opacity: !isActive ? 0.3 : 1 }}
              />
            )}
          </SwiperSlide>
        ))} */}
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
    </Swiper>
  );
}
