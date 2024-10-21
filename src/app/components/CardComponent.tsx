"use client";

import { Card, CustomFlowbiteTheme } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


function CardComponent( prop: {id: number, leaderId: number, description: string, dateCreated: string, image: string, isMature: boolean, isPublic: boolean, clubName: string, isDeleted: boolean}) {
  
  const router = useRouter();
  
  
  const goToClub = () => {
    router.push(`/Clubs/${prop.id}`);
  }

  if(prop.isDeleted){
    // returning null leaves empty space where card used to be, return empty tags for formatting
    return <></>;
    // both return null and return empty tags still leave card-sized portions of empty space in carousel and search clubs page
  }
  

  const customCard: CustomFlowbiteTheme["card"] = {
    "root": {
      "base": "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
      "children": "flex flex-col justify-start pt-2  gap-3 px-6 items-start !h-20",
      "horizontal": {
        "off": "flex-col",
        "on": "flex-col md:max-w-xl md:flex-row"
      },
      "href": "hover:bg-gray-100 dark:hover:bg-gray-700"
    },
    "img": {
      "base": "h-[170px] w-full object-cover",
      "horizontal": {
        "off": "rounded-t-lg",
        "on": "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg",
      }
    }
  }

  return (
    <Card onClick={goToClub}
      className="max-w-sm cursor-pointer"
      imgAlt={prop.description}
      imgSrc={prop.image || '/dummyImg.jpg'}
      theme={customCard}

    >
      <div className="w-full">
        <div className="flex justify-between">
        <p className="text-sm font-mainFont text-gray-700 dark:text-gray-400 m-0">{prop.isPublic ? "Public" : "Private"}</p>
        {prop.isMature && (
        <p className="text-sm px-3  bg-red-700 text-white font-poppinsMed rounded-lg">Mature</p>
        )}
        </div>
        <h5 className="text-lg font-poppinsMed tracking-tight text-gray-900 m-0 dark:text-white">
          {prop.clubName}
        </h5>
      </div>

    </Card>
  );
}
export default CardComponent