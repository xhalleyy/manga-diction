'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../../components/NavbarComponent'
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { grey, brown } from '@mui/material/colors';
import { Dropdown, Modal, Button, CustomFlowbiteTheme, Tabs, Avatar, Spinner } from 'flowbite-react';
import { AddUserToClub, GetLikesByPost, RemoveMember, deleteClub, getClubMembers, getPostsByCategory, getPostsByClubId, getPostsByTags, getPostsbyComments, getPostsbyMostLiked, getStatusInClub, getUserInfo, getUsersByUsername, specifiedClub } from '@/utils/DataServices';
import { IClubs, IPosts, IStatus, IUserData } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';
import Image from 'next/image'
import { Chocolate, Planet } from 'react-kawaii';
import { Alert } from '@mui/material';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import SearchIcon from "@mui/icons-material/Search";
import { File } from 'react-kawaii'
import { checkToken } from '@/utils/token';
import ScrollToTop from "react-scroll-to-top";
import { Browser } from 'react-kawaii'
import CreatePostComponent from '@/app/components/CreatePostComponent';
import EditClubSettingsComponent from '@/app/components/EditClubSettingsComponent';
import PostRepliesComponent from '@/app/components/PostRepliesComponent';
import PostsComponent from '@/app/components/PostsComponent';

