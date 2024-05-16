'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { grey, brown } from '@mui/material/colors';
import { Dropdown, Modal, Button, CustomFlowbiteTheme, Tabs } from 'flowbite-react';
import PostsComponent from '../components/PostsComponent';
import { AddUserToClub, GetLikesByPost, RemoveMember, deleteClub, getClubMembers, getPostsByClubId, getUserInfo } from '@/utils/DataServices';
import { IPosts, IUserData } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';
import Image from 'next/image'
import CreatePostComponent from '../components/CreatePostComponent';
import EditClubSettingsComponent from '../components/EditClubSettingsComponent';
import { Chocolate, Planet } from 'react-kawaii';
import { Alert } from '@mui/material';
import PostRepliesComponent from '../components/PostRepliesComponent';
import { useRouter } from 'next/navigation';
;

const ClubPage = () => {
  const { displayedClub, selectedPostId, setSelectedPostId, setSelectedUser } = useClubContext();
  const [joined, setJoined] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPosts[]>([]);
  const [seeMembers, setSeeMembers] = useState<boolean>(false);
  const [members, setMembers] = useState<IUserData[]>([]);
  const [leader, setLeader] = useState<IUserData | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [usersMap, setUsersMap] = useState<Map<number, IUserData>>(new Map());

  // New state to track whether members section is visible
  const [membersVisible, setMembersVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<boolean>(false)
  const [editClub, setEditClub] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined)

  const router = useRouter();

  const fetchClubMembers = async (clubId: number | undefined) => {
    try {
      const [leaderInfo, memberIds] = await Promise.all([
        getUserInfo(displayedClub?.leaderId),
        getClubMembers(clubId),
      ]);

      setLeader(leaderInfo);

      const promises = memberIds.map((userId: number) => getUserInfo(userId));
      const usersInfo = await Promise.all(promises);
      setMembers(usersInfo);
    } catch (error) {
      console.error('Error fetching club data:', error);
    }
  };

  const handleJoinBtn = async () => {
    try {
      let userId = Number(localStorage.getItem("UserId"));
      const joinUser = await AddUserToClub(userId, displayedClub?.id);
      setJoined(true);
    } catch (error) {
      alert('Unable to Join Club at this moment');
      console.log(error);
    }
  };

  const handleCreatePost = () => {
    setCreatePost(!createPost);
  }

  const handleSeeMembers = () => {
    setSeeMembers(!seeMembers);
  }

  const handleEditClub = () => {
    setEditClub(!editClub);
  }

  const handleEditSuccess = () => {
    setSuccess(!success);
    setEditClub(false);
    setTimeout(() => {
      setSuccess(undefined);
    }, 4000);
  }

  // function to handle leaving and/or deleting club!!
  const handleLeave = async () => {
    let userId = Number(localStorage.getItem("UserId"));
    if (!isLeader) {
      const removeMember = await RemoveMember(userId, displayedClub?.id);
      setOpenModal(false);
      setJoined(false);
    } else {
      // STILL NEED TO WORK ON THIS
      // await deleteClub(displayedClub?.id)
      router.push('/Dashboard');
    }
  }

  const handlePostPage = (postId: number) => {
    setSelectedPostId(postId)
  }

  const handleMemberClick = (user: IUserData | null) => {
    setSelectedUser(user);
    router.push('/SearchedUser')
  }

  useEffect(() => {
    // set Selected Post null so that all the posts show instead of the full posts
    setSelectedPostId(null);
    // responsiveness
    if (typeof window !== 'undefined') {
      setPageSize(window.innerWidth > 768);
      const handleResize = () => {
        setPageSize(window.innerWidth > 768)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }

    const handleSettingsTabClick = () => {
      setSeeMembers(true);
      setMembersVisible(true); // Set members section to be visible
    };

    document.addEventListener('SettingsTabClicked', handleSettingsTabClick);

    return () => {
      document.removeEventListener('SettingsTabClicked', handleSettingsTabClick);
    };
  }, [])

  // if seeMembers is true, then we fetch the club members based on club's id and it rerenders when seeMembers is changed
  useEffect(() => {
    if (seeMembers) {
      fetchClubMembers(displayedClub?.id);
    }
  }, [seeMembers])

  useEffect(() => {

    let userId = Number(localStorage.getItem("UserId"));

    if (displayedClub?.leaderId === userId) {
      setIsLeader(true);
    }

    const fetchedData = async (clubId: number | undefined) => {
      try {
        if (clubId !== undefined) {
          const getPosts = await getPostsByClubId(clubId);
          console.log('Fetched Posts:', getPosts);
          setPosts(getPosts);

          const memberIds = getPosts.map((post) => post.userId);
          // console.log('Member IDs:', memberIds);

          const membersInfo = await Promise.all(
            memberIds.map(async (memberId) => {
              const member = await getUserInfo(memberId);
              return [memberId, member] as const;
            })
          );

          const usersMap = new Map<number, IUserData>(membersInfo);
          // console.log('Users Map:', usersMap);
          setUsersMap(usersMap);
        } else {
          // Handle the case when clubId is undefined
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchedData(displayedClub?.id);

    const checkJoined = async (clubId: number | undefined) => {
      try {
        if (clubId === undefined) {
          console.error('clubId is undefined');
          return;
        }

        const memberIds = await getClubMembers(clubId);
        if (memberIds.includes(Number(localStorage.getItem("UserId")) ?? 0)) {
          setJoined(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    checkJoined(displayedClub?.id)
  }, [displayedClub?.id])


  const customInput = {
    "field": {
      "input": {
        "sizes": {
          "post": "py-1.5 px-2 text-[16px] font-mainFont"
        }
      }
    }
  }

  const handleSortingPost = (option: string) => {
    let newOrder = posts;
    if (option === "Popular") {

    }
    if (option === "Newest") {
      newOrder.sort((a, b) => {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      })

    } else if (option === "Oldest") {

      newOrder.sort((a, b) => {
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      })
    } else if (option === "Recently Updated") {

    } else {

    }
    // (option === "Least Recently Updated") {

    setPosts(newOrder)
    console.log(posts)
  }

  const handleClickPost = (postId: number ) => {
    if (!isLeader && !joined) {
        alert("You need to join the club to view this post.");
    } else {
        handlePostPage(postId);
    }
};


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

  const customTabs: CustomFlowbiteTheme["tabs"] = {
    "base": "flex flex-col gap-2",
    "tablist": {
      "base": "text-center",
      "styles": {
        "underline": "font-mainFont  -mb-px border-b border-gray-200 dark:border-gray-700",
      },
      "tabitem": {
        "base": "font-mainFont rounded-t-lg p-4 text-lg font-bold first:ml-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-black disabled:dark:text-black",
        "styles": {
          "underline": {
            "base": "rounded-t-lg",
            "active": {
              "on": "active rounded-t-lg border-b-2 border-black text-darkbrown  dark:border-cyan-500 dark:text-cyan-500",
              "off": "border-b-2 border-transparent text-ivory hover:border-ivory dark:text-gray-400 dark:hover:text-gray-300"
            }
          },
        },
        "icon": "mr-2 h-5 w-5"
      }
    },
    "tabpanel": "py-3"
  }

  return (
    <>
      <div className='min-h-screen bg-offwhite'>

        <NavbarComponent />

        <div className={pageSize ? 'px-16' : 'px-5'}>

          {success && <div className={pageSize ? 'grid grid-cols-4' : 'pt-4'}>
            <Alert className='rounded-xl bg-paleblue' icon={<Planet size={30} mood="happy" color="#FCCB7E" />} severity="success">
              Club successfully updated!
            </Alert>
          </div>}


          <div className={pageSize ? 'hidden' : 'pt-4'}>
            <div className=''>
              <p className='text-xl font-mainFont text-darkbrown'>{displayedClub?.isPublic ? 'Public' : 'Private'}</p>
            </div>
          </div>

          <div className={pageSize ? 'flex pt-4' : 'contents'}>
            <div className={pageSize ? 'flex-1 items-end pt-3' : 'py-2'}>
              <h1 className='font-poppinsMed text-3xl text-darkbrown'>{displayedClub?.clubName}</h1>
            </div>
            <div className='flex flex-row gap-3'>
              {isLeader ?
                <div onClick={handleCreatePost} className={createPost ? 'bg-brown items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer' : 'bg-ivory items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer'}>
                  <h1 className={pageSize ? 'font-poppinsMed text-xl text-darkbrown py-2' : 'font-poppinsMed text-md text-darkbrown py-2'}>Create Post</h1>
                  <AddIcon sx={pageSize ? { fontSize: 30, color: brown[800] } : { fontSize: 15, color: brown[800] }} />
                </div>
                : !joined ?
                  <div onClick={handleJoinBtn} className='bg-darkblue items-center rounded-2xl flex flex-row px-3 gap-2 cursor-pointer'>
                    <h1 className={pageSize ? 'font-poppinsMed text-xl text-white py-2' : 'font-poppinsMed text-md text-white py-2'}>Join Club</h1>
                    <AddIcon sx={pageSize ? { fontSize: 30, color: grey[50] } : { fontSize: 15, color: grey[50] }} />
                  </div>
                  :
                  <>
                    <div onClick={handleCreatePost} className={createPost ? 'bg-brown items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer' : 'bg-ivory items-center rounded-2xl flex flex-row px-3.5 gap-2 cursor-pointer'}>
                      <h1 className={pageSize ? 'font-poppinsMed text-xl text-darkbrown py-2' : 'font-poppinsMed text-md text-darkbrown py-2'}>Create Post</h1>
                      <AddIcon sx={pageSize ? { fontSize: 30, color: brown[800] } : { fontSize: 20, color: brown[800] }} />
                    </div>
                    <div className='bg-darkblue items-center rounded-2xl flex flex-row px-3 gap-2 cursor-pointer'>
                      <h1 className={pageSize ? 'font-poppinsMed text-xl text-white py-2' : 'font-poppinsMed text-md text-white py-2'}>Joined</h1>
                      <CheckIcon sx={{ fontSize: 25, color: grey[50] }} />
                    </div>
                  </>
              }
            </div>
          </div>

          <div className={pageSize ? 'py-1.5' : 'hidden'}>
            <div className='bg-ivory inline-block rounded-xl'>
              <p className='text-lg font-mainFont text-darkbrown px-4'>{displayedClub?.isPublic ? 'Public' : 'Private'}</p>
            </div>
          </div>

          <div className={pageSize ? 'hidden' : 'bg-white/80 border-8 border-ivory rounded-xl mt-4'}>
            <img
              src={displayedClub?.image}
              alt='profile image'
              className='object-fit w-full shadow-lg rounded-md'
            />

          </div>

          {/* DESKTOP MEMBERS, DESCRIPTIONS, POSTS ETC */}
          <div className={pageSize ? 'grid grid-cols-7 pt-3 gap-5 pb-5' : 'hidden'}>
            {!seeMembers ? <div className='col-span-5'>
              {((createPost && joined) || (createPost && isLeader)) && (
                <CreatePostComponent setPosts={setPosts} />
              )}
              <div className='bg-mutedblue px-5 pb-5 pt-2 rounded-xl'>
                {!selectedPostId && <div className='flex justify-end items-center'>
                  <Dropdown theme={customDropdown} color="lightblue" className='!bg-paleblue' label="Sort Posts" dismissOnClick={false}>
                    <Dropdown.Item onClick={() => handleSortingPost("Popular")}>Popular</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Newest")}>Newest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Oldest")}>Oldest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Recently Updated")}>Recently Updated</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Least Recently Updated")}>Least Recently Updated</Dropdown.Item>
                  </Dropdown>
                </div>}

                {(editClub && isLeader) && (
                  <EditClubSettingsComponent updateSuccess={handleEditSuccess} />

                )}


                <div className='opacity-90 py-3'>
                  {selectedPostId ?
                    ((isLeader || joined) ? (
                      <div>
                        <Button onClick={() => setSelectedPostId(null)}>Back</Button>
                        <PostRepliesComponent />
                      </div>
                    ) : null)
                    : (
                      posts.length > 0 ? (
                        posts.map((post, idx) => (
                          <div key={idx} className='col-span-1 py-2 cursor-pointer' onClick={() => handleClickPost(post.id)}>
                                <PostsComponent
                                  id={post.id}
                                  userId={post.userId}
                                  username={usersMap.get(post.userId)?.username || "Unknown User"}
                                  clubId={post.clubId}
                                  clubName={post.clubName || "Default Club Name"}
                                  title={post.title}
                                  category={post.category}
                                  tags={post.tags ? post.tags.split(',') : null}
                                  description={post.description}
                                  image={usersMap.get(post.userId)?.profilePic || "/noprofile.jpg"}
                                  dateCreated={post.dateCreated}
                                  dateUpdated={post.dateUpdated}
                                  isDeleted={post.isDeleted}
                                  displayClubName={false}
                                />
                          </div>
                        ))
                      ) : (
                        <h1 className="text-center py-10 font-poppinsMed text-2xl text-white">There are currently no posts &#41;:</h1>
                      )
                    )}
                </div>



              </div>
            </div>
              :
              <div className='col-span-5 overflow-hidden'>
                <div className='bg-white px-10 py-2 mb-5 rounded-xl members border-ivory focus-within:rounded-xl overflow-y-auto'>
                  <h1 className='font-mainFont text-xl text-darkbrown py-1.5 flex gap-2 items-center'>All Members <AddIcon /></h1>
                  <div className='grid grid-cols-5 px-8 justify-center py-4'>
                    <div className="col-span-1 flex flex-col justify-center items-center">
                      <div onClick={()=>{handleMemberClick(leader)}} className='relative cursor-pointer'>
                        <img src={leader?.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                        <Image src="/crown.gif"
                          width={200}
                          height={200}
                          alt="Club Leader"
                          className='absolute top-[-35px] right-[-15px] rotate-[25deg] w-[70px] h-[80px]' />
                      </div>
                      <h1 className="font-poppinsMed text-lg text-darkbrown pt-2 pb-0 mb-0 leading-none">{leader?.username}</h1>
                      <p className="font-mainFont text-darkbrown text-sm">{`${leader?.firstName} ${leader?.lastName}`}</p>
                    </div>
                    {members.map((member) => (
                      <div key={member.id} onClick={()=>{handleMemberClick(member)}} className="cursor-pointer col-span-1 flex flex-col justify-center items-center py-2">
                        <img src={member.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                        <h1 className="font-poppinsMed text-lg text-darkbrown pt-2 pb-0 mb-0 leading-none">{member.username}</h1>
                        <p className="font-mainFont text-darkbrown text-sm">{`${member.firstName} ${member.lastName}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>}
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
                {isLeader ? <button onClick={handleEditClub} className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl mt-5 py-1 font-mainFont text-darkbrown text-lg'>Edit Club Settings</button> : null}
                {seeMembers ? <button onClick={handleSeeMembers} className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl mt-2.5 py-1 font-mainFont text-darkbrown text-lg'> Posts </button>
                  :
                  <button onClick={handleSeeMembers} className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl mt-2.5 py-1 font-mainFont text-darkbrown text-lg'> All Members </button>}

                {isLeader ? (
                  <button className='text-center flex w-full justify-center border-2 border-darkblue bg-darkblue rounded-xl mt-2.5 py-1 font-mainFont text-white text-lg' onClick={() => setOpenModal(true)}>Delete Club</button>
                ) : joined ? (
                  <button className='text-center flex w-full justify-center border-2 border-darkblue bg-darkblue rounded-xl mt-2.5 py-1 font-mainFont text-white text-lg' onClick={() => setOpenModal(true)}>Leave Club</button>
                ) : null}
              </div>
            </div>
          </div>

          <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  {isLeader ?
                    <div>
                      Are you sure you want to delete <br /> {displayedClub?.clubName}?
                    </div>
                    : <div>
                      Are you sure you want to leave <br /> {displayedClub?.clubName}?
                    </div>}
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleLeave}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* MOBILE TABS FOR POSTS AND CLUB SETTINGS */}
          <div className={pageSize ? 'hidden' : 'items-center mt-2'}>
            <Tabs onClick={handleSeeMembers} theme={customTabs} aria-label='Tabs with underline' style='underline'>

              {/* tabs item for posts */}
              <Tabs.Item className='tabsFont' title='Posts'>
                <div className=''>
                  {((createPost && joined) || (createPost && isLeader)) && (
                    <CreatePostComponent setPosts={setPosts} />
                  )}

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
                      {posts.map((post, idx) => {

                        return (

                          <div key={idx} className='col-span-1 py-2'>
                            <PostsComponent
                              id={post.id}
                              userId={post.userId}
                              username={usersMap.get(post.userId)?.username || "Unknown User"}
                              clubId={post.clubId}
                              clubName={post.clubName || "Default Club Name"}
                              title={post.title}
                              category={post.category}
                              tags={post.tags ? post.tags.split(',') : null}
                              description={post.description}
                              image={usersMap.get(post.userId)?.profilePic || "/noprofile.jpg"}
                              dateCreated={post.dateCreated}
                              dateUpdated={post.dateUpdated}
                              isDeleted={post.isDeleted}
                              displayClubName={false}
                            />
                          </div>
                        )
                      })
                      }
                    </div>
                  </div>

                </div>

              </Tabs.Item>


              {/* tabs item for club settings */}
              <Tabs.Item className='tabs ' style={{ fontFamily: 'mainFont' }} title={isLeader ? 'Settings' : 'Club Info'}>
                <div className='bg-ivory border-8 border-ivory rounded-lg'>
                  <div className=''>
                    <div>
                      {(editClub && isLeader) ?
                        <EditClubSettingsComponent updateSuccess={handleEditSuccess} /> : null}
                      {isLeader ?
                        <div className='py-1'>
                          <button onClick={handleEditClub} className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl py-1 font-mainFont text-darkbrown text-lg'>Edit Club Settings</button>
                        </div> : null}

                      {isLeader ?
                        <div className='py-1'>
                          <button className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl py-1 font-mainFont text-darkbrown text-lg'>Invite Members</button>
                        </div> : null}

                      {isLeader ? (
                        <div className='py-1'>
                          <button className='text-center flex w-full justify-center border-2 border-darkblue bg-darkblue rounded-xl  py-1 font-mainFont text-white text-lg' onClick={() => setOpenModal(true)}>Delete Club</button>
                        </div>
                      ) : joined ? (
                        <div className='py-1'>
                          <button className='text-center flex w-full justify-center border-2 border-darkblue bg-darkblue rounded-xl  py-1 font-mainFont text-white text-lg' onClick={() => setOpenModal(true)}>Leave Club</button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <p className='text-darkbrown text-lg font-bold font-poppinsMed p-2'> Description: </p>

                  <div className='bg-white/80  rounded-lg'>
                    <p className='p-2.5 font-poppinsMed  text-darkbrown text-lg'>{displayedClub?.description}</p>
                  </div>

                  <p className='text-darkbrown text-lg font-bold font-poppinsMed p-2'> Members: </p>
                  {!membersVisible && (
                    <div className='grid grid-cols-3 px-8 justify-center p-8 bg-white/80 rounded-lg'>
                      <div className="col-span-1 flex flex-col justify-center items-center">
                        <div  onClick={()=>{handleMemberClick(leader)}} className='relative cursor-pointer'>
                          <img src={leader?.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                          <Image src="/crown.gif"
                            width={200}
                            height={200}
                            alt="Club Leader"
                            className='absolute top-[-35px] right-[-15px] rotate-[25deg] w-[70px] h-[80px]' />
                        </div>
                        <h1 className="font-poppinsMed text-lg text-darkbrown pt-2 pb-0 mb-0 leading-none">{leader?.username}</h1>
                        <p className="font-mainFont text-darkbrown text-xs">{`${leader?.firstName} ${leader?.lastName}`}</p>
                      </div>
                      {members.map((member) => (
                        <div key={member.id} onClick={()=>{handleMemberClick(member)}} className="cursor-pointer col-span-1 flex flex-col justify-center items-center py-2">
                          <img src={member.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                          <h1 className="font-poppinsMed text-lg text-center text-darkbrown pt-2 pb-0 mb-0 leading-none">{member.username}</h1>
                          <p className="font-mainFont text-darkbrown text-xs text-center">{`${member.firstName} ${member.lastName}`}</p>
                        </div>
                      )
                      )}
                    </div>
                  )}
                </div>

              </Tabs.Item>

            </Tabs>
          </div>


        </div>
      </div >

    </>

  )
}

export default ClubPage
