'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import { CarouselComponent } from '../components/CarouselComponent'
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import { Card } from "flowbite-react";
import { getPostsByClubId } from '@/utils/DataServices'
import { IPosts } from '@/Interfaces/Interfaces'
import DrawerComponent from '../components/DrawerComponent'

const Dashboard = () => {

  const [posts, setPosts] = useState<IPosts[]>([]);
  const [pageSize, setPageSize] = useState<boolean>(true);

  useEffect(() => {
    const fetchedData = async (clubId: number) => {
      const getPosts = await getPostsByClubId(clubId);
      setPosts(getPosts);
      // console.log(getPosts);
    }
    fetchedData(1);

    // handling window resize 
    const handleResize = () => {
      setPageSize(window.innerWidth > 768)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }

  }, [])






  return (
    <div className='bg-offWhite min-h-screen'>
      <div className='bg-offwhite pb-10'>

        <div className={pageSize ? 'contents' : 'sticky top-0'}>
          <NavbarComponent />
        </div>



        <div className={pageSize ? "flex flex-1 justify-between items-end px-[40px] my-4" : "px-[70px] my-4"}>
          <p className={pageSize ? 'font-mainFont text-lg mt-2' : 'font-mainFont text-2xl text-darkbrown text-center font-bold'}>{pageSize ? 'Popular Public Clubs:' : 'Popular Public Clubs'}</p>
          <div className={pageSize ? '' : 'hidden'}>
            <ClubModalComponent />
          </div>
        </div>

        <div className={pageSize ? 'px-[130px] mb-2 ' : 'px-[20px] mb-2 '}>
          <CarouselComponent />
        </div>

        <div className='px-[70px] grid grid-cols-4 gap-12'>
          <div className='col-span-3'>
            <p className='font-mainFont text-lg mt-2 mb-3'>Recent Posts:</p>
            <div className='bg-paleblue px-5 py-3 rounded-lg'>
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

    </div>
  )
}

export default Dashboard
