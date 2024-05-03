"use client";

import React, { useEffect, useRef, useState } from "react";
import { NavbarComponent } from "../components/NavbarComponent";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CustomFlowbiteTheme, TextInput, Tooltip } from "flowbite-react";
import ClubModalComponent from "../components/ClubModalComponent";
import { CarouselComponent } from "../components/CarouselComponent";
import CardComponent from "../components/CardComponent";
import { getClubsByName, publicClubsApi, specifiedClub } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import { useClubContext } from "@/context/ClubContext";
import { Tabs } from "flowbite-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from 'react';
import CardComponent2 from "../components/CardComponent2";

const BrowseClubs = () => {
  const clubData = useClubContext();
  const [clubs, setClubs] = useState<IClubs[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [pageSize, setPageSize] = useState<boolean>(false);

  const router = useRouter();
  // useRef: used for accessing and persiting mutable values; doesn't cause a re-render when value is changed
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console
    const fetchedData = async () => {
      const getClubs = await publicClubsApi();
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
  }, [pageSize]);

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
    "base": "flex flex-col gap-3 mt-[-2px] w-full",
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
    <>
      <div className="bg-offwhite  min-h-screen font-mainFont" >

        <NavbarComponent />

        {/* header , search, create clubs modal start */}
        <div className={pageSize ? "grid grid-cols-2 gap-0 pt-5 px-16 items-center pb-4" : "grid grid-cols-1"}>

          {/* search bar hidden on lg, visible on mobile */}
          <div className={pageSize ? "hidden" : "inline-flex pt-6"}>
            <div className={pageSize ? "hidden" : " px-3"}>
              <TextInput
                ref={inputRef}
                id="base"
                style={{
                  borderRightWidth: "50px",
                  borderColor: "rgba(207, 198, 183, 1)",
                  height: 30,
                  width: '317px'
                }}
                type="text"
                placeholder="°❀⋆.ೃ࿔*:･ Search a Club! ৻(  •̀ ᗜ •́  ৻)"
                className="border-ivory font-mainFont border-8 rounded-2xl focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0"
              />


              <div style={{ marginLeft: '270px' }} className="absolute inset-y-28">
                <Button
                  style={{ backgroundColor: "transparent" }}
                  className="bg-transparent focus:ring-0"
                  onClick={handleClick}
                >
                  <SearchIcon className="text-4xl text-white" />
                </Button>{" "}
              </div>
            </div>

            <div className={pageSize ? "hidden" : ""}>
              <ClubModalComponent />
            </div>

          </div>

          <div>
            <p className={pageSize ? "text-3xl text-darkbrown font-bold" : "text-center py-5 text-2xl text-darkbrown font-bold"}>Popular Public Clubs </p>
          </div>

          {/* search bar visible on lg, hidden on mobile */}
          <div className={pageSize ? "flex justify-end gap-5" : ""}>
            <Tooltip content="Case Sensitive" placement="top" style="light">
              <div className={pageSize ? "relative ml-20" : "hidden"}>
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

            </Tooltip>

            <div className={pageSize ? "flex justify-end " : "hidden"}>
              <ClubModalComponent />
            </div>
          </div>
        </div >

        <div className={pageSize ? 'px-[130px] mb-2 ' : 'px-[20px] mb-2'}>
          <CarouselComponent />
        </div>

        <h1 className={pageSize ? "hidden" : "font-mainFont text-darkbrown text-center font-bold pt-2 text-2xl"}> More Public Clubs </h1>

        <div className={pageSize ? "flex pt-8 pb-3 min-w-full" : "flex pb-3 min-w-full"}>
          <h1 className={pageSize ? "font-mainFont text-lg text-darkbrown me-5 ps-16 text-nowrap" : "hidden"}>More Public Clubs:</h1>

          <div className={pageSize ? "flex justify-start w-full" : "hidden"}>
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

        {/* more public clubs mobile */}
        <div className={pageSize ? "hidden" : "grid grid-cols-1 rounded-xl p-5 bg-ivory m-4"}>
          {slicedRecentClubs.map((club, idx) => (
            <div
              key={idx}
              className="col-span-1 py-1 border-0"
              onClick={() => handleClubCardClick(club)}
            >
              <CardComponent2
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
      </div >
    </>
  );
};

export default BrowseClubs;