const ClubPage = ({ params }: { params: { clubId: number } }) => {
  const clubId = params.clubId;

  const [club, setClub] = useState<IClubs>({} as IClubs);
  const { selectedPostId, setSelectedPostId, setSelectedUser, status, message, setPrivateModal, privateModal } = useClubContext();
  const [joined, setJoined] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPosts[]>([]);
  const [initialPosts, setInitialPosts] = useState<IPosts[]>([])
  const [seeMembers, setSeeMembers] = useState<boolean>(false);
  const [members, setMembers] = useState<IUserData[]>([]);
  const [leader, setLeader] = useState<IUserData | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [usersMap, setUsersMap] = useState<Map<number, IUserData>>(new Map());


  // New state to track whether members section is visible
  const [membersVisible, setMembersVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<boolean>(true)
  const [editClub, setEditClub] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [adultModal, setAdultModal] = useState<boolean>(false);
  const [nonMemberModal, setNonMemberModal] = useState<boolean>(false);
  // const [status, setStatus] = useState<IStatus>({} as IStatus);

  const [addMember, setAddMember] = useState(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<IUserData[]>();
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(true);

  const router = useRouter();

  // CLUB MEMBERS, JOINING, CHECKING IF JOINED
  const fetchClubMembers = async () => {
    try {
      const [leaderInfo, memberIds] = await Promise.all([
        getUserInfo(club.leaderId),
        getClubMembers(clubId),
      ]);

      setLeader(leaderInfo);

      const promises = memberIds.map(async (userId: number) => {
        try {
          const userInfo = await getUserInfo(userId);
          return userInfo;
        } catch (error) {
          console.error('Error fetching user info for', userId, ':', error);
          throw error;
        }
      });
      const usersInfo = await Promise.all(promises);
      // Filter out undefined values from usersInfo
      const filteredUsersInfo = usersInfo.filter((userInfo) => userInfo !== undefined);
      setMembers(filteredUsersInfo);
    } catch (error) {
      console.error('Error fetching club data:', error);
    }
  };

  const handleJoinBtn = async () => {
    try {
      let userId = Number(localStorage.getItem("UserId"));
      const joinUser = await AddUserToClub(userId, club.id, false);
      setJoined(true);
      setNonMemberModal(false)
      fetchClubMembers()

    } catch (error) {
      console.log(error);
    }
  };

  const handleSeeMembers = () => {
    setSeeMembers(!seeMembers);
  }

  // EDITING POSTS AND EDITING CLUBS
  const handleCreatePost = () => {
    setCreatePost(!createPost);
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
      const removeMember = await RemoveMember(userId, club.id);
      setOpenModal(false);
      setJoined(false);
    } else {
      if (userId === club.leaderId) {
        try {
          await deleteClub(club);
          router.push('/Dashboard');
        } catch (error) {
          console.error('Error deleting club, ', error);
        }
      } else {
        console.log('You do not have authorization to delete this club');
      }
    }
  }

  // GOING TO CERTAIN POSTS
  const handlePostPage = (postId: number) => {
    setSelectedPostId(postId)
  }

  // SEARCH, ADDING MEMBER TO CLUB, MEMBER CLICKS TO PROFILE
  const handleMemberClick = (user: IUserData | null) => {
    router.push(`/Profile/${user!.id}`)
  }

  const searchUser = async () => {
    try {
      const data = await getUsersByUsername(search);
      const filteredUsers = data.filter(user => user.id !== club.leaderId && !members.some(member => member.id === user.id));
      setSearchedUsers(filteredUsers);
      // setSearch(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }

  const handleUserClick = (user: IUserData) => {
    router.push(`/Profile/${user!.id}`)
  }

  const handleLeaderAdds = async (userId: number) => {
    try {
      const addUser = await AddUserToClub(userId, club.id, true)
      fetchClubMembers()
      setAddSuccess(true);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // set Selected Post null so that all the posts show instead of the full posts
    // setSelectedPostId(null);
    // responsiveness
    if (typeof window !== 'undefined') {
      setPageSize(window.innerWidth > 769);
      const handleResize = () => {
        setPageSize(window.innerWidth > 769)
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
      fetchClubMembers();
    }
  }, [seeMembers])

  useEffect(() => {
    if (addMember) {
      setSearch('');
    }
  }, [addMember]);
  
  useEffect(() => {

    let userId = Number(localStorage.getItem("UserId"));
    const fetchClub = async () => {
      const clubData = await specifiedClub(clubId);
      setClub(clubData);
      if (clubData.leaderId === userId) {
        setIsLeader(true);
      }
      
    }
    
    const fetchedData = async () => {
      setIsLoadingPost(true)
      try {
        if (clubId !== undefined) {
          // POSTS
          const getPosts = await getPostsByClubId(clubId);
          setPosts(getPosts);
          setInitialPosts(getPosts)

          // MEMBER IDS OF EACH POSTS TO GET USER INFO
          const memberIds = getPosts.map((post) => post.userId);
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
      } finally {
        setIsLoadingPost(false)
      }
    };

    fetchedData();
    fetchClub();

    // checks if user is joined 
    const checkJoined = async (clubId: number | undefined) => {
      try {
        const memberIds = await getClubMembers(clubId);
        if (memberIds.includes(Number(localStorage.getItem("UserId")) ?? 0)) {
          setJoined(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    if ((club.isPublic === false && isLeader) || (club.isPublic === false && joined)) {
      setPrivateModal(false)
    }

    // privateModal(club.id);
    checkJoined(club.id)
  }, [clubId])


  useEffect(() => {
    const userId = Number(localStorage.getItem("UserId"));
    const checkAge = async (userId: number) => {
      try {
        const user = await getUserInfo(userId)
        if (user.age > 18 && club.isMature === true) {
          setAdultModal(false);
        } else if (user.age < 18 && (club.isMature === true)) {
          setAdultModal(true);
        } else {
          setAdultModal(false);
        }
      } catch (error) {
        console.error('Error: ', error)
      }
    }
    checkAge(userId);
  }, [joined, club.isMature]);

  const goBackToClubs = () => {
    router.push('BrowseClubs')
  }

  const requestToJoin = async () => {
    let userId = Number(localStorage.getItem("UserId"))
    try {
      const addUser = await AddUserToClub(userId, club.id, false)
      console.log(addUser)
      console.log("You requested to join this club")
      router.push('BrowseClubs')
    } catch (error) {
      console.log("User already requested to join!")
    }
  }

  const handleSortingPost = async (option: string) => {
    let newOrder = [...initialPosts];

    try {
      if (option === "Mostlikes") {
        const getPostsbyLikes = await getPostsbyMostLiked(club!.id);
        newOrder = getPostsbyLikes.map(post => ({
          id: post.postId,
          userId: post.user.id,
          username: post.user.username,
          clubId: post.clubId,
          clubName: post.clubName,
          title: post.title,
          category: post.category,
          tags: post.tags,
          description: post.description,
          image: post.image,
          dateCreated: post.dateCreated,
          dateUpdated: post.dateUpdated,
          isDeleted: post.isDeleted
        }));
      } else if (option === "Newest") {
        newOrder.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      } else if (option === "Oldest") {
        newOrder.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
      } else if (option === "Recently Updated") {
        newOrder.sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime());
      } else if (option === "Least Recently Updated") {
        newOrder.sort((a, b) => new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime());
      } else if (option === "Mostcomments") {
        const getPostsbyMostComments = await getPostsbyComments(club!.id);
        newOrder = getPostsbyMostComments.map(post => ({
          id: post.postId,
          userId: post.user.id,
          username: post.user.username,
          clubId: post.clubId,
          clubName: post.clubName,
          title: post.title,
          category: post.category,
          tags: post.tags,
          description: post.description,
          image: post.image,
          dateCreated: post.dateCreated,
          dateUpdated: post.dateUpdated,
          isDeleted: post.isDeleted
        }));
      }

      // Fetch user info for the sorted posts
      const memberIds = Array.from(new Set(newOrder.map(post => post.userId))); // Ensure unique user IDs
      const membersInfo = await Promise.all(
        memberIds.map(async (memberId) => {
          const member = await getUserInfo(memberId);
          return [memberId, member] as const;
        })
      );

      const usersMap = new Map<number, IUserData>(membersInfo);
      setUsersMap(usersMap);


      // Update the state with the sorted posts
      setPosts(newOrder);
    } catch (error) {
      console.log(error);
    }
  };


  const handleClickPost = (postId: number) => {
    // event.stopPropagation(); // Prevent the click event from bubbling up to the parent div

    if (!isLeader && !joined) {
      setNonMemberModal(!nonMemberModal)
    } else {
      handlePostPage(postId);
    }
  };

  const handleSortCategory = async (event: React.MouseEvent<HTMLSpanElement>, clubId: number, category: string) => {

    event.stopPropagation();
    try {
      const postsByCategory = await getPostsByCategory(clubId, category)
      setPosts(postsByCategory)
      console.log(postsByCategory)
    } catch (error) {
      console.log(error)
    }

  }

  const handleSortTag = async (event: React.MouseEvent<HTMLSpanElement>, clubId: number, tag: string) => {
    event.stopPropagation();
    try {
      const postsByTag = await getPostsByTags(clubId, tag)
      setPosts(postsByTag)
      console.log(postsByTag)
    } catch (error) {
      console.log(error)
    }
  }

  if (!checkToken()) {
    notFound();
  }


  const customDropdown = {
    "floating": {
      "base": "z-10 w-fit divide-y divide-gray-100 rounded shadow py-0 focus:outline-none",
      "content": " text-sm text-gray-700 dark:text-gray-200",
      "divider": "my-1 h-px bg-gray-100 dark:bg-gray-600",
      "header": "block px-3 text-sm text-gray-700 dark:text-gray-200",
      "hidden": "invisible opacity-0",
      "item": {
        "container": "",
        "base": "font-poppinsMed text-darkbrown flex w-full cursor-pointer bg-offwhite items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
        "icon": "mr-2 h-4 w-4"
      },
      "style": {
        "lightblue": "bg-teal-100 text-black text-lg font-poppinsMed",
        "dark": "bg-gray-900 text-white dark:bg-gray-700",
        "light": "border border-gray-200 bg-white text-gray-900",
        "auto": "bg-teal-100 border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
      },
    },
  }

  const customButton: CustomFlowbiteTheme["button"] = {
    "base": "group font-mainFont relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none",
    "fullSized": "w-full",
    "disabled": "cursor-not-allowed opacity-50",
    "isProcessing": "cursor-wait",
    "spinnerSlot": "absolute top-0 flex h-full items-center",
    "gradientDuoTone": {
      "cyanToBlue": "bg-gradient-to-r from-cyan-500 to-cyan-500 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-gradient-to-bl dark:focus:ring-cyan-800",
      "greenToBlue": "bg-gradient-to-br from-green-400 to-cyan-600 text-white focus:ring-4 focus:ring-green-200 enabled:hover:bg-gradient-to-bl dark:focus:ring-green-800",
      "pinkToOrange": "bg-gradient-to-br from-pink-500 to-orange-400 text-white focus:ring-4 focus:ring-pink-200 enabled:hover:bg-gradient-to-bl dark:focus:ring-pink-800",
      "purpleToBlue": "bg-gradient-to-br from-darkerblue to-sky-300 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-gradient-to-bl dark:focus:ring-cyan-800",
      "purpleToPink": "bg-gradient-to-r from-purple-500 to-pink-500 text-white focus:ring-4 focus:ring-purple-200 enabled:hover:bg-gradient-to-l dark:focus:ring-purple-800",
      "redToYellow": "bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 text-gray-900 focus:ring-4 focus:ring-red-100 enabled:hover:bg-gradient-to-bl dark:focus:ring-red-400",
      "tealToLime": "bg-gradient-to-r from-teal-200 to-lime-200 text-gray-900 focus:ring-4 focus:ring-lime-200 enabled:hover:bg-gradient-to-l enabled:hover:from-teal-200 enabled:hover:to-lime-200 enabled:hover:text-gray-900 dark:focus:ring-teal-700"
    },
    "inner": {
      "base": "flex items-stretch transition-all duration-200",
      "position": {
        "none": "",
        "start": "rounded-r-none",
        "middle": "rounded-none",
        "end": "rounded-l-none"
      },
      "outline": "border border-transparent",
      "isProcessingPadding": {
        "xs": "pl-8",
        "sm": "pl-10",
        "md": "pl-12",
        "lg": "pl-16",
        "xl": "pl-20"
      }
    },
    "label": "ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-200 text-xs font-semibold text-cyan-800",
    "outline": {
      "color": {
        "gray": "border border-gray-900 dark:border-white",
        "default": "border-0",
        "light": ""
      },
      "off": "",
      "on": "flex w-full justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white",
      "pill": {
        "off": "rounded-md",
        "on": "rounded-full"
      }
    },
    "pill": {
      "off": "rounded-xl",
      "on": "rounded-full"
    },
    "size": {
      "xs": "px-2 py-1 text-xs",
      "sm": "px-3 py-1.5 text-sm",
      "md": "px-6 py-1.5 text-sm",
      "lg": "px-5 py-2.5 text-base",
      "xl": "px-6 py-3 text-base"
    }
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

  const customAvatar: CustomFlowbiteTheme['avatar'] = {
    "root": {
      "rounded": "rounded-full shadow-lg",
      "size": {
        "md": "h-12 w-12",
        "lg": "h-16 w-16"
      }
    }
  }


  return (
    <>
      <div className='min-h-screen bg-offwhite'>

        <NavbarComponent />
        <ScrollToTop smooth className='!bg-paleblue !flex !justify-center !items-center !rounded-full !m-1' color='darkblue' width='32' />

        {/* modal for mature club? if(isMature == false) closemodal else showmodal, if(user.age < 18) description and redirect */}
        {adultModal && (
          <Modal show={adultModal} size="xl" onClose={() => setAdultModal(false)} popup>
            <Modal.Body className='bg-offwhite rounded-lg'>
              <div className="text-center pt-10 pb-6 bg-offwhite">
                <div className='flex justify-center py-5'>
                  <Browser size={130} mood="ko" color="#E0E4E8" />
                </div>
                <h2 className='text-xl pb-2'>You are not old enough to view this club</h2>
                <div className='flex justify-center pt-10'>
                  <button className='bg-darkerblue text-white px-4 py-2 rounded-xl' onClick={goBackToClubs}>
                    Browse other clubs
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {nonMemberModal && (
          <Modal show={nonMemberModal} size="xl" onClose={() => setNonMemberModal(false)} popup>
            <Modal.Header/>
            <Modal.Body className='bg-offwhite rounded-lg'>
              <div className="text-center pt-10 pb-6 bg-offwhite">
                <div className='flex justify-center py-5'>
                  <Browser size={130} mood="ko" color="#E0E4E8" />
                </div>
                <h2 className='text-xl pb-2'>{"You cannot view post unless you're a member"}</h2>
                <div className="flex justify-center gap-6">
                  <Button color="gray" onClick={goBackToClubs}>
                    {"Browse other Clubs"}
                  </Button>
                  {status.status !== 0 && status.status !== 2 && (
                    <Button className='bg-mutedgreen' onClick={handleJoinBtn}>
                      Join Club!
                    </Button>
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {!privateModal ? null : (
          <Modal show={privateModal} size="xl" onClose={() => setPrivateModal(false)} popup>
            {/* <Modal.Header /> */}
            <Modal.Body className='bg-offwhite rounded-xl flex justify-center'>
              <div className="text-center pt-10 pb-6 bg-offwhite">
                <div className='flex justify-center py-5'>
                  <Browser size={130} mood="ko" color="#E0E4E8" />
                </div>
                <h3 className="mb-5 col-span-2 text-lg font-normal text-black dark:text-gray-400">
                  {message}
                </h3>

                <div className="flex justify-center gap-6">
                  <Button color="gray" onClick={goBackToClubs}>
                    {"Browse other Clubs"}
                  </Button>
                  {status.status !== 0 && status.status !== 2 && (
                    <Button className='bg-mutedgreen' onClick={requestToJoin}>
                      Request to Join
                    </Button>
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}

        <div className={pageSize ? 'px-16' : 'px-5'}>

          {success && <div className={pageSize ? 'grid grid-cols-4' : 'pt-4'}>
            <Alert className='rounded-xl bg-paleblue' icon={<Planet size={30} mood="happy" color="#FCCB7E" />} severity="success">
              Club successfully updated!
            </Alert>
          </div>}


          <div className={pageSize ? 'hidden' : 'pt-4'}>
            <div className=''>
              <p className='text-xl font-mainFont text-darkbrown'>{club.isPublic ? 'Public' : 'Private'}</p>
            </div>
          </div>

          <div className={pageSize ? 'flex pt-4' : 'contents'}>
            <div className={pageSize ? 'flex-1 items-end pt-3' : 'py-2'}>
              <h1 className='font-poppinsMed text-3xl text-darkbrown'>{club.clubName}</h1>
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
              <p className='text-lg font-mainFont text-darkbrown px-4'>{club.isPublic ? 'Public' : 'Private'}</p>
            </div>
          </div>

          <div className={pageSize ? 'hidden' : 'bg-white/80 border-8 border-ivory rounded-xl mt-4'}>
            <img
              src={club.image || '/dummyImg.jpg'}
              alt='profile image'
              className='object-fit w-full shadow-lg rounded-md'
            />

          </div>

          {/* DESKTOP MEMBERS, DESCRIPTIONS, POSTS ETC */}
          <div className={pageSize ? 'grid grid-cols-7 pt-3 gap-5 pb-5' : 'hidden'}>
            {!seeMembers ? <div className='col-span-5'>
              {((createPost && joined) || (createPost && isLeader)) && (
                <CreatePostComponent setPosts={setPosts} setCreatePost={setCreatePost} club={clubId} />
              )}
              <div className='bg-mutedblue px-5 pb-5 pt-2 rounded-xl'>
                {!selectedPostId && <div className='flex justify-end items-center'>
                  <Dropdown theme={customDropdown} color="lightblue" className='!bg-offwhite' label="Sort Posts" dismissOnClick={false}>
                    <Dropdown.Item onClick={() => handleSortingPost("Newest")}>Newest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Oldest")}>Oldest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Mostlikes")}>Most Likes</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Mostcomments")}>Most Comments</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Recently Updated")}>Recently Updated</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortingPost("Least Recently Updated")}>Least Recently Updated</Dropdown.Item>
                  </Dropdown>
                </div>}

                {(editClub && isLeader) && (
                  <EditClubSettingsComponent updateSuccess={handleEditSuccess} />

                )}


                <div className='opacity-90 pt-1 pb-3'>
                  {selectedPostId ? (
                    (isLeader || joined) ? (
                      <div>
                        <button className='bg-offwhite px-3 py-1.5 mt-2 font-poppinsMed text-darkbrown rounded-md hover:bg-paleblue hover:cursor-pointer' onClick={() => setSelectedPostId(null)}>Back</button>
                        <PostRepliesComponent />
                      </div>
                    ) : null
                  ) : isLoadingPost ? (
                    <div className='text-center flex justify-center items-center py-10 md:py-36'>
                      <Spinner aria-label="Large spinner example" size="lg" />
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((post, idx) => (
                      <div key={idx} className='col-span-1 py-2 cursor-pointer' onClick={() => handleClickPost(post.id)}>
                        <PostsComponent
                          id={post.id}
                          userId={post.userId}
                          username={usersMap.get(post.userId)?.username || ""}
                          clubId={post.clubId}
                          clubName={post.clubName || ""}
                          title={post.title}
                          category={post.category}
                          tags={post.tags ? post.tags.split(',') : null}
                          description={post.description}
                          image={usersMap.get(post.userId)?.profilePic || "/noprofile.jpg"}
                          dateCreated={post.dateCreated}
                          dateUpdated={post.dateUpdated}
                          isDeleted={post.isDeleted}
                          displayClubName={false}
                          shouldSort={true}
                          onSortCategory={handleSortCategory}
                          onSortTag={handleSortTag}
                          fetchedPost={() => { }}
                          shouldEdit={false}
                        />
                      </div>
                    ))
                  ) : (
                    <h1 className="text-center py-10 font-poppinsMed text-2xl text-white">There are currently no posts &#41;:</h1>
                  )}
                </div>




              </div>
            </div>
              :
              <div className='col-span-5 overflow-hidden'>
                <div className='bg-white px-10 py-2 mb-5 rounded-xl members border-ivory focus-within:rounded-xl overflow-y-auto customScroll'>
                  <h1 className='font-mainFont text-xl text-darkbrown py-1.5 flex gap-2 items-center'>All Members {isLeader && <AddIcon className='cursor-pointer' onClick={() => setAddMember(!addMember)} />}</h1>
                  {addMember ?
                    <>
                      <div className='grid grid-cols-6 items-center rounded-xl'>
                        <div className='col-span-3 xl:col-span-4 2xl:col-span-5'>
                          <p className=' text-[18px] font-poppinsMed text-darkbrown'>{`Search Results for '${search}'`}</p>
                        </div>
                        <div className='col-span-3 xl:col-span-2 2xl:col-span-1 w-[285px] darkBeige px-2 py-0.5 rounded-2xl flex items-center 2xl:ms-[-100px] justify-end '>
                          <input
                            className='rounded-xl h-7 ps-3'
                            onChange={(e) => setSearch(e.target.value)}
                          />
                          <SearchIcon className='text-4xl text-white cursor-pointer flex float-right' onClick={searchUser} />
                        </div>
                      </div>
                      <div className='grid grid-cols-5'>
                        {searchedUsers?.length === 0 ? <div className="text-center mt-5 col-span-5">
                          <p className="text-center text-darkbrown pt-20 text-xl font-poppinsMed">No users found. Are they already in this club?</p>
                        </div> : searchedUsers?.map(user => (
                          <div key={user.id}>
                            {pageSize ? (
                              <div className="ms-auto mt-5 flex flex-col items-center justify-center place-content-center cursor-pointer">
                                <Avatar onClick={() => { handleUserClick(user) }}
                                  img={user.profilePic || ''}
                                  rounded
                                  theme={customAvatar}
                                  size="lg"
                                />
                                <div className='text-center mt-2'>
                                  <p className='text-lg font font-poppinsMed'>{user.username}</p>
                                  <p className='text-sm -mt-1'>{user.firstName} {user.lastName}</p>
                                  <button onClick={() => handleLeaderAdds(user.id)} className='bg-darkbrown hover:bg-green-300 text-white hover:text-black font-mainFont px-2 my-1.5 rounded-xl text-[15px] flex gap-1 items-center'>
                                    <AddIcon sx={pageSize ? { fontSize: 20, color: grey[50] } : { fontSize: 15, color: grey[50] }} />
                                    {addSuccess ? 'Added' : 'Member'}</button>
                                </div>
                              </div>
                            ) : (
                              <div className='mt-7 mx-auto'>
                                <Avatar
                                  img={user.profilePic || ''}
                                  rounded
                                  theme={customAvatar}
                                  size="lg"
                                />
                                <div className='text-center mt-2'>
                                  <p className='text-lg font font-poppinsMed'>{user.username}</p>
                                  <p className='text-sm -mt-1'>{user.firstName} {user.lastName}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                    : <div className='grid grid-cols-5 px-8 justify-center py-4 mt-2'>
                      <div className="col-span-1 flex flex-col justify-center items-center">
                        <div className='relative cursor-pointer'>
                          <img src={leader?.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                          <Image onClick={() => { handleMemberClick(leader) }} src="/crown.gif"
                            width={200}
                            height={200}
                            alt="Club Leader"
                            unoptimized
                            className='absolute top-[-35px] right-[-15px] rotate-[25deg] w-[70px] h-[80px]' />
                        </div>
                        <h1 className="font-poppinsMed text-lg text-darkbrown pt-2 pb-0 mb-0 leading-none">{leader?.username}</h1>
                        <p className="font-mainFont text-darkbrown text-sm">{`${leader?.firstName} ${leader?.lastName}`}</p>
                      </div>
                      {members.map((member) => (
                        <div key={member.id} onClick={() => { handleMemberClick(member) }} className="cursor-pointer col-span-1 flex flex-col justify-center items-center py-2">
                          <img src={member.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                          <h1 className="font-poppinsMed text-lg text-darkbrown pt-2 pb-0 mb-0 leading-none">{member.username}</h1>
                          <p className="font-mainFont text-darkbrown text-sm">{`${member.firstName} ${member.lastName}`}</p>
                        </div>
                      ))}
                    </div>}
                </div>
              </div>}
            <div className='col-span-2'>
              <h1 className='font-mainFont text-lg ps-3 text-darkbrown'>Description:</h1>
              <div className='bg-white/80 border-8 border-ivory rounded-xl'>
                <img
                  src={club.image || '/dummyImg.jpg'}
                  alt='profile image'
                  className='object-fit w-full shadow-lg'
                />
                <p className='p-2.5 font-poppinsMed text-darkbrown text-lg mt-1'>{club.description}</p>
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
            <Modal.Header className='bg-offwhite rounded-t-xl p-5' />
            <Modal.Body className='bg-offwhite rounded-b-xl'>
              <div className="text-center bg-offwhite ">
                <h3 className=" bg-offwhite text-lg font-normal text-gray-500 dark:text-gray-400">
                  {isLeader ?
                    <div className='grid grid-cols-3'>
                      <div className='col-span-1'>
                        <File size={100} mood="ko" color="#afdeee " />
                      </div>

                      <div className='font-mainFont col-span-2'>
                        Are you sure you want to delete <br /> {club.clubName}?
                      </div>
                    </div>
                    :
                    <div className='grid grid-cols-3'>
                      <div className='col-span-1'>
                        <File size={100} mood="ko" color="#afdeee " />
                      </div>

                      <div className='font-mainFont col-span-2'>
                        Are you sure you want to leave <br /> {club.clubName}?
                      </div>
                    </div>}

                </h3>
                <div className="flex justify-end gap-8 bg-offwhite">
                  <Button className='bg-mutedred enabled:hover:bg-red-800' onClick={handleLeave}>
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
                    <CreatePostComponent setPosts={setPosts} setCreatePost={setCreatePost} club={clubId} />
                  )}

                  <div className='bg-mutedblue px-5 pb-5 pt-2 rounded-xl'>
                    <div className='flex justify-end items-center'>
                      <Dropdown theme={customDropdown} color="lightblue" className='!bg-paleblue' label="Sort Posts" dismissOnClick={false}>
                        <Dropdown.Item onClick={() => handleSortingPost("Newest")}>Newest</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortingPost("Oldest")}>Oldest</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortingPost("Mostlikes")}>Most Likes</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortingPost("Mostcomments")}>Most Comments</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortingPost("Recently Updated")}>Recently Updated</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortingPost("Least Recently Updated")}>Least Recently Updated</Dropdown.Item>
                      </Dropdown>
                    </div>
                    <div className='opacity-90 py-3'>
                      {selectedPostId ?
                        ((isLeader || joined) ? (
                          <div>
                            <Button theme={customButton} gradientDuoTone="purpleToBlue" onClick={() => setSelectedPostId(null)}>Back</Button>
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
                                  shouldSort={true}
                                  onSortCategory={handleSortCategory}
                                  onSortTag={handleSortTag}
                                  fetchedPost={() => { }}
                                  shouldEdit={false}
                                // onClick = {() => handleClickPost(post.id)}
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
                          <button onClick={() => setAddMember(!addMember)} className='text-center flex w-full justify-center bg-white/80 border-2 border-ivory rounded-xl py-1 font-mainFont text-darkbrown text-lg'>{addMember ? 'View All Members' : 'Invite Members'}</button>
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
                    <p className='p-2.5 font-poppinsMed  text-darkbrown text-lg'>{club.description}</p>
                  </div>

                  <p className='text-darkbrown text-lg font-bold font-poppinsMed p-2'> {addMember ? 'Invite Members:' : 'Members:'}</p>

                  {addMember ?
                    <>
                      <div className='px-5 p-8 bg-white/80 rounded-lg'>

                        <div className='items-center rounded-xl ml-5'>
                          <div className='col-span-3 xl:col-span-2 2xl:col-span-1 w-[285px] darkBeige px-2 py-0.5 rounded-2xl flex items-center 2xl:ms-[-100px] justify-end my-2'>
                            <input
                              className='rounded-xl h-7 ps-3'
                              onChange={(e) => setSearch(e.target.value)}
                            />
                            <SearchIcon className='text-4xl text-white cursor-pointer flex float-right' onClick={searchUser} />
                          </div>

                          <div className=''>
                            <p className='ml-5 text-lg font-poppinsMed text-darkbrown'>{`Search Results for '${search}'`}</p>
                          </div>
                        </div>

                        <div className='grid grid-cols-2'>
                          {searchedUsers?.length === 0 ? <div className="text-center mt-5 col-span-5">
                            <p className="text-center text-darkbrown pt-5 text-xl font-poppinsMed">No users found. Are they already in this club?</p>
                          </div> : searchedUsers?.map(user => (
                            <div key={user.id}>
                              <div className="ms-auto mt-5 flex flex-col items-center justify-center place-content-center cursor-pointer">
                                <Avatar onClick={() => { handleUserClick(user) }}
                                  img={user.profilePic || ''}
                                  rounded
                                  theme={customAvatar}
                                  size="lg"
                                />
                                <div className='text-center mt-2'>
                                  <p className='text-lg font font-poppinsMed'>{user.username}</p>
                                  <p className='text-sm -mt-1'>{user.firstName} {user.lastName}</p>
                                  <button onClick={() => handleLeaderAdds(user.id)} className='bg-darkbrown hover:bg-green-300 text-white hover:text-black font-mainFont px-2 my-1.5 rounded-xl text-[15px] flex gap-1 items-center'>
                                    <AddIcon sx={pageSize ? { fontSize: 20, color: grey[50] } : { fontSize: 15, color: grey[50] }} />
                                    {addSuccess ? 'Added' : 'Member'}</button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                    :
                    (!membersVisible) && (
                      <div className='grid grid-cols-3 px-8 justify-center p-8 bg-white/80 rounded-lg'>
                        <div className="col-span-1 flex flex-col justify-center items-center">
                          <div onClick={() => { handleMemberClick(leader) }} className='relative cursor-pointer'>
                            <img src={leader?.profilePic || '/noprofile.jpg'} alt="Member" className="member-img" />
                            <Image src="/crown.gif"
                              width={200}
                              height={200}
                              alt="Club Leader"
                              unoptimized
                              className='absolute top-[-35px] right-[-15px] rotate-[25deg] w-[70px] h-[80px]' />
                          </div>
                          <h1 className="font-poppinsMed text-lg text-darkbrown pt-2 pb-0 mb-0 leading-none">{leader?.username}</h1>
                          <p className="font-mainFont text-darkbrown text-xs">{`${leader?.firstName} ${leader?.lastName}`}</p>
                        </div>
                        {members.map((member) => (
                          <div key={member.id} onClick={() => { handleMemberClick(member) }} className="cursor-pointer col-span-1 flex flex-col justify-center items-center py-2">
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
