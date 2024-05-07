'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image'
import CardComponent from '../components/CardComponent';
import { IClubs, IUserData } from '@/Interfaces/Interfaces';
import { GetLikesByPost, getClubsByLeader, getUserClubs, getUserInfo, publicClubsApi, specifiedClub } from '@/utils/DataServices';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { useClubContext } from '@/context/ClubContext';
import FriendsDesktopComponent from '../components/FriendsDesktopComponent';
import FriendsComponent from '../components/FriendsDesktopComponent';
import { CustomFlowbiteTheme, Tabs } from 'flowbite-react';
import CardComponent2 from '../components/CardComponent2';
import CardProfPgComponent from '../components/CardProfPgComponent';
;

const ProfilePage = (props: any) => {

    const info = useClubContext();
    const [clubs, setClubs] = useState<IClubs[]>([]);

    const [pageSize, setPageSize] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(0);

    const [showClubs, setShowClubs] = useState<boolean>(true);
    const [userData, setUserData] = useState<IUserData>();
    const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
    const [picture, setPicture] = useState<string>("");
    const router = useRouter();

    const customTabs: CustomFlowbiteTheme["tabs"] = {
        "base": "flex flex-col gap-2",
        "tablist": {
            "base": "text-center",
            "styles": {
                "default": "font-mainFont border-b border-gray-200 dark:border-gray-700",
                "underline": "font-mainFont  -mb-px border-b border-gray-200 dark:border-gray-700",
                "pills": "font-mainFont flex-wrap space-x-2 text-3xl font-bold text-black dark:text-gray-400",
                "fullWidth": "font-mainFont grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-lg font-bold shadow dark:divide-gray-700"
            },
            "tabitem": {
                "base": "font-mainFont rounded-t-lg p-4 text-lg font-bold first:ml-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-black disabled:dark:text-black",
                "styles": {
                    "default": {
                        "base": "rounded-t-lg",
                        "active": {
                            "on": "bg-gray-100 text-black",
                            "off": "text-black hover:bg-gray-50"
                        }
                    },
                    "underline": {
                        "base": "rounded-t-lg",
                        "active": {
                            "on": "active rounded-t-lg border-b-2 border-black text-black dark:border-cyan-500 dark:text-cyan-500",
                            "off": "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        }
                    },
                    "pills": {
                        "base": "",
                        "active": {
                            "on": "rounded-lg bg-cyan-600 text-white",
                            "off": "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        }
                    },
                    "fullWidth": {
                        "base": "w-full rounded-none first:ml-0",
                        "active": {
                            "on": "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
                            "off": "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        }
                    }
                },
                "icon": "mr-2 h-5 w-5"
            }
        },
        "tabitemcontainer": {
            "base": "",
            "styles": {
                "default": "",
                "underline": "",
                "pills": "",
                "fullWidth": ""
            }
        },
        "tabpanel": "py-3"
    }


    const clubox: string = 'grid grid-cols-3 gap-5'
    const noClubox: string = 'grid grid-cols-3 gap-5 hidden'
    const favbox: string = "px-1"
    const noFavbox: string = "px-1 hidden"
    const activeBtn: string = 'bg-mutedblue text-2xl py-1 px-9 rounded-xl font-mainFont font-light'
    const inactiveBtn: string = 'bg-paleblue text-2xl py-1 px-9 rounded-xl font-mainFont font-light'

    const clubDisplay = () => {
        setShowClubs(true);
    }
    const favDisplay = () => {
        setShowClubs(false);
    }

    const handleClubCardClick = async (club: IClubs) => {
        try {
            const clubDisplayedInfo = await specifiedClub(club.id);
            info.setDisplayedClub(clubDisplayedInfo);
        } catch (error) {
            alert("Error fetching club information");
            console.error(error);
        }
    };


    useEffect(() => {
        let userId = Number(localStorage.getItem("UserId"));
        const fetchedUser = async () => {
            const user = await getUserInfo(userId);
            info.setDisplayedUser(user);
            console.log("User data updated:", user);
        };
        fetchedUser();

        // handling resize
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);

            const handleResize = () => {
                setPageSize(window.innerWidth > 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    

    const fetchUserClubs = async (userId: number | undefined) => {
        try {
            const memberIds = await getUserClubs(userId);
            const promises = memberIds.map((clubId: number) => specifiedClub(clubId)); // Assuming specifiedClub returns club info
            const usersInfo = await Promise.all(promises);
            return usersInfo; // Return the fetched clubs
        } catch (error) {
            console.error('Error fetching club members:', error);
            return []; // Return an empty array in case of an error
        }
    };

    const fetchClubsbyLeader = async (leaderId: number) => {
        try {
            return await getClubsByLeader(leaderId); // Return the fetched clubs
        } catch (error) {
            console.error('Error fetching clubs by leader:', error);
            return []; // Return an empty array in case of an error
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (showClubs) {
                try {
                    const userId = Number(localStorage.getItem("UserId"));
                    const userClubs = await fetchUserClubs(userId);
                    const leaderClubs = await fetchClubsbyLeader(userId);
    
                    // Merge fetched clubs
                    const allClubs = [...userClubs, ...leaderClubs];
    
                    // Deduplicate clubs
                    const uniqueClubs = allClubs.filter(
                        (club, index, self) =>
                            index ===
                            self.findIndex(
                                (t) => t.id === club.id
                            )
                    );
    
                    // Update the state with unique clubs
                    setClubs(prevClubs => {
                        // Track added club IDs to avoid duplicates
                        const addedClubIds = new Set(prevClubs.map(club => club.id));
                        const clubsToAdd = uniqueClubs.filter(club => !addedClubIds.has(club.id));
                        return [...prevClubs, ...clubsToAdd];
                    });
                } catch (error) {
                    console.error('Error fetching clubs:', error);
                }
            }
        };
    
        fetchData();
    }, [showClubs]);
    
    


    return (
        <>
            <div className='bg-offwhite min-h-screen flex flex-col'>

                <NavbarComponent />

                <div className={pageSize ? "px-[70px] py-4" : "px-5 py-4"}>
                    <div className={pageSize ? "grid grid-cols-4 gap-1" : ""}>
                        <div className="col-span-1 mt-8">
                            {/* username, name, add btn, friends section */}
                            <div className='flex flex-col justify-center mb-10'>
                                <div className='flex justify-center'>
                                    <Image
                                        src={info.displayedUser?.profilePic || '/dummyImg.png'}
                                        alt='profile image'
                                        width={150}
                                        height={150}
                                        className='pfp shadow-md'
                                    />
                                </div>
                                <div className='text-center mt-5'>
                                    <h1 className='text-[28px] font-mainFont font-bold'>{info.displayedUser?.username}</h1>
                                    <h2 className='text-[22px] font-mainFont'>{`${info.displayedUser?.firstName} ${info.displayedUser?.lastName}`}</h2>
                                    <div className='mt-3'>
                                        {!isMyProfile &&
                                            <button className='darkBlue text-white py-1 px-3 rounded-2xl'>Add as Friend <AddIcon />

                                            </button>}
                                    </div>
                                </div>
                            </div>

                            {/* friends section desktop */}
                            <div className={pageSize ? "contents" : "hidden"}>
                                <div className="flex justify-between">
                                    <div className='ms-5'>
                                        <h3 className='text-2xl font-mainFont font-semibold'>Friends</h3>
                                    </div>
                                    <div className='me-5'>
                                        <AddIcon fontSize='large' />
                                    </div>
                                </div>
                                <div className="bg-ivory rounded-lg p-[5px]">
                                    {/* displays 4 friends at a time ? */}
                                    <FriendsComponent />
                                    <FriendsComponent />
                                    <FriendsComponent />
                                    <FriendsComponent />
                                </div>
                            </div>

                            {/* friends section mobile */}
                            <div className={pageSize ? "hidden" : "contents font-mainFont"}>
                                <div className='flex justify-between px-4'>
                                    <p className='text-xl font-bold'> Friends </p>
                                    <p className='justify-end'> view all </p>
                                </div>

                                <div className='border-ivory rounded-lg bg-white border-8 h-36'>
                                    <div className='grid grid-cols-3'>
                                        <FriendsComponent />
                                        <FriendsComponent />
                                        <FriendsComponent />
                                    </div>
                                </div>
                            </div>

                            {/* clubs and favorited manga tabs */}
                            <div className={pageSize ? 'hidden' : 'items-center mt-2'}>
                                <Tabs theme={customTabs} aria-label='Tabs with underline' style='underline'>

                                    {/* tabs item for clubs */}
                                    <Tabs.Item className='tabsFont' title='Clubs'>
                                        <div className={clubs.length !== 0 ? 'bg-darkblue p-3 rounded-lg w-full' : ''}>
                                            <div className={showClubs ? "" : ""}>
                                                {clubs.length !== 0 ? clubs.map((club, idx) => (
                                                    <div key={idx} className='col-span-1 mx-2 py-1' onClick={() => handleClubCardClick(club)}>
                                                        <CardProfPgComponent
                                                            id={club.id}
                                                            leaderId={club.leaderId}
                                                            description={club.description}
                                                            dateCreated={club.dateCreated}
                                                            image={club.image}
                                                            isPublic={club.isPublic}
                                                            clubName={club.clubName}
                                                            isDeleted={club.isDeleted}
                                                        />
                                                    </div>
                                                )) :
                                                    <div className='col-span-3 bg-tra'>
                                                        <h1 className='pt-20 text-center font-poppinsMed text-2xl text-darkbrown'>You are not in any clubs. <br /> <span onClick={() => router.push('/BrowseClubs')} className='cursor-pointer underline hover:italic hover:text-[#3D4C6B]'>Join some clubs!</span></h1>
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                    </Tabs.Item>

                                    {/* empty disabled tab items for format */}
                                    <Tabs.Item disabled title=''>
                                    </Tabs.Item>
                                    <Tabs.Item disabled title=''>
                                    </Tabs.Item>

                                    {/* tabs item for favorited mangas */}
                                    <Tabs.Item className='tabs ' style={{ fontFamily: 'mainFont' }} title='Mangas'>

                                        <div className={!showClubs ? "" : "border-ivory bg-white border-8 rounded-lg"}>

                                            <div className='grid grid-cols-2'>
                                                {/* current reads */}
                                                <img src='/aot.png' className="h-[215px] w-[150px] m-4" />


                                                {/* finished reads */}
                                                <img src='/signofaff.jpg' className="h-[215px] w-[150px] m-4" />

                                            </div>

                                        </div>
                                    </Tabs.Item>


                                </Tabs>
                            </div>

                        </div>
                        <div className={pageSize ? "col-span-3 ms-10" : "hidden"}>
                            {/* (if own profile + user is in no clubs, create club button = true) clubs section, favorites section, displays 6+ clubs at a time, faves display 5 covers per 'row' */}
                            <div className="flex">
                                <div className='me-5'>
                                    <button className={showClubs ? activeBtn : inactiveBtn} onClick={clubDisplay}>Clubs</button>
                                </div>

                                <div>
                                    <button className={!showClubs ? activeBtn : inactiveBtn} onClick={favDisplay}>Favorites</button>
                                </div>
                                {/* display none div unless conditions are met (viewing your own profile, in no clubs) */}
                                <div className='ms-auto'>
                                    <ClubModalComponent />
                                </div>
                            </div>

                            <div className='mt-4'>
                                <div className={showClubs ? clubox : noClubox}>
                                    {clubs.length !== 0 ? clubs.map((club, idx) => (
                                        <div key={idx} className='col-span-1 mx-2' onClick={() => handleClubCardClick(club)}>
                                            <CardComponent
                                                id={club.id}
                                                leaderId={club.leaderId}
                                                description={club.description}
                                                dateCreated={club.dateCreated}
                                                image={club.image}
                                                isPublic={club.isPublic}
                                                clubName={club.clubName}
                                                isDeleted={club.isDeleted}
                                            />
                                        </div>
                                    )) :
                                        <div className='col-span-3'>
                                            <h1 className='pt-20 text-center font-poppinsMed text-2xl text-darkbrown'>You are not in any clubs. <br /> <span onClick={() => router.push('/BrowseClubs')} className='cursor-pointer underline hover:italic hover:text-[#3D4C6B]'>Join some clubs!</span></h1>
                                        </div>
                                    }
                                </div>

                                <div className={!showClubs ? favbox : noFavbox}>
                                    <p className='font-mainFont text-lg mb-4'>Currently Reading:</p>
                                    <div className='grid grid-cols-5 ms-5'>
                                        {/* current reads */}
                                        <img src='/aot.png' className="h-[215px] w-[150px] mb-4" />


                                    </div>
                                    <p className='font-mainFont text-lg mb-4'>Completed:</p>
                                    <div className='grid grid-cols-5 ms-5'>
                                        {/* finished reads */}
                                        <img src='/aot.png' className="h-[215px] w-[150px] mb-4" />

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>

    )
}

export default ProfilePage
