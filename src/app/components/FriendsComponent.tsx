"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAcceptedFriends } from '@/utils/DataServices';
import { IAcceptedFriends } from '@/Interfaces/Interfaces';
import { CustomFlowbiteTheme, Avatar } from 'flowbite-react';
import image from 'next/image';


const FriendsComponent = () => {

    const [pageSize, setPageSize] = useState<boolean>(false);
    const [friends, setFriends] = useState<IAcceptedFriends[]>();

    const displayFriends = async () => {
        let userId = Number(localStorage.getItem("UserId"));

        try {
            const data = await getAcceptedFriends(userId);
            setFriends(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }

    }

    useEffect(() => {
        displayFriends();
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);

            const handleResize = () => {
                setPageSize(window.innerWidth > 768);
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }

        // console.log('hit');
        // displayFriends();
    }, []);

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
            {friends && friends.map(friend => (
                <div key={friend.id} className={pageSize ? "bg-white py-[10px] mb-1 flex rounded-t-md" : "flex justify-center pt-2 pb-2 text-center"}>
                    {pageSize ? (
                        <div className='flex flex-row flex-1 justify-center xl:ms-[-50px] lg:border-b-4 lg:border-ivory pb-3'>
                            {/* <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10' /> */}
                            <Avatar img={friend.profilePic} rounded theme={customAvatar} size="md" />
                            <div className='ms-10'>
                                <h4>{friend.username}</h4>
                                <p>{friend.firstName} {friend.lastName}</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex justify-center items-center'>
                        <Avatar img={friend.profilePic} rounded theme={customAvatar} size="lg" />
                            {/* <Image
                                src={friend.profilePic}
                                width={100}
                                height={100}
                                alt='profile image'
                                className='friendPfp'
                            /> */}
                            <div>
                                <p className='font-bold text-lg'>{friend.username}</p>
                                <p className='text-sm'>{friend.firstName} {friend.lastName}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}

export default FriendsComponent
