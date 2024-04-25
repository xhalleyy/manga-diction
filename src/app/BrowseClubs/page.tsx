"use client";

import React, { useEffect, useState } from "react";
import { NavbarComponent } from "../components/NavbarComponent";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CustomFlowbiteTheme, TextInput } from "flowbite-react";
import ClubModalComponent from "../components/ClubModalComponent";
import { CarouselComponent } from "../components/CarouselComponent";
import CardComponent from "../components/CardComponent";
import { publicClubsApi, specifiedClub } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import { useClubContext } from "@/context/ClubContext";
import { Tabs } from "flowbite-react";

const BrowseClubs = () => {
  const clubData = useClubContext();
  const [clubs, setClubs] = useState<IClubs[]>([]);

  useEffect(() => {
    const fetchedData = async () => {
      const getClubs = await publicClubsApi();
      setClubs(getClubs);
    };
    fetchedData();
  }, []);

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

  const customTabs: CustomFlowbiteTheme['tabs'] = {
    "base": "flex flex-col gap-3 mt-[-2px]",
    "tablist": {
      "base": "flex text-center",
      "styles": {
        "default": "flex-wrap border-b border-gray-200 dark:border-gray-700",
        "underline": "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
        "pills": "flex-wrap space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400",
        "fullWidth": "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",

      },
      "tabitem": {
        "base": "flex rounded-t-lg py-1.5 px-3 text-sm font-mainFont first:ml-0 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        "styles": {
          "default": {
            "base": "rounded-t-lg",
            "active": {
              "on": "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500",
              "off": "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300"
            }
          },
          "underline": {
            "base": "rounded-t-lg",
            "active": {
              "on": "active rounded-t-lg border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500",
              "off": "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            }
          },
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
    }
  }

  return (
    <div className="bg-offwhite font-mainFont" >
      <NavbarComponent />

      {/* header , search, create clubs modal start */}
      <div className="grid lg:grid-cols-2 gap-0 pt-5 px-16 items-center pb-4" >
        <div>
          <p className="text-3xl text-darkbrown font-bold"> Public Clubs </p>
        </div>

        <div className="flex justify-end gap-5">
          <div className="relative ml-20">
            <TextInput
              id="base"
              style={{
                borderRightWidth: "50px",
                borderColor: "rgba(207, 198, 183, 1)",
                height: 30,
              }}
              type="text"
              placeholder=""
              className="border-ivory border-8 rounded-2xl w-96 focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0"
            />

            <div className="absolute ml-80 inset-y-0 flex items-center">
              <Button
                style={{ backgroundColor: "transparent" }}
                className="bg-transparent focus:ring-0"
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

      <div className="flex px-16 pt-8 pb-3 ">
        <p className="text-lg me-5 text-nowrap"> More Public Clubs: </p>
        <div className="flex justify-end">
          <Tabs theme={customTabs} aria-label="Pills" style="pills">
            <Tabs.Item active title="Random">
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                Content 1
              </p> */}
              <div className="grid grid-cols-4 justify-around gap-4 pb-8 ms-[-115px] me-[70px]">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Content 2
              </p>
            </Tabs.Item>
            <Tabs.Item title="Least Recently Created">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Content 3
              </p>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </div >
  );
};

export default BrowseClubs;
