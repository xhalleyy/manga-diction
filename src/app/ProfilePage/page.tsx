'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image'
import CardComponent from '../components/CardComponent';
import { IClubs, IFavManga, IManga, IUserData } from '@/Interfaces/Interfaces';
import { GetLikesByPost, getClubsByLeader, getCompletedManga, getInProgessManga, getUserClubs, getUserInfo, getUsersByUsername, publicClubsApi, specificManga, specifiedClub } from '@/utils/DataServices';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { useClubContext } from '@/context/ClubContext';
// import FriendsDesktopComponent from '../components/FriendsComponent';
import { Avatar, CustomFlowbiteTheme, Tabs } from 'flowbite-react';
import CardComponent2 from '../components/CardComponent2';
import CardProfPgComponent from '../components/CardProfPgComponent';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import SearchedFriendsComponent from '../components/SearchedFriendsComponent';
import FriendsComponent from '../components/FriendsComponent';

const ProfilePage = (props: any) => {

    const info = useClubContext();
    const { mangaId, setMangaId } = useClubContext();
    const [clubs, setClubs] = useState<IClubs[]>([]);
    const [pageSize, setPageSize] = useState<boolean>(false);

    const [showClubs, setShowClubs] = useState<boolean>(true);
    const [userData, setUserData] = useState<IUserData>();
    const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
    const [picture, setPicture] = useState<string>("");
    const router = useRouter();

    const [friendBool, setFriendBool] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [searchedUsers, setSearchedUsers] = useState<IUserData[]>();

    const [completed, setCompleted] = useState<any[]>([]);
    const [ongoing, setOngoing] = useState<any[]>([]);




    const searchUser = async () => {
        try {
            const data = await getUsersByUsername(search);
            setSearchedUsers(data);
            // setSearch(data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }

    const handleUserClick = (user: IUserData) => {
        info.setSelectedUser(user);
        router.push('/SearchedUser');
    }


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

    const customAvatar: CustomFlowbiteTheme['avatar'] = {
        "root": {
            "rounded": "rounded-full shadow-lg",
            "size": {
                "md": "h-12 w-12",
                "lg": "h-16 w-16"
            }
        }
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

    const editSettingsPage = () => {
        router.push('/EditSettings')
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
            // console.log("User data updated:", user);
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
            return usersInfo;
        } catch (error) {
            console.error('Error fetching club members:', error);
            return [];
            // returning an empty array because we merge user clubs and leader clubs together and they have to be of an array type
        }
    };

    const fetchClubsbyLeader = async (leaderId: number) => {
        try {
            return await getClubsByLeader(leaderId);
        } catch (error) {
            console.error('Error fetching clubs by leader:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (showClubs) {
                try {
                    const userId = Number(localStorage.getItem("UserId"));
                    const userClubs = await fetchUserClubs(userId);
                    const leaderClubs = await fetchClubsbyLeader(userId);

                    const allClubs = [...userClubs, ...leaderClubs];

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

    useEffect(() => {
        const fetchManga = async () => {
            let user = Number(localStorage.getItem("UserId"));

            const completedManga = await getCompletedManga(user);
            const allCompleted = await Promise.all(
                completedManga.map(async (manga: IFavManga) => {
                    const mangaData = await specificManga(manga.mangaId);
                    const coverArt = coverArtUrl(mangaData);
                    return {
                        manga: mangaData,
                        coverArtUrl: coverArt
                    };
                })
            );
            setCompleted(allCompleted);

            const ongoingManga = await getInProgessManga(user);
            const allOngoing = await Promise.all(
                ongoingManga.map(async (manga: IFavManga) => {
                    const mangaData = await specificManga(manga.mangaId);
                    const coverArt = coverArtUrl(mangaData);
                    return {
                        manga: mangaData,
                        coverArtUrl: coverArt
                    };
                })
            );
            setOngoing(allOngoing);
        };

        fetchManga();
    }, []);


    const coverArtUrl = (manga: IManga): string => {
        if (!manga || !manga.data || !manga.data.relationships) {
            return ''; // Return an empty string if manga data or relationships are not available
        }
        const relationships = manga.data.relationships;
        const coverArt = relationships.find(rel => rel.type === "cover_art");
        if (!coverArt) {
            return ''; // Return an empty string if cover art is not available
        }
        const mangaId = manga.data.id;
        const coverFileName = coverArt.attributes.fileName;
        return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}`; // Construct the complete cover art URL
    };

    const handleMangaClick = (newMangaId: string) => {
        info.setMangaId(newMangaId)
        // console.log(newMangaId)
        // console.log(mangaId)
        router.push('MangaInfo');
    };


    const openFriendSearch = () => {
        // using document.getElementById instead of using switch statement dependent on bool in className to prevent conflicts with responsiveness bool and classes
        if (friendBool == false) {
            document.getElementById("clubfavBox")?.classList.add("hidden");
            document.getElementById("friendsBB")?.classList.remove("hidden")
            setFriendBool(true);
        } else {
            document.getElementById("clubfavBox")?.classList.remove("hidden");
            document.getElementById("friendsBB")?.classList.add("hidden");
            setFriendBool(false);
        }
    };

    const viewAllFriends = () => {
        // same function as openFriendSearch, but for mobile
        if (friendBool === false) {
            document.getElementById("mobileClubFav")?.classList.add("hidden");
            document.getElementById("mobileFriends")?.classList.remove("hidden");
            setFriendBool(true);
        } else {
            document.getElementById("mobileClubFav")?.classList.remove("hidden");
            document.getElementById("mobileFriends")?.classList.add("hidden");
            setFriendBool(false);
        }
    };





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
                                        src={info.displayedUser?.profilePic || '/noprofile.jpg'}
                                        alt='profile image'
                                        width={150}
                                        height={150}
                                        className='pfp shadow-md'
                                    />
                                </div>
                                <div className='text-center mt-5'>
                                    <div className='inline-flex'>
                                        <h1 className='text-[28px] font-mainFont font-bold'>{info.displayedUser?.username}</h1>
                                        <Tooltip onClick={editSettingsPage} title='Edit Profile' placement='right'>
                                            <EditIcon className='cursor-pointer mt-2 ml-1' />

                                        </Tooltip>
                                    </div>

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
                                        <AddIcon fontSize='large' className='addI' onClick={() => openFriendSearch()} />
                                    </div>
                                </div>
                                <div className="bg-white border-8 border-ivory rounded-lg py-[5px] h-72 overflow-y-auto">
                                    {/* displays 4 friends at a time ? */}
                                    <FriendsComponent searchedUser={info.displayedUser?.id} />
                                    {/* <FriendsComponent /> */}
                                    {/* <FriendsComponent /> */}
                                    {/* <FriendsComponent /> */}
                                </div>
                            </div>

                            {/* friends section mobile */}
                            <div className={pageSize ? "hidden" : "contents font-mainFont"}>
                                <div className='flex justify-between px-4'>
                                    <p className='text-xl font-bold'> Friends </p>
                                    <button className='justify-end' onClick={() => viewAllFriends()}> View All </button>
                                </div>

                                <div className='border-ivory rounded-lg bg-white border-8 md:h-36 h-48 flex md:flex-row flex-col justify-start md:justify-center md:items-center '>
                                    <div className='grid md:grid-cols-3 grid-cols-1 gap-3 md:gap-10 overflow-y-auto'>
                                        <FriendsComponent searchedUser={info.displayedUser?.id} />
                                    </div>
                                </div>
                            </div>

                            {/* friends section (toggled with View All) */}
                            <div className={pageSize ? 'hidden' : 'mt-7 hidden'} id='mobileFriends'>
                                <div className='flex justify-center'>
                                    <div className='darkBeige px-2 pb-1 pt-2 rounded-2xl'>
                                        <input className='rounded-xl h-8 ps-3' onChange={(e) => setSearch(e.target.value)} />
                                        <SearchIcon className='text-4xl text-white' onClick={searchUser} />
                                    </div>
                                </div>
                                {/* <p className='px-16 text-xl font-poppinsMed text-darkbrown mt-5'>Search Results for "</p> */}
                                <p className='px-16 text-xl font-poppinsMed text-darkbrown mt-5'>Search Results for &apos;{search}&apos;</p>

                                <div className="grid grid-cols-2">
                                    {searchedUsers && searchedUsers.map(user => (
                                        <div key={user.id}>
                                            <div className='my-7 mx-auto' onClick={() => { handleUserClick(user)}}>
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
                                        </div>
                                    ))}
                                </div>

                            </div>

                            {/* clubs and favorited manga tabs */}
                            <div className={pageSize ? 'hidden' : 'items-center mt-2'} id='mobileClubFav'>
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

                                            <div className='grid grid-cols-2 '>
                                                {completed.map((manga, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <img className='w-[177px] h-64 rounded-lg py-1' src={manga.coverArtUrl} />                                                        </div>
                                                    );
                                                })}

                                                {/* finished reads */}
                                                {ongoing.map((manga, index) => (
                                                    // Render JSX directly here
                                                    <div key={index}>
                                                        <img className='w-[177px] h-64 rounded-lg py-1' src={manga.coverArtUrl} />

                                                        {/* Add more JSX as needed */}
                                                    </div>
                                                ))}

                                            </div>

                                        </div>
                                    </Tabs.Item>


                                </Tabs>
                            </div>

                        </div>

                        {/* friends search section here- displayed onClick (of + button) */}
                        <div className={pageSize ? "bg-offwhite col-span-3 hidden" : "hidden"} id='friendsBB'>
                            {/* onClick of + button, target and hide div with id "clubfavBox" and display current div "friendsBB" */}
                            <div className='flex justify-end rounded-xl'>
                                <div className='darkBeige px-2 pb-1 pt-2 rounded-2xl'>
                                    <input
                                        className='rounded-xl h-8 ps-3'
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <SearchIcon className='text-4xl text-white cursor-pointer' onClick={searchUser} />
                                </div>
                            </div>

                            <p className='px-16 text-[26px] font-poppinsMed text-darkbrown'>{`Search Results for '${search}'`}</p>

                            {/* Friend item will be another component, .map through user's friends to display */}
                            <div className='grid grid-cols-5'>
                                {searchedUsers && searchedUsers.map(user => (
                                    <div key={user.id}>
                                        {pageSize ? (
                                            <div onClick={() => { handleUserClick(user) }} className="ms-auto mt-5 flex flex-col items-center justify-center place-content-center cursor-pointer">
                                                <Avatar
                                                    img={user.profilePic || ''}
                                                    rounded
                                                    theme={customAvatar}
                                                    size="lg"
                                                />
                                                {/* <Image
                                                    src={user.profilePic | ''}
                                                    alt='profile picture'
                                                    height={110}
                                                    width={110}
                                                    className='searchPfp'
                                                /> */}
                                                <div className='text-center mt-2'>
                                                    <p className='text-lg font font-poppinsMed'>{user.username}</p>
                                                    <p className='text-sm -mt-1'>{user.firstName} {user.lastName}</p>
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
                                                {/* <Image
                                                    src={user.profilePic}
                                                    alt='profile picture'
                                                    height={110}
                                                    width={110}
                                                    className='searchPfp'
                                                /> */}
                                                <div className='text-center mt-2'>
                                                    <p className='text-lg font font-poppinsMed'>{user.username}</p>
                                                    <p className='text-sm -mt-1'>{user.firstName} {user.lastName}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {/* <SearchedFriendsComponent />
                                <SearchedFriendsComponent />
                                <SearchedFriendsComponent />
                                <SearchedFriendsComponent />
                                <SearchedFriendsComponent />
                                <SearchedFriendsComponent />
                                <SearchedFriendsComponent /> */}

                            </div>

                        </div>

                        <div className={pageSize ? "col-span-3 ms-10" : "hidden"} id='clubfavBox'>
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
                                                isMature={club.isMature}
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
                                    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3 xl:gap-5 ps-2 mb-5'>
                                        {/* current reads */}
                                        {ongoing.length === 0 ? <p className='col-span-5 h-64 text-xl font-poppinsMed italic text-darkbrown text-center py-10 cursor-pointer'>You have no favorited Mangas that you are currently reading.</p>
                                            :
                                            (ongoing.map((manga, index) => (
                                                <div key={index} onClick={() => handleMangaClick(manga.manga.data.id)}>
                                                    <img className='w-[177px] h-64 rounded-lg' src={manga.coverArtUrl} alt={manga.manga.title} />
                                                </div>
                                            )))}


                                    </div>
                                    <p className='font-mainFont text-lg mb-4'>{'Completed:'}</p>
                                    <div className='grid grid-cols-5 gap-5 ps-2 mb-5'>
                                        {/* finished reads */}

                                        {/* finished reads */}
                                        {completed.length === 0 ? <p className='col-span-5 text-xl font-poppinsMed italic text-darkbrown text-center py-10 cursor-pointer'>You have no favorited Mangas that you have completed.</p> : (completed.map((manga, index) => (
                                            <div key={index} onClick={() => handleMangaClick(manga.manga.data.id)}>
                                                <img className='w-[177px] h-64 rounded-lg' src={manga.coverArtUrl} alt={manga.manga.title} />
                                            </div>
                                        )))}
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
