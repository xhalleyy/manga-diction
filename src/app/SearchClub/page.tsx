'use client'

import React, { useEffect, useRef, useState } from "react";
import { NavbarComponent } from "../components/NavbarComponent";
import SearchIcon from "@mui/icons-material/Search";
import { notFound, useRouter } from "next/navigation";
import { getClubsByName, specifiedClub } from "@/utils/DataServices";
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
  const { searchClub, setSearchClub, setDisplayedClub } = useClubContext();
  const [fetchedClubs, setFetchedClubs] = useState<any>(null);
  const [clubs, setClubs] = useState<IClubs[]>([]);
  const [pageSize, setPageSize] = useState<boolean>(true);
  let getToken;

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
      const clubDisplayedInfo = await specifiedClub(club.id);
      setDisplayedClub(clubDisplayedInfo);
    } catch (error) {
      alert("Error fetching club information");
      console.error(error);
    }
  };

  useEffect(()=>{
    const hasToken = () =>{
      const token = localStorage.getItem("Token")
      if(token){
        return getToken = true;
      }else{
        return getToken = false;
      }
    }
    
    hasToken()
  },[])

  if(!getToken){
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
            <div className={pageSize ? "flex justify-end gap-5 col-span-2" : "pt-6 flex justify-center"}>
              <div className={pageSize ? "relative ml-20" : " px-3 relative w-full flex justify-center"}>
                <TextInput
                  ref={inputRef}
                  id="base"
                  style={{
                      borderRightWidth: "50px",
                      borderColor: "rgba(207, 198, 183, 1)",
                      height: 30,
                    }}
                  type="text"
                  placeholder="°❀⋆.ೃ࿔*:･ Search a Club! ৻(  •̀ ᗜ •́  ৻)"
                  className={pageSize ? "border-ivory font-mainFont border-8 rounded-2xl w-96 focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0" : " border-ivory font-mainFont border-8 w-[340] ml-2 rounded-2xl focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0"}
                />


                <div style={pageSize ? {} : { marginLeft: '325px' }} className={pageSize ? "absolute ml-80 inset-y-0 flex items-center" : "flex items-center absolute inset-y-0 ml-72 mr-10"}>
                  <Button
                    style={{ backgroundColor: "transparent" }}
                    className="bg-transparent focus:ring-0 "
                    onClick={handleClick}
                  >
                    <SearchIcon className="text-4xl text-white" />
                  </Button>{" "}
                </div>
              </div>

              <div className={pageSize ? "" : "hidden"}>
                <ClubModalComponent />
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
