'use client'

import { IClubs } from "@/Interfaces/Interfaces";
import { SetStateAction, createContext, useContext, useState } from "react"

type ClubContextType = {
    displayedClub: IClubs | null,
    setDisplayedClub: React.Dispatch<React.SetStateAction<IClubs | null>>
    // id: number,
    // leaderId: number,
    // clubName: string,
    // image: string,
    // description: string,
    // dateCreated: string,
    // isPublic: boolean,
    // isDeleted: boolean,
    // setId: React.Dispatch<React.SetStateAction<number>>,
    // setLeaderId: React.Dispatch<React.SetStateAction<number>>,
    // setClubName: React.Dispatch<React.SetStateAction<string>>,
    // setImage: React.Dispatch<React.SetStateAction<string>>,
    // setDescription: React.Dispatch<React.SetStateAction<string>>,
    // setDateCreated: React.Dispatch<React.SetStateAction<string>>,
    // setIsPublic: React.Dispatch<React.SetStateAction<boolean>>,
    // setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>,
}

export const ClubContext = createContext<ClubContextType>({} as ClubContextType);

export const AppWrapper = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [displayedClub, setDisplayedClub] = useState<IClubs | null>(null); 
    // const [id, setId] = useState<number>(0);
    // const [leaderId, setLeaderId] = useState<number>(0);
    // const [clubName, setClubName] = useState<string>("");
    // const [image, setImage] = useState<string>("");
    // const [description, setDescription] = useState<string>("");
    // const [dateCreated, setDateCreated] = useState<string>("");
    // const [isPublic, setIsPublic] = useState<boolean>(true);
    // const [isDeleted, setIsDeleted] = useState<boolean>(false);

    return (
        <ClubContext.Provider value={{displayedClub, setDisplayedClub}}>
            {children}
        </ClubContext.Provider>
    )
}

// our function that gives us access to our context values
export const useClubContext = () => {
    return useContext(ClubContext);
}