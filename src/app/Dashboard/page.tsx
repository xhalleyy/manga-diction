'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import { CarouselComponent } from '../components/CarouselComponent'
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import { Badge, Button, Card } from "flowbite-react";
import { getPostsByClubId, getRecentPosts, getUserInfo, specifiedClub } from '@/utils/DataServices'
import { IClubs, IPosts, IUserData } from '@/Interfaces/Interfaces'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { notFound, useRouter } from "next/navigation";
import LatestUpdatesComponent from '../components/LatestUpdatesComponent'
import { useClubContext } from '@/context/ClubContext'
import { checkToken } from '@/utils/token'



const Dashboard = () => {

  const [posts, setPosts] = useState<IPosts[]>([]);
  const [pageSize, setPageSize] = useState<boolean>(true);
  const [usersMap, setUsersMap] = useState<Map<number, IUserData>>(new Map());
  const [clubsMap, setClubsMap] = useState<Map<number, IClubs>>(new Map());
  const router = useRouter();
  const { setDisplayedClub, setDisplayedPosts } = useClubContext();


  useEffect(() => {
    let userId = Number(localStorage.getItem("UserId"))
    const fetchedData = async () => {
      try {
        const recentPosts = await getRecentPosts(userId);
        const memberIds = recentPosts.map((post) => post.userId);
        const clubIds = recentPosts.map((post) => post.clubId);
  
        // Fetch users' info
        const membersInfo = await Promise.all(
          memberIds.map(async (memberId) => {
            const member = await getUserInfo(memberId)
            return [memberId, member] as const;
          })
        )
        const usersMap = new Map<number, IUserData>(membersInfo)
  
        // Fetch clubs' info
        const clubsInfo = await Promise.all(
          clubIds.map(async (clubId) => specifiedClub(clubId))
        );
        const clubsMap = new Map<number, IClubs>(
          clubsInfo.map((club) => [club.id, club])
        );
        setPosts(recentPosts);
        setUsersMap(usersMap);
        setClubsMap(clubsMap);
      } catch (error) {
        console.log('User does not have any recent posts')
      }
    }
    fetchedData();

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

  if (!checkToken()) {
    notFound();
  }

  const handleClubClick = (clubId: number) => () => {
    // Fetch club data based on clubId and set it as the displayed club
    const fetchAndSetClubData = async () => {
      const clubData = await specifiedClub(clubId);
      const postsData = await getPostsByClubId(clubId);
      setDisplayedClub(clubData);
      setDisplayedPosts(postsData)
      router.push('/ClubPage')
    };

    fetchAndSetClubData();
  };


  const handleBrowseClubs = () => {
    router.push('/BrowseClubs')
  }


  return (
    <>
      <div className='bg-offwhite flex flex-col flex-1 h-screen bg-cover bg-no-repeat'>

        <NavbarComponent />


        <div className='bg-offwhite flex flex-col pb-10'>

          <div className={pageSize ? "flex flex-1 justify-between items-start px-[40px] py-4" : "px-[70px] py-4"}>
            <p style={pageSize ? { fontSize: '30px' } : { fontSize: '26px' }} className={pageSize ? 'mt-2 ms-6 text-3xl text-darkbrown font-poppinsSemi' : 'font-mainFont text-darkbrown pt-4 text-center font-bold'}>Popular Clubs</p>
            <div className={pageSize ? 'mr-8' : 'hidden'}>
              <ClubModalComponent />
            </div>
          </div>

          <div className={pageSize ? 'px-[130px] mb-2' : 'px-[20px] mb-2'}>
            <CarouselComponent />
          </div>

          <div className={pageSize ? 'hidden' : 'contents'}>
            <div className='flex justify-center mt-5'>
              <Badge onClick={handleBrowseClubs} style={{ fontSize: 18 }} className='rounded-full font-mainFont bg-ivory border-2 border-darkbrown text-darkbrown'>
                browse more clubs <ArrowForwardIcon className='text-base' />
              </Badge>
            </div>
          </div>

          <div className={pageSize ? 'px-[70px] grid grid-cols-4 xl:gap-7 lg:gap-4' : 'px-4'}>
            <div className='col-span-3'>
              <p style={pageSize ? { fontSize: '18px' } : { fontSize: '26px' }} className={pageSize ? 'font-mainFont mt-2 mb-3' : 'font-mainFont font-bold text-darkbrown text-center my-5'}>Recent Posts:</p>
              <div className='bg-paleblue px-5 py-3 rounded-lg'>
                {posts.length === 0 ? (
                  <div className='col-span-1 py-2'>
                    <h1 className='py-20 text-center font-poppinsMed text-2xl text-darkbrown'>{"There are no posts in your clubs or you're not in any clubs!"} <br /> <span onClick={() => router.push('/BrowseClubs')} className='cursor-pointer underline hover:italic hover:text-[#3D4C6B]'>Join some clubs!</span></h1>
                  </div>
                ) : (
                  posts.map((post, idx) => (
                    <div key={idx} className='col-span-1 py-2 cursor-pointer' onClick={handleClubClick(post.clubId)}>
                      <PostsComponent
                        id={post.id}
                        userId={post.userId}
                        username={usersMap.get(post.userId)?.username || "Unknown User"}
                        clubId={clubsMap.get(post.clubId)!.id}
                        clubName={clubsMap.get(post.clubId)?.clubName || "Unknown Club"}
                        title={post.title}
                        category={post.category}
                        tags={post.tags ? post.tags.split(',') : null}
                        description={post.description}
                        image={usersMap.get(post.userId)?.profilePic || "/noprofile.jpg"}
                        dateCreated={post.dateCreated}
                        dateUpdated={post.dateUpdated}
                        isDeleted={post.isDeleted}
                        displayClubName={true}
                        shouldSort={false}
                        onSortCategory={() => {}}
                        onSortTag={() => {}}
                        fetchedPost={() => {}}
                        shouldEdit={false}
                      />
                    </div>
                  ))
                )}
                {/* <PostsComponent /> */}
              </div>
            </div>
            <div className={pageSize ? 'col-span-1' : ''}>
              <p style={pageSize ? { fontSize: '18px' } : { fontSize: '26px' }} className={pageSize ? 'font-mainFont mt-2 mb-3' : 'font-mainFont font-bold text-darkbrown text-center my-5'}>Latest Updates:</p>
              {/* latest updates component */}
              <div className='bg-ivory rounded-lg p-3 updatesHeight'>

                <LatestUpdatesComponent />
                {/* <LatestUpdatesComponent /> */}

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Dashboard
