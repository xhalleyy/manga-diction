"use client"

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import SearchIcon from '@mui/icons-material/Search'
import { Button, TextInput } from 'flowbite-react';
import ClubModalComponent from '../components/ClubModalComponent';
import { CarouselComponent } from '../components/CarouselComponent';
import CardComponent from '../components/CardComponent';
import { publicClubsApi, specifiedClub } from '@/utils/DataServices';
import { IClubs } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';


const BrowseClubs = () => {

  const clubData = useClubContext();
  const [clubs, setClubs] = useState<IClubs[]>([]);

  useEffect(() => {
    const fetchedData = async () => {
      const getClubs = await publicClubsApi();
      setClubs(getClubs);
    }
    fetchedData();
  }, []);

  const handleClubCardClick = async (club: IClubs) => {
    try {
      const clubDisplayedInfo = await specifiedClub(club.id);
      clubData.setDisplayedClub(clubDisplayedInfo);
    } catch (error) {
      alert("Error fetching club information");
      console.error(error);
    }
  };

  const shuffledClubs = clubs.sort(() => Math.random() - 0.5);
  const randomClubs = shuffledClubs.slice(0, 12);

  return (
    <div className='bg-offwhite font-mainFont'>

      <NavbarComponent />

      {/* header , search, create clubs modal start */}
      <div className='grid lg:grid-cols-2 gap-0 pt-5 px-16 items-center pb-4'>

        <div>
          <p className='text-3xl text-darkbrown font-bold'> Public Clubs </p>
        </div>

        <div className='flex justify-end gap-5'>
          <div className="relative ml-20">
            <TextInput
              id='base'
              style={{ borderRightWidth: '50px', borderColor: 'rgba(207, 198, 183, 1)', height: 30 }}
              type="text"
              placeholder=""
              className="border-ivory border-8 rounded-2xl w-96 focus:border-none hover:bg-transparent focus:ring-0 focus:outline-none focus:border-0"
            />

            <div className="absolute ml-80 inset-y-0 flex items-center">
              <Button style={{ backgroundColor: 'transparent' }} className="bg-transparent focus:ring-0">
                <SearchIcon className='text-4xl text-white' />
              </Button>          </div>
          </div>

          <div className='flex justify-end '>
            <ClubModalComponent />
          </div>
        </div>

      </div>

      <div className='px-[130px] mb-2'>
        <CarouselComponent />
      </div>

      <div className='px-16 pt-8 pb-3'>
        <p className='text-lg'> More Public Clubs: </p>
      </div>

      <div className='grid grid-cols-4 justify-around  gap-4 px-[140px] pb-8 '>
        {randomClubs.map((club, idx) => (
          <div key={idx} className='col-span-1' onClick={() => handleClubCardClick(club)}>
            <CardComponent
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
        ))}
      </div>


    </div>
  )
}

export default BrowseClubs
