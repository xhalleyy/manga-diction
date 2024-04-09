'use client'

import React, { useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import {grey, brown} from '@mui/material/colors';
import { TextInput, Label } from 'flowbite-react';

const ClubPage = () => {

  const [joined, setJoined] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<boolean>(false);

  const handleJoinBtn = ()=> {
    setJoined(!joined)
  }

  const handleCreatePost = () => {
    setCreatePost(!createPost);
  }

  return (

    <div className='min-h-screen bg-offwhite'>
      <NavbarComponent/>
      <div className='px-16'>
      <div className='flex pt-4'>
        <div className='flex-1 items-end pt-3'>
          <h1 className='font-poppinsMed text-3xl text-darkbrown'>Jujutsu Lovers&lt;3</h1>
        </div>
        <div className='flex flex-row gap-3'>
        {!joined ?  
          <div onClick={handleJoinBtn} className='bg-darkblue items-center rounded-2xl flex flex-row px-3 gap-2 cursor-pointer'>
          <h1 className='font-poppinsMed text-xl text-white py-2'>Join Club</h1>
          <AddIcon sx={{fontSize: 30, color: grey[50]}}/>
         </div>
        :
        <>
          <div onClick={handleCreatePost} className={createPost ? 'bg-brown items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer' : 'bg-ivory items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer'}>
            <h1 className='font-poppinsMed text-xl text-darkbrown py-2'>Create Post</h1>
            <AddIcon sx={{fontSize: 30, color: brown[800]}}/>
          </div>
          <div onClick={handleJoinBtn} className='bg-darkblue items-center rounded-2xl flex flex-row px-3 gap-2 cursor-pointer'>
            <h1 className='font-poppinsMed text-xl text-white py-2'>Joined</h1>
            <CheckIcon sx={{fontSize: 25, color: grey[50]}}/>
          </div>
        </>
      }
        </div>
      </div>
      
      <div className='py-1.5'>
        <div className='bg-ivory inline-block rounded-xl'>
          <p className='text-lg font-mainFont text-darkbrown px-4'>Public</p>
        </div>
      </div>
      
      <div className='grid grid-cols-7 pt-3 gap-5'>
        <div className='col-span-5'>
          { createPost && joined ?
          <div className='bg-paleblue px-10 py-2 rounded-xl'>
            <div className='flex flex-row items-center gap-3 py-1'>
              <Label htmlFor="base" value="Title:" className='text-lg'/>
              <TextInput id="base" type="text" sizing="md" className='w-96' />
            </div>
            <div className='flex flex-row items-center py-1 gap-3'>
              <Label htmlFor="base2" value="Tags:" className='text-lg'/>
              <TextInput id="base2" type="text" sizing="md" className='w-96' />
            </div>
            <div className='flex flex-row items-center py-1 gap-3'>
              <Label htmlFor="base3" value="Post:" className='text-lg'/>
              <TextInput id="base3" type="text" sizing="md" className='w-96' />
            </div>
          </div> : null
          }
        </div>
        <div className='col-span-2'>
          <div className='bg-white/80 border-8 border-ivory rounded-xl'>
            <p className='p-2.5 font-mainFont text-darkbrown text-lg'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex consequat. </p>
          </div>

          <div>
            <button className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl mt-5 py-1 font-mainFont text-darkbrown text-lg'>Edit Club Settings</button>
            <button className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl mt-2.5 py-1 font-mainFont text-darkbrown text-lg'>All Members</button>
            <button className='text-center flex w-full justify-center border-2 border-darkblue bg-darkblue rounded-xl mt-2.5 py-1 font-mainFont text-white text-lg'>Delete Club</button>
          </div>
        </div>
      </div>

      </div>
    </div>
    
  )
}

export default ClubPage
