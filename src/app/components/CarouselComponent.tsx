'use client'

import { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { publicClubsApi } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import CardComponent from "./CardComponent";
import CarouselButtonsComponent from "./CarouselButtonsComponent";


export function CarouselComponent(props: any) {
  const [clubs, setClubs] = useState<IClubs[]>([]);

  useEffect(() => {
    const fetchedData = async () => {
      const getClubs = await publicClubsApi();
      setClubs(getClubs);
    };
    fetchedData();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };


  return (
    <div className="min-w-screen relative">
      <Carousel 
        additionalTransfrom={0}
        arrows={false}
        autoPlaySpeed={3000}
        centerMode={false}
        className="w-full"
        containerClass="container-with-dots "
        dotListClass=""
        customButtonGroup={<CarouselButtonsComponent previous={() => {}} next={() => {}}/>}
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {clubs.map((club,idx) => (
          <div key={idx} className='col-span-1 mx-2'>
          <CardComponent
            id={club.id}
            leaderId={club.leaderId}
            description={club.description}
            dateCreated={club.dateCreated}
            image={club.image}
            isPublic={club.isPublic}
            clubName={club.clubName}
            isDeleted={club.isDeleted}
          />
        </div>
        ))}
      </Carousel>
    </div>
  );
}
