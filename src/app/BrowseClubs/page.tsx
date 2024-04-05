"use client";

import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'

const page = () => {
  return (
    <div className='bg-mainBg h-screen font-mainFont'>

        <NavbarComponent/>

        <p className='text-4xl text-signHeader p-10'> Public Clubs </p>
      
    </div>
  )
}

export default page
