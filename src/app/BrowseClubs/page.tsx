"use client"

import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import SearchIcon from '@mui/icons-material/Search'
import { TextInput } from 'flowbite-react';
import ClubModalComponent from '../components/ClubModalComponent';

const page = () => {


  return (
    <div className='bg-mainBg h-screen font-mainFont'>

      <NavbarComponent />

      <div className='grid lg:grid-cols-4 p-12'>

        <div>
          <p className='text-3xl text-signHeader font-bold'> Public Clubs </p>
        </div>

        <div></div>

        <div className="relative">
          <TextInput
            style={{ borderRightWidth: '60px', borderColor: 'rgba(207, 198, 183, 1)', height: 30 }}
            type="text"
            placeholder=""
            className="border-searchColor border-8 rounded-2xl w-96 focus:border-none"
          />

          <div className="absolute ml-80 inset-y-0 flex items-center pl-2">
            <SearchIcon className='text-4xl text-white' />
          </div>
        </div>

        <div className='flex justify-end'>
          <ClubModalComponent/>
        </div>


      </div>


    </div>
  )
}

export default page
