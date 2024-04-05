import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import CardComponent from '../components/CardComponent'
import ClubModalComponent from '../components/ClubModalComponent'

const page = () => {
  return (
    <div>

        <NavbarComponent/>

        <div>
          <div className="flex flex-1 justify-between">
            <p>Popular Public Clubs:</p>
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
