"use client"

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import SearchIcon from '@mui/icons-material/Search'
import { Button, TextInput } from 'flowbite-react';
import ClubModalComponent from '../components/ClubModalComponent';
import { CarouselComponent } from '../components/CarouselComponent';
import CardComponent from '../components/CardComponent';
import { publicClubsApi } from '@/utils/DataServices';
import { IClubs } from '@/Interfaces/Interfaces';

// STILL NEED TO : for the cards, want to randomize clubs and have 12 cards showcasing


const BrowseClubs = () => {

  const [id, setId] = useState<number | undefined>();
  const [leaderId, setLeaderId] = useState<number | undefined>();
  const [description, setDescription] = useState<string>("");
  const [dateCreated, setDateCreated] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isPublic, setisPublic] = useState<boolean>(true);
  const [clubName, setClubName] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const [clubs, setClubs] = useState<IClubs[]>([]);

  useEffect(() => {
    const fetchedData = async () => {
      const getClubs = await publicClubsApi();
      // console.log(getClubs)
      setClubs(getClubs);
    }
    fetchedData();
  }, []);

  return (
    <div className='bg-offwhite h-full font-mainFont'>

      <NavbarComponent />

      {/* header , search, create clubs modal start */}
      <div className='grid lg:grid-cols-4 gap-0 pt-12 px-16'>

        <div>
          <p className='text-3xl text-darkbrown font-bold'> Public Clubs </p>
        </div>

        <div></div>

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

        <div className='flex justify-end'>
          <ClubModalComponent />
        </div>
      </div>
      {/* header , search, create clubs modal end */}

      <div className='px-16 p-3'>
        <p className='text-lg'> Popular Clubs: </p>
      </div>

      <div className='px-16'>
        <CarouselComponent />
      </div>

      <div className='px-16 pt-8 pb-3'>
        <p className='text-lg'> More Public Clubs: </p>
      </div>

      <div className='grid grid-cols-4 justify-around  gap-5 px-20 '>
        {clubs.map((club, idx) => (
          <div key={idx} className='col-span-1'>
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
      {/* 
      <div className='flex justify-around px-16 py-5'>
        <CardComponent/>
        <CardComponent/>
        <CardComponent/>
        <CardComponent/>
      </div>

      <div className='flex justify-around px-16 py-5'>
        <CardComponent/>
        <CardComponent/>
        <CardComponent/>
        <CardComponent/>
      </div> */}



    </div>
  )
}

export default BrowseClubs
