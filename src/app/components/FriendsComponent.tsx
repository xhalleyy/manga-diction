"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAcceptedFriends } from '@/utils/DataServices';
import { IAcceptedFriends, IUserData } from '@/Interfaces/Interfaces';
import { CustomFlowbiteTheme, Avatar } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useClubContext } from '@/context/ClubContext';

type FriendsType = {
    searchedUser: number | undefined
}


const FriendsComponent = ({searchedUser}: FriendsType) => {

    const router = useRouter();
    const {selectedUser, setSelectedUser} = useClubContext();
    const [pageSize, setPageSize] = useState<boolean>(false);
    const [friends, setFriends] = useState<IAcceptedFriends[]>([]);

    const displayFriends = async (userId: number) => {
        try {
            const data = await getAcceptedFriends(userId);
            setFriends(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };
    
    
    useEffect(() => {
        if (searchedUser !== undefined && searchedUser === selectedUser?.id) {
            displayFriends(selectedUser?.id); 
        }else{
            let userId = Number(localStorage.getItem("UserId"));
            displayFriends(userId); 
            
        }
    }, [searchedUser]);

    const handleFriendClick = (user: IUserData | null) => {
        setSelectedUser(user);
        router.push('/SearchedUser')
      }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);

            const handleResize = () => {
                setPageSize(window.innerWidth > 768);
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
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
            {friends.length === 0 ? (
                <p className='text-center text-2xl font-poppinsMed text-lightbrown lg:pt-20'>No friends... <br /> {'(｡•́︿•̀｡)(╥﹏╥)'}</p>
            ) : (
                friends.map(friend => (
                    <div key={friend.id} onClick={() => {handleFriendClick(friend)}} className={pageSize ? "bg-white pt-[5px] mb-1 flex rounded-t-md cursor-pointer" : "flex justify-center pt-2 pb-2 text-center"}>
                        {pageSize ? (
                            <div className='grid grid-cols-6 items-center lg:border-b-4 w-full lg:border-ivory pb-3'>
                                <Avatar className='col-span-2 flex justify-end' img={friend.profilePic} rounded theme={customAvatar} size="md" />
                                <div className='ms-10 col-span-4'>
                                    <h4 className='font-poppinsMed text-lg text-darkbrown'>{friend.username}</h4>
                                    <p className='font-mainFont text-darkbrown'>{friend.firstName} {friend.lastName}</p>
                                </div>
                            </div>
                        ) : (
                            <div className='flex justify-center items-center'>
                                <Avatar img={friend.profilePic} rounded theme={customAvatar} size="lg" />
                                <div className='ml-2'>
                                    <p className='font-poppinsMed text-lg text-darkbrown'>{friend.username}</p>
                                    <p className='font-mainFont text-sm text-darkbrown'>{friend.firstName} {friend.lastName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </>
    )
}

export default FriendsComponent
