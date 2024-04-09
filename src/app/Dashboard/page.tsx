import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import CardComponent from '../components/CardComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import { CarouselComponent } from '../components/CarouselComponent'
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';

const page = () => {

  return (
    <div className='bg-offwhite h-screen'>

      <NavbarComponent />


      <div className="flex flex-1 justify-between px-[70px] my-6">
        <p className='font-mainFont text-lg mt-2'>Popular Public Clubs:</p>
        <div>
          <ClubModalComponent />
        </div>
      </div>

      <div className='px-[70px] mb-10 grid grid-cols-11'>
        {/* both "arrow" buttons are placeholders feel free to delete/replace */}
        {/* <button className='grid col-span-1'>arrow left</button> */}
        <ArrowCircleLeftTwoToneIcon sx={{fontSize: 60}} className='grid col-span-1 mt-[90%] ms-auto'/>
        {/* <div className="grid grid-cols-4 gap-1 col-span-3">   */}
        {/* <div> */}
          {/* if we define height and width for the cards they wont be altered by flex or grid */}
          {/* <CardComponent /> */}
        {/* </div> */}
        <CarouselComponent/>
        {/* </div> */}
        {/* <button className='grid col-span-1'>arrow right</button> */}
        <ArrowCircleRightTwoToneIcon sx={{fontSize: 60}} className='grid col-span-1 mt-[90%] me-auto'/>
      </div>

      <div className='px-[70px] grid grid-cols-4 gap-5'>
        <div className='grid col-span-3'>
          <p className='font-mainFont text-lg mt-2 mb-6'>Recent Posts:</p>
      <PostsComponent />
        </div>
        <div className='grid col-span-1'>
          <p className='font-mainFont text-lg mt-2 mb-6'>Latest Updates:</p>
          {/* latest updates component */}
        </div>
      </div>

    </div>
  )
}

export default page
