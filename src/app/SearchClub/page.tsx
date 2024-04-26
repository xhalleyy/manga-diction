'use client'

import React, { useEffect, useState } from "react";
import { NavbarComponent } from "../components/NavbarComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClubsByName, specifiedClub } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import { useClubContext } from "@/context/ClubContext";
import CardComponent from "../components/CardComponent";

const SearchClub = () => {
  const router = useRouter();
  const [fetchedClubs, setFetchedClubs] = useState<any>(null);

  const clubData = useClubContext();
  const [clubs, setClubs] = useState<IClubs[]>([]);

  // useEffect(() => {
  //   const fetchClubs = async () => {
  //     const clubsParam = router.query.clubs;
  //     if (clubsParam && typeof clubsParam === "string") {
  //       const parsedClubs = JSON.parse(clubsParam);
  //       setFetchedClubs(parsedClubs);
  //     }
  //   };

  //   fetchClubs();
  // }, [router.query.clubs]);

  const handleClubCardClick = async (club: IClubs) => {
    try {
      const clubDisplayedInfo = await specifiedClub(club.id);
      clubData.setDisplayedClub(clubDisplayedInfo);
    } catch (error) {
      alert("Error fetching club information");
      console.error(error);
    }
  };

  return (
    <div className="bg-offwhite h-screen">
      <div className="bg-offwhite h-full">
        <NavbarComponent />

        <div className='mt-5'>
                {/* <h1 className='px-16 text-[26px] font-poppinsMed text-darkbrown'>Club Results for &apos;{router.query.search}&apos;</h1> */}

                <div className="grid grid-cols-5 px-[30px] mt-8">
                    {/* search results, 5 per 'row' */}
                    {/* if no matches found, display 'hidden' h1 with a message similar to "Can't find what you're looking for? Double check your spelling" */}

                    {fetchedClubs &&
              fetchedClubs.map((club: any, idx: number) => (
                  <div
                    key={idx}
                    className="col-span-1"
                    onClick={() => handleClubCardClick(club)}
                  >
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

                </div>

            </div>
      </div>
    </div>
  );
};

export default SearchClub;
