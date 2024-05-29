'use client'

import React, { useEffect, useRef, useState } from "react";
import { NavbarComponent } from "../components/NavbarComponent";
import SearchIcon from "@mui/icons-material/Search";
import { notFound, useRouter } from "next/navigation";
import { getClubsByName, getRecentClubPosts, getStatusInClub, specifiedClub } from "@/utils/DataServices";
import { IClubs } from "@/Interfaces/Interfaces";
import { useClubContext } from "@/context/ClubContext";
import CardComponent from "../components/CardComponent";
import { TextInput, Button } from "flowbite-react";
import ClubModalComponent from "../components/ClubModalComponent";
import CardProfPgComponent from "../components/CardProfPgComponent";
import { checkToken } from "@/utils/token";

const SearchClub = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchClub, setSearchClub, setDisplayedClub, displayedClub, setDisplayedPosts, setStatus, setMessage, setPrivateModal, setSelectedPostId } = useClubContext();
  const [fetchedClubs, setFetchedClubs] = useState<any>(null);
  const [clubs, setClubs] = useState<IClubs[]>([]);
  const [pageSize, setPageSize] = useState<boolean>(true);

  // This useEffect gets Clubs by name, using the useContext where we saved the value from the input field
  useEffect(() => {
    const fetchedClubsData = async (clubName: string | null) => {
      try {
        const data = await getClubsByName(clubName);
        // filter out clubs with isDeleted: true before setting fetchedClubs
        const filteredData = data.filter((club: IClubs) => !club.isDeleted);
        setFetchedClubs(filteredData); // Update the fetched clubs data
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    if (searchClub) {
      fetchedClubsData(searchClub);
    }
  }, [searchClub]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageSize(window.innerWidth > 768)
    }

    const handleResize = () => {
      setPageSize(window.innerWidth > 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  const handleClick = () => {
    if (inputRef.current) {
      // Access the value of the input element using inputRef.current.value
      const inputValue = inputRef.current.value.toLowerCase();
      setSearchClub(inputValue);
      console.log(inputValue)
      // router.push('/SearchClub');
    } else {
      console.log('Input element not found.');
    }
  }

  const handleClubCardClick = async (club: IClubs) => {
    try {
      const userId = Number(localStorage.getItem("UserId"))
      const clubDisplayedInfo = await specifiedClub(club.id);
      const postInfo = await getRecentClubPosts(club.id)
      setSelectedPostId(null)
      setDisplayedClub(clubDisplayedInfo);
      setDisplayedPosts(postInfo)
      if (clubDisplayedInfo.isPublic === false && clubDisplayedInfo.leaderId !== userId) {
        console.log(club.id, userId)
        const statusInfo = await getStatusInClub(club.id, userId);
          setStatus(statusInfo)
          if (statusInfo.status === 1) {
            setPrivateModal(false);
          } else if (statusInfo.status === 0) {
            setPrivateModal(true)
            setMessage('You have already requested to join');
          } else if (statusInfo.status === 2) {
            setPrivateModal(true)
            setMessage('Unfortunately, you have been denied to join.')
          } else {
            setPrivateModal(true)
            setMessage('You are not able to view this private club.')
          }
        }else{
          setPrivateModal(false)
        }
    } catch (error) {

    }
  };

  if (!checkToken()) {
    notFound();
  }

  return (
    <>
      <div className="bg-offwhite h-screen">

        <NavbarComponent />

        <div className="bg-offwhite h-full">

          <div className={pageSize ? "grid lg:grid-cols-3 gap-0 pt-5 px-16 items-center pb-4" : "" }>
          <div className={pageSize ? "contents" : "hidden"}>
              <h1 className='text-[26px] font-poppinsMed text-darkbrown ps-5'>Club Results for &apos;{searchClub}&apos;</h1>
            </div>

            {/* search bar hidden on lg, visible on mobile */}
            <div className={pageSize ? "hidden" : "pt-6 grid grid-flow-row px-1"}>
            <div className={pageSize ? "hidden" : "px-3 relative flex items-center flex-wrap"}>
              <div className="relative md:max-w-96 sm:w-auto flex-grow md:ml-36">
                <TextInput
                  ref={inputRef}
                  id="base"
                  style={{
                    borderColor: "rgba(207, 198, 183, 1)",
                    height: 30,
                    paddingRight: '10px',
                    borderRightWidth: '50px'  // Adjust padding to make space for the button
                  }}
                  type="text"
                  placeholder="°❀⋆.ೃ࿔*:･ Search a Club! ৻(  •̀ ᗜ •́  ৻)"
                  className="border-ivory text-center font-mainFont border-8 rounded-2xl focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0"
                />

                <SearchIcon style={{ backgroundColor: "transparent", position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }} onClick={handleClick} className="text-4xl text-white" />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto flex-shrink-0">
                <ClubModalComponent />
              </div>
            </div>
          </div>

            <div className={pageSize ? "hidden" : "contents"}>
              <h1 className='text-[26px] font-poppinsMed text-darkbrown px-5 py-5'>Club Results for &apos;{searchClub}&apos;</h1>
            </div>
          </div >

          {pageSize ? 
          <div className='mt-5'>
          {/* <h1 className='px-16 text-[26px] font-poppinsMed text-darkbrown'>Club Results for &apos;{router.query.search}&apos;</h1> */}

          <div className="grid 2xl:grid-cols-5 lg:grid-cols-3 gap-5 lg:px-[30px] xl:px-[90px] mt-8">
            {/* search results, 5 per 'row' */}
            {/* if no matches found, display 'hidden' h1 with a message similar to "Can't find what you're looking for? Double check your spelling" */}

            {fetchedClubs &&
              fetchedClubs.map((club: any, idx: number) => (
                !club.isDeleted && (
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
                    isMature={club.isMature}
                    isPublic={club.isPublic}
                    clubName={club.clubName}
                    isDeleted={club.isDeleted}
                  />
                </div>
              )))}

          </div>

        </div> : 
        <div className='mt-5'>
        {/* <h1 className='px-16 text-[26px] font-poppinsMed text-darkbrown'>Club Results for &apos;{router.query.search}&apos;</h1> */}

        <div className="px-[30px]">
          {/* search results, 5 per 'row' */}
          {/* if no matches found, display 'hidden' h1 with a message similar to "Can't find what you're looking for? Double check your spelling" */}
          {fetchedClubs &&
            fetchedClubs.map((club: any, idx: number) => (
              !club.isDeleted && (
              <div
                key={idx}
                className="col-span-1 pb-2"
                onClick={() => handleClubCardClick(club)}
              >
                <CardProfPgComponent
                  id={club.id}
                  leaderId={club.leaderId}
                  description={club.description}
                  dateCreated={club.dateCreated}
                  image={club.image}
                  isMature={club.isMature}
                  isPublic={club.isPublic}
                  clubName={club.clubName}
                  isDeleted={club.isDeleted}
                />
              </div>
            )))}

        </div>

      </div>}
          
        </div>
      </div>
    </>
  );
};

export default SearchClub;
