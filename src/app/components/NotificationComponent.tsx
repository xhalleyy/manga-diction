'use client'

import React, { useEffect, useState } from 'react'
import { CustomFlowbiteTheme, Dropdown, DropdownDivider } from "flowbite-react";
import { getPendingFriends, getPendingMemberRequests, getPostById, getUserInfo, getUserPostLikes, handlePendingFriends, handlePendingMemberRequests } from '@/utils/DataServices';
import { IPendingFriends, IUserDataWithRequestId, IUpdateUser, IUserData, IPendingMembers, IUserLikes, IPostData } from '@/Interfaces/Interfaces';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { red } from '@mui/material/colors';

const NotificationComponent = () => {
    const [requestedFriends, setRequestedFriends] = useState<IUserDataWithRequestId[]>([]);
    const [requestsIds, setRequestsIds] = useState<IPendingFriends[]>([]);
    const [pendingMembers, setPendingMembers] = useState<IPendingMembers[]>([]);
    const [postLikes, setPostLikes] = useState<IUserLikes[]>([]);
    const [userPosts, setUserPosts] = useState<IPostData[]>([])
    const [commentLikes, setCommentLikes] = useState<IUserLikes[]>([]);

    // SEE PENDING FRIEND REQUESTS
    const seePendingFriends = async () => {
        let userId = Number(localStorage.getItem("UserId"));
        const pendingFriends = await getPendingFriends(userId);
        setRequestsIds(pendingFriends);
        const userIds = pendingFriends.map(friend => friend.userId);

        const requestedUsersInfo = await Promise.all(
            userIds.map(async (userId) => {
                const userInfo = await getUserInfo(userId);
                return userInfo;
            })
        );

        // Include requestId in user info for later use
        const requestedFriendsWithIds: IUserDataWithRequestId[] = requestedUsersInfo.map((userInfo, index) => ({
            ...userInfo,
            requestId: pendingFriends[index].id
        }));

        setRequestedFriends(requestedFriendsWithIds);
    };

    // SEE PENDING CLUB REQUESTS
    const seePendingRequests = async () => {
        try {
            let userId = Number(localStorage.getItem("UserId"));
            const pendingRequests = await getPendingMemberRequests(userId);
            setPendingMembers(pendingRequests);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
        }
    }

    // SEE MOST RECENT LIKES OF YOUR POSTS
    // const seePostLikes = async () => {
    //     try {
    //         let userId = Number(localStorage.getItem("UserId"));
    //         const userPostLikes = await getUserPostLikes(userId);
    //         console.log(userPostLikes)
    //         setPostLikes(userPostLikes);

    //         userPostLikes.forEach(like => {
    //             const post = posts.find(p => p.id === like.postId);
        
    //             if (post) {
    //                 const usernames = like.likes.likedByUsers.map(user => user.username);
    //                 const firstUsername = usernames[0];
    //                 const othersCount = usernames.length - 1;
    //                 const othersText = othersCount > 0 ? ` and ${othersCount} other${othersCount > 1 ? 's' : ''}` : '';
        
    //                 const message = `${firstUsername}${othersText} liked your post "${post.title}"`;
    //                 messages.push(message);
    //             }
    //         });
        
    //         return messages;
    //     } catch (error) {
    //         console.error("Error fetching pending requests:", error);
    //     }
    // }

    useEffect(() => {
        seePendingRequests();
        seePendingFriends();
        // seePostLikes();
    }, []);

    const handleFriends = async (requestId: number, decision: string) => {
        const data = await handlePendingFriends(requestId, decision);
        console.log(data);
        seePendingFriends();
    };

    const handleClubRequests = async (requestId:number, decision: string) => {
        const data = await handlePendingMemberRequests(requestId, decision);
        console.log(data)
        seePendingRequests();
    }

    const customDropdown: CustomFlowbiteTheme["dropdown"] = {
        "content": "h-72 focus:outline-none overflow-y-auto",
        "floating": {
            "item": {
                "container": "",
                "base": "flex w-full cursor-pointer items-center justify-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
                "icon": "mr-2 h-4 w-4"
            },
        }
    }



    return (
        <div>
            <Box sx={{ color: 'action.active' }}>
                {((requestedFriends.length !== 0) || (pendingMembers.length !== 0)) ?
                    <Badge color='info' variant="dot" badgeContent=" ">
                        <Dropdown theme={customDropdown} className=" border-8 rounded-xl border-offwhite w-96"
                            arrowIcon={false}
                            inline
                            label={
                                <img src="/Bell.png" />}
                        >
                            {(
                                requestedFriends.map((user) => (
                                    <div key={user.id}>
                                        <Dropdown.Item className='grid grid-cols-4 ps-7 pe-3y-2'>
                                            <img
                                                src={user.profilePic || '/noprofile.jpg'}
                                                alt={`${user.username} requested to add.`}
                                                className="col-span-1 cursor-pointer w-12 h-12 shadow-lg rounded-3xl"
                                            />
                                            <div className='col-span-3 flex flex-col justify-center'>
                                                <p className='font-mainFont text-[15px] text-start'>
                                                    <span className='font-poppinsBold'>{user.username} </span>requested to add you!
                                                </p>
                                                <div className='flex justify-center items-center gap-5 mt-1'>
                                                    <button
                                                        onClick={() => handleFriends(user.requestId, "accept")}
                                                        className='bg-darkerblue px-2 text-white font-poppinsMed rounded-xl py-0.5 hover:bg-emerald-200 hover:text-darkbrown'
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleFriends(user.requestId, "deny")}
                                                        className='bg-darkerblue px-2 text-white font-poppinsMed rounded-xl py-0.5 hover:bg-red-400 hover:text-darkbrown'
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                        <DropdownDivider className="border-2 my-0 border-offwhite" />
                                    </div>
                                ))
                            )}
                            {pendingMembers.map((request, idx) => (
                                <div key={idx}>
                                    {request.members.map((member, index) => (
                                        <div key={index}>
                                            <Dropdown.Item className='grid grid-cols-4 ps-7 pe-3'>
                                                <img
                                                    src={member.profilepic || '/noprofile.jpg'}
                                                    alt={`${member.name} requested to join.`}
                                                    className="col-span-1 cursor-pointer w-12 h-12 shadow-lg rounded-3xl"
                                                />
                                                <div className='col-span-3 flex flex-col justify-center'>
                                                    <p className='font-mainFont text-[15px] text-start'>
                                                        <span className='font-poppinsBold'>{member.name} </span>requested to join <span className='font-poppinsBold'>{request.clubName}</span>!
                                                    </p>
                                                    <div className='flex justify-center items-center gap-5 mt-1'>
                                                        <button
                                                            onClick={() => handleClubRequests(member.id, "accept")}
                                                            className='bg-darkerblue px-2 text-white font-poppinsMed rounded-xl py-0.5 hover:bg-emerald-200 hover:text-darkbrown'
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleClubRequests(member.id, "deny")}
                                                            className='bg-darkerblue px-2 text-white font-poppinsMed rounded-xl py-0.5 hover:bg-red-400 hover:text-darkbrown'
                                                        >
                                                            Deny
                                                        </button>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                            <DropdownDivider className="border-2 my-0 border-offwhite" />
                                            {/* <p>{request.clubName}</p>
                                            <p key={index}>{member.name} requested to join club {request.clubId}</p> */}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </Dropdown>
                    </Badge> :
                    <Dropdown theme={customDropdown} className=" border-8 rounded-xl border-offwhite w-96"
                        arrowIcon={false}
                        inline
                        label={
                            <img src="/Bell.png" />}
                    >

                        <p className='mt-24 text-center font-mainFont text-xl text-lightbrown'>you have no notifications <br />{'(｡ •́︿•̀｡ )'}</p>
                    </Dropdown>}
            </Box>
        </div>
    )
}

export default NotificationComponent
