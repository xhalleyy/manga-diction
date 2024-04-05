import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import CardComponent from '../components/CardComponent'
import ClubModalComponent from '../components/ClubModalComponent'

const page = () => {
  return (
    <div className='bg-mainBg h-screen'>

      <NavbarComponent />


      <div className="flex flex-1 justify-between px-[70px] my-6">
        <p className='font-mainFont text-lg mt-2'>Popular Public Clubs:</p>
        <div>
          <ClubModalComponent />
        </div>
      </div>

      <div className='px-[70px]'>
        {/* both "arrow" buttons are placeholders feel free to delete/replace */}
        <button>arrow left</button>
        <div className="grid grid-cols-4 gap-1">  
        <div>
          {/* if we define height and width for the cards they wont be altered by flex or grid */}
          <CardComponent />
        </div>
        </div>
        <button>arrow right</button>
      </div>

      <div className='px-[70px]'>
        <div>
      <PostsComponent />
        </div>
        <div>
          {/* latest updates component */}
        </div>
      </div>

    </div>
  )
}

export default page
