'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import ClubModalComponent from '../components/ClubModalComponent'
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image'
import CardComponent from '../components/CardComponent';
import { IClubs, IUserData } from '@/Interfaces/Interfaces';
import { getUserClubs, getUserInfo, publicClubsApi, specifiedClub } from '@/utils/DataServices';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { useClubContext } from '@/context/ClubContext';

const ProfilePage = (props: any) => {

    const clubData = useClubContext();
    const [clubs, setClubs] = useState<IClubs[]>([]);
    
    const [showClubs, setShowClubs] = useState<boolean>(true);
    const [userData, setUserData] = useState<IUserData>();
    const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
    const [profilePic, setProfilePic] = useState<string>("");
    const router = useRouter();

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
          clubData.setDisplayedClub(clubDisplayedInfo);
        } catch (error) {
          alert("Error fetching club information");
          console.error(error);
        }
      };

    // This displays user's information by gettint the user's ID from local storage
    useEffect(() => {
        let userId = Number(localStorage.getItem("UserId"));
        const fetchedUser = async () => {
            const user = await getUserInfo(userId);
            // console.log(user.picture)
            const storedPicData = localStorage.getItem(`profilePic_${userId}`);
            if (storedPicData) {
                setProfilePic(storedPicData);
            } setUserData(user);
        }
        fetchedUser();
        
    }, []);


    const fetchUserClubs = async (userId: number | undefined) => {
        try {
          const memberIds = await getUserClubs(userId);
          const promises = memberIds.map((clubId: number) => specifiedClub(clubId));
          const usersInfo = await Promise.all(promises);
          setClubs(usersInfo);
        } catch (error) {
          console.error('Error fetching club members:', error);
        }
      };

    useEffect(()=> {
        if (showClubs) {
            let userId = Number(localStorage.getItem("UserId"));
            fetchUserClubs(userId);
          }
    }, [showClubs])
    
    // const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files && e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             const picData = reader.result as string;
    //             localStorage.setItem('profilePic', picData)
    //             setProfilePic(picData)
    //         };
    //         reader.readAsDataURL(file);
    //     }

    // }

    return (
        <div className='bg-offwhite h-screen'>

            <NavbarComponent />

            <div className="px-[70px] my-4">
                <div className="grid grid-cols-4 gap-1">
                    <div className="col-span-1 mt-8">
                        {/* username, name, add btn, friends section */}
                        <div className='flex flex-col justify-center mb-10'>
                            <div className='flex justify-center'>
                            <Image
                            src={profilePic || '/dummyImg.png'}
                            alt='profile image'
                            width={150}
                            height={150}
                            className='pfp shadow-md'
                        />
                            </div>
                            <div className='text-center mt-5'>
                                <h1 className='text-[28px] font-mainFont font-bold'>{userData?.username}</h1>
                                <h2 className='text-[22px] font-mainFont'>{`${userData?.firstName} ${userData?.lastName}`}</h2>
                                <div className='mt-3'>
                                    {!isMyProfile && 
                                    <button className='darkBlue text-white py-1 px-3 rounded-2xl'>Add as Friend <AddIcon />
                                        
                                    </button>}
                                </div>
                            </div>
                        </div>

                        <div>
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
                                <div className="bg-white py-[10px] mb-1 flex rounded-t-md">
                                    <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10' />
                                    <div className='ms-10'>
                                        <h4>UserName</h4>
                                        <p>Geto Suguru</p>
                                    </div>
                                </div>

                                <div className="bg-white py-[10px] mb-1 flex">
                                    <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10' />
                                    <div className='ms-10'>
                                        <h4>UserName</h4>
                                        <p>Geto Suguru</p>
                                    </div>
                                </div>

                                <div className="bg-white py-[10px] mb-1 flex">
                                    <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10' />
                                    <div className='ms-10'>
                                        <h4>UserName</h4>
                                        <p>Geto Suguru</p>
                                    </div>
                                </div>

                                <div className="bg-white py-[10px] flex rounded-b-md">
                                    <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10' />
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
    )
}

export default ProfilePage
