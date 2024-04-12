'use client'
import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import { CarouselComponent } from '../components/CarouselComponent'
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import { Card } from "flowbite-react";

const Dashboard = () => {

  return (
    <div className='bg-offwhite h-screen'>

      <NavbarComponent />


      <div className="flex flex-1 justify-between items-end px-[70px] my-4">
        <p className='font-mainFont text-lg mt-2'>Popular Public Clubs:</p>
        <div>
          <ClubModalComponent />
        </div>
      </div>

      <div className='px-[70px] mb-10 '>
        <CarouselComponent />
      </div>

      <div className='px-[70px] grid grid-cols-4 gap-12'>
        <div className='col-span-3'>
          <p className='font-mainFont text-lg mt-2 mb-3'>Recent Posts:</p>
          <div className='bg-paleblue p-5 rounded-lg'>
            <PostsComponent />
            {/* <PostsComponent /> */}
          </div>
        </div>
        <div className='col-span-1'>
          <p className='font-mainFont text-lg mt-2 mb-3'>Latest Updates:</p>
          {/* latest updates component */}
          <div className='bg-ivory rounded-lg p-5'>
            <div className='flex flex-row pb-3'>
              <Card className="w-full object-fit h-36" imgSrc="/mangaexample.png" horizontal>
                <div className=''>
                  <h5 className="text-2xl font-poppinsMed text-gray-900 justify-start text-start">
                    Dreaming Freedom
                  </h5>
                  <p className='text-md font-mainFont'>Chapter 103</p>
                </div>
              </Card>
            </div>
            <div className='flex flex-row'>
              <Card className="w-full object-fit h-36" imgSrc="/mangaexample.png" horizontal>
                <div>
                  <h5 className="text-2xl font-poppinsMed tracking-tight text-gray-900 justify-start text-start">
                    Dreaming Freedom
                  </h5>
                  <p className='text-md font-mainFont'>Chapter 103</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
