import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import CardComponent from '../components/CardComponent'
import ClubModalComponent from '../components/ClubModalComponent'

const page = () => {
  return (
    <div className='bg-mainBg h-screen'>

        <NavbarComponent/>

        <div>
          <div className="flex flex-1 justify-between px-[70px]">
            <p className='font-mainFont text-lg mt-1'>Popular Public Clubs:</p>
            <div>
              <ClubModalComponent/>
            </div>
          </div>
        </div>

        <CardComponent/>
        
        <PostsComponent/>

    </div>
  )
}

export default page
