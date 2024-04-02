"use client";

import { Card } from "flowbite-react";
import { useState } from "react";

function CardComponent() {
    const [clubImg, setClubImg] = useState<string>("");
    const [publicClub, setPublicClub] = useState<boolean>(true);
    const [clubTitle, setClubTitle] = useState<string>("");

  return (
    <Card
      className="max-w-sm"
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc={clubImg}
    >
      <p className="font-normal text-gray-700 dark:text-gray-400">{publicClub ? "Public" : "Private"}</p>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {clubTitle}
      </h5>
    </Card>
  );
}
export default CardComponent