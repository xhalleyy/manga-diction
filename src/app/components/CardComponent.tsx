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
      imgSrc="/dummyImg.png"
    >
      <div>
        <p className="text-sm text-gray-700 dark:text-gray-400 m-0">{publicClub ? "Public" : "Private"}</p>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 m-0 dark:text-white">
          Eunhyuk Supremacy
        </h5>
      </div>

    </Card>
  );
}
export default CardComponent