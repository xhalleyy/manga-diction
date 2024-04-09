"use client";

import { Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



function CardComponent( prop: {id: number, leaderId: number, description: string, dateCreated: string, image: string, isPublic: boolean, clubName: string, isDeleted: boolean}) {
  
  const router = useRouter();
  
  const goToClub = () => {
    router.push('/ClubPage');
  }

  return (
    <Card onClick={goToClub}
      className="max-w-sm cursor-pointer"
      imgAlt={prop.description}
      imgSrc={prop.image}
    >
      <div>
        <p className="text-sm text-gray-700 dark:text-gray-400 m-0">{prop.isPublic ? "Public" : "Private"}</p>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 m-0 dark:text-white">
          {prop.clubName}
        </h5>
      </div>

    </Card>
  );
}
export default CardComponent