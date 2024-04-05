"use client"

import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import SearchIcon from '@mui/icons-material/Search'
import { TextInput, theme } from 'flowbite-react';
import { useTheme } from '@mui/material';

const page = () => {

  const theme = useTheme();

  return (
    <div className='bg-mainBg h-screen font-mainFont'>

      <NavbarComponent />

      <div className='grid lg:grid-cols-3 p-12'>

        <div>
          <p className='text-3xl text-signHeader font-bold'> Public Clubs </p>
        </div>

        <div>
          <input style={{ borderRightWidth: '60px' }} className='border-searchColor border-t-8 border-l-8 border-b-8 rounded-xl font-mainFont p-1 w-96'/>
          <div className="absolute right-0 left-60 flex items-center justify-center pr-3">
            <SearchIcon className='absolute text-5xl mb-11 text-white'/> 
          </div>
        </div>

        <div className="relative">
                <TextInput
                style={{borderRightWidth: '55px', borderColor: (theme.palette as any).searchColor}}
                  type="text"
                  placeholder=""
                  className="border-searchColor border-8 rounded-2xl w-96  focus:border-none"
                />

                <div className="absolute ml-80 inset-y-0 flex items-center pl-2">
                  <SearchIcon className='text-5xl text-white'/>
                </div>
              </div>


      </div>


    </div>
  )
}

export default page
