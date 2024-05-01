"use client";

import { Card, CustomFlowbiteTheme } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



function CardProfPgComponent( prop: {id: number, leaderId: number, description: string, dateCreated: string, image: string, isPublic: boolean, clubName: string, isDeleted: boolean}) {
  
  const router = useRouter();
  const [pageSize, setPageSize] = useState<boolean>(false)
  
  const goToClub = () => {
    router.push('/ClubPage');
  }

  useEffect(() => {
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
  
  }, [])

  
  const customCard: CustomFlowbiteTheme["card"] = {
    "root": {
      "base": `flex rounded-lg bg-white bg-opacity-70 shadow-md  dark:bg-gray-800 h-28`,
      "children": "flex flex-col justify-start gap-3 items-start !h-20",
      "horizontal": {
        "off": "flex-col",
        "on": "flex-col md:max-w-xl md:flex-row"
      },
      "href": "hover:bg-gray-100 dark:hover:bg-gray-700"
    },
    "img": {
      "base": "w-full object-cover",
      "horizontal": {
        "off": "rounded-t-lg",
        "on": "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg",
      }
    }
  };
  

  return (
    <Card onClick={goToClub}
      className="max-w-sm cursor-pointer"
      imgAlt={prop.description}
      theme={customCard}
    >
      <div className={pageSize ? "flex flex-col" : "flex flex-row"}>
    {!pageSize && (
      <img
        className="w-24 h-28 object-cover mr-4 rounded-l-lg"
        src={prop.image}
        alt={prop.description}
      />
    )}
    <div className="mt-5">
      <p className="text-sm font-mainFont text-gray-700 dark:text-gray-400 m-0">
        {prop.isPublic ? "Public" : "Private"}
      </p>
      <h5 className="text-lg font-poppinsMed tracking-tight text-gray-900 m-0 dark:text-white">
        {prop.clubName}
      </h5>
    </div>
  </div>

    </Card>
  );
}
export default CardProfPgComponent