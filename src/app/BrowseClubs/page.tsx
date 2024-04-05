"use client"

import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { TextField } from '@mui/material'

const page = () => {
  return (
    <div className='bg-mainBg h-screen font-mainFont'>

      <NavbarComponent />

      <div className='grid grid-cols-3 p-10 '>

        <div>
          <p className='text-3xl text-signHeader font-bold'> Public Clubs </p>
        </div>



      </div>

    </div>
  )
}

export default page
