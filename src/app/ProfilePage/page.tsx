import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import AddIcon from '@mui/icons-material/Add';
import CardComponent from '../components/CardComponent';

const ProfilePage = () => {
  return (
    <div className='bg-offwhite h-screen'>
      
      <NavbarComponent/>

        <div className="px-[70px]">
            <div className="grid grid-cols-4 gap-1">
                <div className="col-span-1">
                    {/* username, name, add btn, friends section */}
                    <div className='flex flex-col justify-center mb-10'>
                        <div className='flex justify-center'>
                        <img src='/dummyImg.png' alt='profile image' className='pfp shadow-md'/>
                        </div>
                        <div className='text-center'>
                        <h1 className='text-[28px] font-mainFont font-bold'>User Name</h1>
                        <h2 className='text-[22px] font-mainFont'>Nanami Kento</h2>
                        <div className='mt-3'>
                        <button className='darkBlue text-white py-1 px-3 rounded-2xl'>Add as Friend
                        <AddIcon/>
                        </button>
                        </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <div className='ms-5'>
                            <h3 className='text-2xl font-mainFont font-semibold'>Friends</h3>
                            </div>
                            <div className='me-5'>
                            <AddIcon fontSize='large'/>
                            </div>
                        </div>
                        <div className="bg-ivory rounded-lg p-[5px]">
                            {/* displays 4 friends at a time ? */}
                            <div className="bg-white py-[10px] mb-1 flex rounded-t-md">
                                <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10'/>
                                <div className='ms-10'>
                                <h4>UserName</h4>
                                <p>Geto Suguru</p>
                                </div>
                            </div>

                            <div className="bg-white py-[10px] mb-1 flex">
                                <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10'/>
                                <div className='ms-10'>
                                <h4>UserName</h4>
                                <p>Geto Suguru</p>
                                </div>
                            </div>

                            <div className="bg-white py-[10px] mb-1 flex">
                                <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10'/>
                                <div className='ms-10'>
                                <h4>UserName</h4>
                                <p>Geto Suguru</p>
                                </div>
                            </div>

                            <div className="bg-white py-[10px] flex rounded-b-md">
                                <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10'/>
                                <div className='ms-10'>
                                <h4>UserName</h4>
                                <p>Geto Suguru</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-span-3 ms-10">
                    {/* (if own profile + user is in no clubs, create club button = true) clubs section, favorites section, displays 6+ clubs at a time, faves display 5 covers per 'row' */}
                    <div className="flex">
                    <div>
                    <button className='bg-mutedblue text-2xl py-1 px-9 rounded-xl font-mainFont font-light me-5'>Clubs</button>
                    </div>

                    <div>
                    <button className='bg-mutedblue text-2xl py-1 px-9 rounded-xl font-mainFont font-light'>Favorites</button>
                    </div>
                    {/* display none div unless conditions are met (viewing your own profile, in no clubs) */}
                    <div className='ms-auto'>
                        <ClubModalComponent/>
                    </div>
                    </div>

                    <div className='mt-4'>
                        {/* <div className='grid grid-cols-3 gap-5'>
                           <CardComponent/>
                           <CardComponent/>
                           <CardComponent/>
                           <CardComponent/>
                           <CardComponent/>
                           <CardComponent/>
                        </div> */}

                        <div>
                            <p className='font-mainFont text-lg mb-4'>Currently Reading:</p>
                            <div className='grid grid-cols-5'>
                                {/* current reads */}
                                <img src='/aot.png' className="h-[215px] w-[150px] mb-4"/>
                                
                               
                            </div>
                            <p className='font-mainFont text-lg mb-4'>Completed:</p>
                            <div className='grid grid-cols-5'>
                                {/* finished reads */}
                                <img src='/aot.png' className="h-[215px] w-[150px] mb-4"/>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
      

    </div>
  )
}

export default ProfilePage
