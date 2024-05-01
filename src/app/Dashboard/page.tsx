'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import { CarouselComponent } from '../components/CarouselComponent'
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import { Badge, Button, Card } from "flowbite-react";
import { getPostsByClubId } from '@/utils/DataServices'
import { IPosts } from '@/Interfaces/Interfaces'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from "next/navigation";
import LatestUpdatesComponent from '../components/LatestUpdatesComponent'


const Dashboard = () => {

  const [posts, setPosts] = useState<IPosts[]>([]);
  const [pageSize, setPageSize] = useState<boolean>(false);
  const router = useRouter();


  useEffect(() => {
    const fetchedData = async (clubId: number) => {
      const getPosts = await getPostsByClubId(clubId);
      setPosts(getPosts);
      // console.log(getPosts);
    }
    fetchedData(1);

    // handling window resize 
    // typeof returns a string indicating the type of the operand's value
    if (typeof window !== 'undefined') {
      setPageSize(window.innerWidth > 768);

      const handleResize = () => {
        setPageSize(window.innerWidth > 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

  }, [])


  const handleBrowseClubs = () => {
    router.push('/BrowseClubs')
  }


  return (
    <>
    <div className='bg-offWhite h-full'>

      <NavbarComponent/>


      <div className='bg-offwhite h-full pb-10'>

        <div className={pageSize ? "flex flex-1 justify-between items-end px-[40px] py-4" : "px-[70px] py-4"}>
          <p style={pageSize ? {fontSize: '18px'} : {fontSize: '26px'}} className={pageSize ? 'font-mainFont mt-2 ml-8 ' : 'font-mainFont text-darkbrown pt-4 text-center font-bold'}>{pageSize ? 'Popular Public Clubs:' : 'Popular Public Clubs'}</p>
          <div className={pageSize ? 'mr-8' : 'hidden'}>
            <ClubModalComponent />
          </div>
        </div>

        <div className={pageSize ? 'px-[130px] mb-2 ' : 'px-[20px] mb-2'}>
          <CarouselComponent />
        </div>

        <div className={pageSize ? 'hidden' : 'contents'}>
          <div className='flex justify-center mt-5'>
            <Badge onClick={handleBrowseClubs} style={{fontSize: 18}} className='rounded-full font-mainFont bg-ivory border-2 border-darkbrown text-darkbrown'>
              browse more clubs <ArrowForwardIcon className='text-base'/>
            </Badge>
          </div>
        </div>

        <div className={pageSize ? 'px-[70px] grid grid-cols-4 gap-12' : 'px-4'}>
          <div className='col-span-3'>
            <p style={pageSize ? {fontSize: '18px'} : {fontSize: '26px'}} className={pageSize ? 'font-mainFont mt-2 mb-3' : 'font-mainFont font-bold text-darkbrown text-center my-5'}>Recent Posts:</p>
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
          <div className={pageSize ? 'col-span-1' : ''}>
            <p style={pageSize ? {fontSize: '18px'} : {fontSize: '26px'}} className={pageSize ? 'font-mainFont mt-2 mb-3' : 'font-mainFont font-bold text-darkbrown text-center my-5' }>Latest Updates:</p>
            {/* latest updates component */}
            <div className='bg-ivory rounded-lg p-3'>
              
              <LatestUpdatesComponent/>
              <LatestUpdatesComponent/>

            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}

export default Dashboard
