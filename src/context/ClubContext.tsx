'use client'

import { IClubs, IGetManga, IManga, IPostData, IPosts, IUserData } from "@/Interfaces/Interfaces";
import { SetStateAction, createContext, useContext, useState } from "react"
 
type ClubContextType = {
    displayedClub: IClubs | null,
    setDisplayedClub: React.Dispatch<React.SetStateAction<IClubs | null>>,
    searchClub: string | null,
    setSearchClub:  React.Dispatch<React.SetStateAction<string | null>>
    displayedUser: IUserData | null,
    setDisplayedUser: React.Dispatch<React.SetStateAction<IUserData | null>>
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    author: string,
    setAuthor: React.Dispatch<React.SetStateAction<string>>,
    demographics: string,
    setDemographics: React.Dispatch<React.SetStateAction<string>>,
    publication: string,
    setPublication: React.Dispatch<React.SetStateAction<string>>,
    tags: string[],
    setTags: React.Dispatch<React.SetStateAction<string[]>>,
    mangaId: string,
    setMangaId: React.Dispatch<React.SetStateAction<string>>,
    selectedPostId: number | null,
    setSelectedPostId: React.Dispatch<SetStateAction<number | null>>
    selectedUser: IUserData | null,
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserData | null>>
    mangaInfo: IManga[],
    setMangaInfo: React.Dispatch<React.SetStateAction<IManga[]>>
    displayedPosts: IPosts[]
    setDisplayedPosts: React.Dispatch<React.SetStateAction<IPosts[]>>
}

export const ClubContext = createContext<ClubContextType>({} as ClubContextType);

export const AppWrapper = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [displayedClub, setDisplayedClub] = useState<IClubs | null>(null); 
    const [searchClub, setSearchClub] = useState<string | null>(null);
    const [displayedUser, setDisplayedUser] = useState<IUserData | null>(null); 
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('')
    const [demographics, setDemographics] = useState<string>('');
    const [publication, setPublication] = useState<string>('');
    const [tags, setTags] = useState<string[] >([]);
    const [mangaId, setMangaId] = useState<string>('');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUserData | null> (null);
    const [mangaInfo, setMangaInfo] = useState<IManga[]>([])
    const [displayedPosts, setDisplayedPosts] = useState<IPosts[]>([])

    return (
        <ClubContext.Provider value={{displayedClub, setDisplayedClub, searchClub, setSearchClub, displayedUser, setDisplayedUser, title, setTitle, author, setAuthor, demographics, setDemographics, publication, setPublication, tags, setTags, mangaId, setMangaId, selectedPostId, setSelectedPostId, selectedUser, setSelectedUser, mangaInfo, setMangaInfo, displayedPosts, setDisplayedPosts}}>
            {children}
        </ClubContext.Provider>
    )
}

// our function that gives us access to our context values
export const useClubContext = () => {
    return useContext(ClubContext);
}