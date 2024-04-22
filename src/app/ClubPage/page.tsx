'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { grey, brown } from '@mui/material/colors';
import { TextInput, Label, Dropdown } from 'flowbite-react';
import PostsComponent from '../components/PostsComponent';
import { getPostsByClubId } from '@/utils/DataServices';
import { IPosts } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';
import Image from 'next/image';

const ClubPage = () => {

  // const {id, leaderId, clubName, image, description, dateCreated, isPublic, isDeleted} = useClubContext();
  const { displayedClub } = useClubContext();
  const [joined, setJoined] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPosts[]>([]);

  const handleJoinBtn = () => {
    setJoined(!joined)
  }

  const handleCreatePost = () => {
    setCreatePost(!createPost);
  }

  useEffect(() => {
    const fetchedData = async (clubId: number) => {
      const getPosts = await getPostsByClubId(clubId);
      setPosts(getPosts);
      console.log(getPosts);
    }
    fetchedData(1);
  }, [])

  const customInput = {
    "field": {
      "input": {
        "sizes": {
          "post": "py-1 px-2 text-lg font-mainFont"
        }
      }
    }
  }

  const customDropdown = {

    "floating": {
      "base": "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none",
      "content": "py-1 text-sm text-gray-700 dark:text-gray-200",
      "divider": "my-1 h-px bg-gray-100 dark:bg-gray-600",
      "header": "block px-3 py-1 text-sm text-gray-700 dark:text-gray-200",
      "hidden": "invisible opacity-0",
      "item": {
        "container": "",
        "base": " flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
        "icon": "mr-2 h-4 w-4"
      },
      "style": {
        "lightblue": "bg-teal-100 text-black text-lg font-mainFont",
        "dark": "bg-gray-900 text-white dark:bg-gray-700",
        "light": "border border-gray-200 bg-white text-gray-900",
        "auto": "bg-teal-100 border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
      },
    },
  }

  return (

    <div className='min-h-screen bg-offwhite'>
      <NavbarComponent />
      <div className='px-16'>
        <div className='flex pt-4'>
          <div className='flex-1 items-end pt-3'>
            <h1 className='font-poppinsMed text-3xl text-darkbrown'>{displayedClub?.clubName}</h1>
          </div>
          <div className='flex flex-row gap-3'>
            {!joined ?
              <div onClick={handleJoinBtn} className='bg-darkblue items-center rounded-2xl flex flex-row px-3 gap-2 cursor-pointer'>
                <h1 className='font-poppinsMed text-xl text-white py-2'>Join Club</h1>
                <AddIcon sx={{ fontSize: 30, color: grey[50] }} />
              </div>
              :
              <>
                <div onClick={handleCreatePost} className={createPost ? 'bg-brown items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer' : 'bg-ivory items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer'}>
                  <h1 className='font-poppinsMed text-xl text-darkbrown py-2'>Create Post</h1>
                  <AddIcon sx={{ fontSize: 30, color: brown[800] }} />
                </div>
                <div onClick={handleJoinBtn} className='bg-darkblue items-center rounded-2xl flex flex-row px-3 gap-2 cursor-pointer'>
                  <h1 className='font-poppinsMed text-xl text-white py-2'>Joined</h1>
                  <CheckIcon sx={{ fontSize: 25, color: grey[50] }} />
                </div>
              </>
            }
          </div>
        </div>

        <div className='py-1.5'>
          <div className='bg-ivory inline-block rounded-xl'>
            <p className='text-lg font-mainFont text-darkbrown px-4'>{displayedClub?.isPublic ? 'Public' : 'Private'}</p>
          </div>
        </div>

        <div className='grid grid-cols-7 pt-3 gap-5'>
          <div className='col-span-5'>
            {createPost && joined ?
              <div className='bg-paleblue px-10 py-2 mb-5 rounded-xl'>
                <div className='grid grid-cols-12 items-center gap-3 py-1'>
                  <Label htmlFor="base" value="Title:" className='col-span-1 text-lg' />
                  <TextInput theme={customInput} id="base" type="text" sizing="post" className='col-span-11 w-7/12' />
                </div>
                <div className='grid grid-cols-12 items-center gap-3 py-1'>
                  <Label htmlFor="base2" value="Tags:" className='col-span-1 text-lg' />
                  <TextInput theme={customInput} id="base2" type="text" sizing="post" className='col-span-11 w-4/12' />
                </div>
                <div className='grid grid-cols-12 items-center gap-3 py-1'>
                  <Label htmlFor="base3" value="Post:" className='col-span-1 text-lg' />
                  <TextInput theme={customInput} id="base3" type="text" sizing="post" className='col-span-11 w-full' />
                </div>
              </div> : null
            }

            <div className='bg-mutedblue px-5 pb-5 pt-2 rounded-xl'>
              <div className='flex justify-end items-center'>
                <Dropdown theme={customDropdown} color="lightblue" className='!bg-paleblue' label="Sort Posts" dismissOnClick={false}>
                  <Dropdown.Item>Popular</Dropdown.Item>
                  <Dropdown.Item>Newest</Dropdown.Item>
                  <Dropdown.Item>Oldest</Dropdown.Item>
                  <Dropdown.Item>Recently Updated</Dropdown.Item>
                  <Dropdown.Item>Least Recently Updated</Dropdown.Item>
                </Dropdown>
              </div>
              <div className='opacity-90 py-3'>
                {posts.map((post, idx) => (
                  <div key={idx} className='col-span-1 py-2'>
                    <PostsComponent
                      id={post.id}
                      userId={post.userId}
                      clubId={post.clubId}
                      title={post.title}
                      category={post.category}
                      tags={post.tags}
                      description={post.description}
                      image={post.image}
                      likes={post.likes}
                      dateCreated={post.dateCreated}
                      dateUpdated={post.dateUpdated}
                      isDeleted={post.isDeleted}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='col-span-2'>
            <h1 className='font-mainFont text-lg ps-3 text-darkbrown'>Description:</h1>
            <div className='bg-white/80 border-8 border-ivory rounded-xl'>
              <img
                src={displayedClub?.image}
                alt='profile image'
                className='object-fit w-full shadow-lg'
              />
              <p className='p-2.5 font-poppinsMed text-darkbrown text-lg mt-1'>{displayedClub?.description}</p>
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
