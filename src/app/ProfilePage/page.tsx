import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import ClubModalComponent from '../components/ClubModalComponent'

const ProfilePage = () => {
  return (
    <div className='bg-offwhite h-screen'>
      
      <NavbarComponent/>

        <div className="">
            <div className="grid grid-cols-4">
                <div className="col-span-1">
                    {/* username, name, add btn, friends section */}
                </div>
                <div className="col-span-3">
                    {/* (if own profile + user is in no clubs, create club button = true) clubs section, favorites section, displays 6+ clubs at a time, faves display 5 covers per 'row' */}
                    
                    {/* display none div unless conditions are met (viewing your own profile, in no clubs) */}
                    <div>
                        <ClubModalComponent/>
                    </div>

                </div>
            </div>
        </div>
      

    </div>
  )
}

export default ProfilePage
