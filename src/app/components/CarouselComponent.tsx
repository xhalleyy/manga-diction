'use client'

import { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { publicClubsApi } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import CardComponent from "./CardComponent";

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

  const carouselContainerStyles = {
    width: '100%', // Make the carousel container 100% width
    // Add more custom styles as needed
  };

  return (
    <div className="min-w-screen">
      <Carousel 
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className="w-full"
        containerClass="container-with-dots "
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={true}
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
          <div key={idx} className='col-span-1'>
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
          // <div key={club.id}>
          //   <img
          //     src={club.image}
          //     alt={club.clubName}
          //     style={{ maxWidth: '100%', height: 'auto' }}
          //   />
          //   <h3>{club.clubName}</h3>
          //   <p>{club.description}</p>
          // </div>
        ))}
      </Carousel>
    </div>
  );
}
