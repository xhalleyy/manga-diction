'use client'

import { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { getPopularClubs, getPostsByClubId, getRecentClubPosts, publicClubsApi, specifiedClub } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import CardComponent from "./CardComponent";
import CarouselButtonsComponent from "./CarouselButtonsComponent";
import { useClubContext } from "@/context/ClubContext";


export function CarouselComponent(props: any) {
  const clubData = useClubContext();
  const [clubs, setClubs] = useState<IClubs[]>([]);
  const [pageSize, setPageSize] = useState<boolean>(false);


  useEffect(() => {
    const fetchedData = async () => {
      const getClubs = await getPopularClubs();
      setClubs(getClubs);
    };
    fetchedData();

    // handling window resize 
    // typeof returns a string indicating the type of the operand's value
    if (typeof window !== 'undefined') {
      setPageSize(window.innerWidth > 768);

      const handleResize = () => {
        setPageSize(window.innerWidth > 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleClubCardClick = async (club: IClubs) => {
    try {
      const clubDisplayedInfo = await specifiedClub(club.id);
      const postInfo = await getRecentClubPosts(club.id)
      clubData.setDisplayedClub(clubDisplayedInfo);
      clubData.setDisplayedPosts(postInfo)
    } catch (error) {
      alert("Error fetching club information");
      console.error(error);
    }
  };

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
        autoPlay={pageSize ? false : true}
        autoPlaySpeed={4000}
        centerMode={false}
        className="w-full"
        containerClass="container-with-dots "
        dotListClass=""
        customButtonGroup={pageSize ? <CarouselButtonsComponent previous={() => { }} next={() => { }} /> : null}
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
        {clubs.filter(club => club.isDeleted == false).slice(0, 8).map((club, idx) => (
          <div key={idx} className='col-span-1 mx-2' onClick={() =>handleClubCardClick(club)}>
            <CardComponent
              id={club.id}
              leaderId={club.leaderId}
              description={club.description}
              dateCreated={club.dateCreated}
              image={club.image}
              isMature={club.isMature}
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
