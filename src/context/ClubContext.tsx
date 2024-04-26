'use client'

import { IClubs, IUserData } from "@/Interfaces/Interfaces";
import { SetStateAction, createContext, useContext, useState } from "react"

type ClubContextType = {
    displayedClub: IClubs | null,
    setDisplayedClub: React.Dispatch<React.SetStateAction<IClubs | null>>
    displayedUser: IUserData | null,
    setDisplayedUser: React.Dispatch<React.SetStateAction<IUserData | null>>
}

export const ClubContext = createContext<ClubContextType>({} as ClubContextType);

export const AppWrapper = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [displayedClub, setDisplayedClub] = useState<IClubs | null>(null); 
    const [displayedUser, setDisplayedUser] = useState<IUserData | null>(null); 

    return (
        <ClubContext.Provider value={{displayedClub, setDisplayedClub, displayedUser, setDisplayedUser}}>
            {children}
        </ClubContext.Provider>
    )
}

// our function that gives us access to our context values
export const useClubContext = () => {
    return useContext(ClubContext);
}