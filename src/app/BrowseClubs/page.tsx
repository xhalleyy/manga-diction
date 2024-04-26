"use client";

import React, { useEffect, useRef, useState } from "react";
import { NavbarComponent } from "../components/NavbarComponent";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CustomFlowbiteTheme, TextInput } from "flowbite-react";
import ClubModalComponent from "../components/ClubModalComponent";
import { CarouselComponent } from "../components/CarouselComponent";
import CardComponent from "../components/CardComponent";
import { getClubsByName, publicClubsApi, specifiedClub } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import { useClubContext } from "@/context/ClubContext";
import { Tabs } from "flowbite-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from 'react';

const BrowseClubs = () => {
  const clubData = useClubContext();
  const [clubs, setClubs] = useState<IClubs[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();
  // useRef: used for accessing and persiting mutable values; doesn't cause a re-render when value is changed
  const inputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    const fetchedData = async () => {
      const getClubs = await publicClubsApi();
      setClubs(getClubs);
    };
    fetchedData();
  }, []);

  // const handleClubSearch = async () => {
  //   try {
  //     const searchQuery = inputRef.current?.value || '';
  //     const fetchedClubsByName = await getClubsByName(searchQuery);
  //     console.log('Fetched Clubs:', fetchedClubsByName);

  //     // const queryString = `?clubs=${encodeURIComponent(JSON.stringify(fetchedClubsByName))}`;
  //     // const route = `/SearchClub${queryString}`;
  //     await router.push('/SearchClub');
  //   } catch (error) {
  //     console.error('Error fetching clubs:', error);
  //   }
  // };

  // const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
  //   try {
  //     event.preventDefault();
  //     await handleClubSearch();
  //   } catch (error) {
  //     console.error('Error handling click event:', error);
  //   }
  // };

  const handleClick = () => {
    if (inputRef.current) {
      // Access the value of the input element using inputRef.current.value
      const inputValue = inputRef.current.value;
      // Set the searchClub state with the input value
      clubData.setSearchClub(inputValue);
      router.push('/SearchClub');
    } else {
      console.log('Input element not found.');
    }
  }

  const handleClubCardClick = async (club: IClubs) => {
    try {
      const clubDisplayedInfo = await specifiedClub(club.id);
      clubData.setDisplayedClub(clubDisplayedInfo);
    } catch (error) {
      alert("Error fetching club information");
      console.error(error);
    }
  };


  const shuffledClubs = clubs.sort(() => Math.random() - 0.5);
  const randomClubs = shuffledClubs.slice(0, 12);
  const recentClubs = clubs.slice().sort((a: IClubs, b: IClubs) => {
    const dateA = new Date(a.dateCreated);
    const dateB = new Date(b.dateCreated);
    const comparisonResult = dateB.getTime() - dateA.getTime();
    return comparisonResult;
  });
  const oldestClubs = clubs.slice().sort((a: IClubs, b: IClubs) => {
    const dateA = new Date(a.dateCreated);
    const dateB = new Date(b.dateCreated);
    const comparisonResult = dateA.getTime() - dateB.getTime();
    return comparisonResult;
  });

  const slicedRecentClubs = recentClubs.slice(0, 12);
  const slicedOldestClubs = oldestClubs.slice(0, 12);
  // console.log('Recent Clubs:', slicedRecentClubs);

  // CUSTOM FLOWBITE CLASSES
  const customTabs: CustomFlowbiteTheme['tabs'] = {
    "base": "flex flex-col gap-3 mt-[-2px]",
    "tablist": {
      "base": "flex text-center",
      "styles": {
        "default": "flex-wrap border-b border-gray-200 dark:border-gray-700",
        "pills": "flex-wrap space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400",
        "fullWidth": "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",

      },
      "tabitem": {
        "base": "flex rounded-t-lg py-1.5 px-3 text-sm font-mainFont first:ml-0 focus:outline-none focus:ring-4 focus:ring-paleblue disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        "styles": {
          "pills": {
            "base": "",
            "active": {
              "on": " rounded-lg bg-darkblue text-white",
              "off": "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            }
          },
          "fullWidth": {
            "base": "ml-0 flex w-full rounded-none first:ml-0",
            "active": {
              "on": "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
              "off": "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            }
          }
        },
        "icon": "mr-2 h-5 w-5"
      }
    },
    "tabitemcontainer": {
      "base": "",
      "styles": {
        "default": "",
        "underline": "",
        "pills": "w-full",
        "fullWidth": ""
      }
    },
    "tabpanel": "py-3"
  }

  return (
    <div className="bg-offwhite font-mainFont" >
      <NavbarComponent />

      {/* header , search, create clubs modal start */}
      <div className="grid lg:grid-cols-2 gap-0 pt-5 px-16 items-center pb-4" >
        <div>
          <p className="text-3xl text-darkbrown font-bold">Popular Public Clubs </p>
        </div>

        <div className="flex justify-end gap-5">
          <div className="relative ml-20">
            <TextInput
              ref={inputRef}
              id="base"
              style={{
                borderRightWidth: "50px",
                borderColor: "rgba(207, 198, 183, 1)",
                height: 30,
              }}
              type="text"
              placeholder="°❀⋆.ೃ࿔*:･ Search a Club! ৻(  •̀ ᗜ •́  ৻)"
              className="border-ivory font-mainFont border-8 rounded-2xl w-96 focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0"
            />
            

            <div className="absolute ml-80 inset-y-0 flex items-center">
              <Button
                style={{ backgroundColor: "transparent" }}
                className="bg-transparent focus:ring-0"
                onClick={handleClick}
              >
                <SearchIcon className="text-4xl text-white" />
              </Button>{" "}
            </div>
          </div>

          <div className="flex justify-end ">
            <ClubModalComponent />
          </div>
        </div>
      </div >

      <div className="px-[130px] mb-2">
        <CarouselComponent />
      </div>

      <div className="flex pt-8 pb-3 min-w-full">
        <h1 className="font-mainFont text-lg text-darkbrown me-5 ps-16 text-nowrap">More Public Clubs:</h1>
        <div className="flex justify-start w-full">
          <Tabs theme={customTabs} aria-label="Pills" style="pills">

            <Tabs.Item active title="Random">
              <div className="grid grid-cols-4 gap-4 pb-8 ms-[-250px] px-[130px] 2xl:mx-[-90px]">
                {randomClubs.map((club, idx) => (
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
            </Tabs.Item>
            <Tabs.Item title="Most Recently Created">
              <div className="grid grid-cols-4 gap-4 pb-8 ms-[-250px] px-[130px] 2xl:mx-[-90px]]">
                {slicedRecentClubs.map((club, idx) => (
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
            </Tabs.Item>
            <Tabs.Item title="Least Recently Created">
              <div className="grid grid-cols-4 gap-4 pb-8 ms-[-250px] px-[130px] 2xl:mx-[-90px]]">
                {slicedOldestClubs.map((club, idx) => (
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
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </div >
  );
};

export default BrowseClubs;
