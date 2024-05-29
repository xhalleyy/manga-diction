'use client'

import React, { useEffect, useState } from 'react'
import { CustomFlowbiteTheme, Dropdown, DropdownDivider } from "flowbite-react";
import { GetReplyNotification, getCommentById, getPendingFriends, getPendingMemberRequests, getPostById, getUserCommentLikes, getUserInfo, getUserPostLikes, handlePendingFriends, handlePendingMemberRequests } from '@/utils/DataServices';
import { IPendingFriends, IUserDataWithRequestId, IUpdateUser, IUserData, IPendingMembers, IUserLikes, IPostData, TReply } from '@/Interfaces/Interfaces';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { red } from '@mui/material/colors';

const NotificationComponent = () => {
    const [requestedFriends, setRequestedFriends] = useState<IUserDataWithRequestId[]>([]);
    const [requestsIds, setRequestsIds] = useState<IPendingFriends[]>([]);
    const [pendingMembers, setPendingMembers] = useState<IPendingMembers[]>([]);
    const [messages, setMessages] = useState<{ profilePic: string| null; firstUsername: string; othersText: string; postTitle: string; }[]>([]);
    const [commentMessage, setCommentMessage] = useState<{ profilePic: string| null; firstUsername: string; othersText: string; reply: string; }[]>([]);
    const [recentReplies, setRecentReplies] = useState<TReply[]>([]);

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
    const seePostLikes = async () => {
        try {
            const userId = Number(localStorage.getItem("UserId"));
            const userPostLikes = await getUserPostLikes(userId);
    
            if (!userPostLikes || userPostLikes.length === 0) {
                // console.error("User Post Likes is empty or undefined");
                return;
            }
    
            const messagesArr: { profilePic: string|null; firstUsername: string; othersText: string; postTitle: string; }[] = []; 
    
            for (const like of userPostLikes) {
    
                const post = await getPostById(like.postId);
                if (post) {
                    const ids = like.likes.likedByUsers.map(user => user.userId);
                    const firstId = await getUserInfo(ids[0])
                    const profilePic = firstId.profilePic
                    const usernames = like.likes.likedByUsers.map(user => user.username);
                    const firstUsername = usernames[0];
                    const othersCount = usernames.length - 1;
                    const othersText = othersCount > 0 ? ` and ${othersCount} other${othersCount > 1 ? 's ' : ' '}` : ' ';
    
                    const message = { profilePic, firstUsername, othersText, postTitle: ` ${post.title}` };
                    messagesArr.push(message);
                } else {
                    // console.log('Skipping this like because post is invalid');
                }
            }
    
            setMessages(messagesArr);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            return [];
        }
    };

    const seeCommentLikes = async () => {
        try {
            const userId = Number(localStorage.getItem("UserId"));
            const userCommentLikes = await getUserCommentLikes(userId);

            if (!userCommentLikes || userCommentLikes.length === 0) {
                // console.error("User Post Likes is empty or undefined");
                return;
            }

            const messagesArr: { profilePic: string|null; firstUsername: string; othersText: string; reply: string; }[] = []; 
    
            for (const like of userCommentLikes) {
    
                const comment = await getCommentById(like.commentId);
                if (comment) {
                    const ids = like.likes.likedByUsers.map(user => user.userId);
                    const firstId = await getUserInfo(ids[0])
                    const profilePic = firstId.profilePic
                    const usernames = like.likes.likedByUsers.map(user => user.username);
                    const firstUsername = usernames[0];
                    const othersCount = usernames.length - 1;
                    const othersText = othersCount > 0 ? ` and ${othersCount} other${othersCount > 1 ? 's ' : ' '}` : ' ';
    
                    const message = { profilePic, firstUsername, othersText, reply: ` "${comment.reply}" ` };
                    messagesArr.push(message);
                } else {
                    console.log('Skipping this like because post is invalid');
                }
            }
    
            setCommentMessage(messagesArr);
            
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            return [];
        }
    }

    const SeeComments = async () => {
        const data = await GetReplyNotification(Number(localStorage.getItem("UserId")));
        console.log(data)
        setRecentReplies(data)
    }

    useEffect(() => {
        seePendingRequests();
        seePendingFriends();
        seePostLikes();
        seeCommentLikes();
        SeeComments();
    }, []);

    const handleFriends = async (requestId: number, decision: string) => {
        const data = await handlePendingFriends(requestId, decision);
        console.log(data);
        seePendingFriends();
    };

    const handleClubRequests = async (requestId: number, decision: string) => {
        const data = await handlePendingMemberRequests(requestId, decision);
        console.log(data)
        seePendingRequests();
    }

    const customDropdown: CustomFlowbiteTheme["dropdown"] = {
        "content": "h-80 focus:outline-none overflow-y-auto",
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
            
                {((requestedFriends.length !== 0) || (pendingMembers.length !== 0) || (messages.length !== 0) || (commentMessage.length !==0)) ?
                    <Badge color='info' variant="dot" badgeContent=" ">
                        <Dropdown theme={customDropdown} className=" border-8 rounded-xl border-ivory w-96"
                            arrowIcon={false}
                            inline
                            label={
                                <img src="/Bell.png" />}
                        >
                          {
                                recentReplies.length > 0 && recentReplies.map( (reply, idx) => 
                                    <div key={idx}>
                                        <Dropdown.Item className='grid grid-cols-4 ps-7 pe-3y-2'>
                                            <img
                                                src={reply.profilePic || '/noprofile.jpg'}
                                                alt={reply.username}
                                                className="col-span-1 cursor-pointer w-12 h-12 shadow-lg rounded-3xl"
                                            />
                                            <div className='col-span-3 flex flex-col justify-center'>
                                                <p className='font-mainFont text-[15px] text-start'>
                                                    <span className='font-poppinsBold'>{reply.username}</span> {reply.FromPost ? "commented on your post: " : "replied to your comment: "}
                                                    {reply.detail.length > 10 ? ` ${reply.detail.substring(0, 20)}...` : reply.detail}
                                                </p>
                                            </div>
                                        </Dropdown.Item>
                                        <DropdownDivider className="border-2 my-0 border-ivory" />
                                    </div>
                                 )
                            }
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
                                        <DropdownDivider className="border-2 my-0 border-ivory" />
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
                                            <DropdownDivider className="border-2 my-0 border-ivory" />
                                            {/* <p>{request.clubName}</p>
                                            <p key={index}>{member.name} requested to join club {request.clubId}</p> */}
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {messages.map((message, idx) => (
                                <div key={idx}>
                                    <Dropdown.Item className='grid grid-cols-4 ps-7 pe-3'>
                                        <img
                                            src={message.profilePic || '/noprofile.jpg'}
                                            alt={`User liked your post`}
                                            className="col-span-1 cursor-pointer w-12 h-12 shadow-lg rounded-3xl"
                                        />
                                        <div className='col-span-3 flex flex-col justify-center'>
                                            <p className='font-mainFont text-[15px] text-start'> <span className='font-poppinsBold'>{message.firstUsername} {message.othersText}</span>
                                                liked your post 
                                                <span className='font-poppinsMed'>{message.postTitle.length > 10 ? ` ${message.postTitle.substring(0, 20)}...` : message.postTitle}</span>
                                            </p>
                                        </div>
                                    </Dropdown.Item>
                                    <DropdownDivider className="border-2 my-0 border-ivory" />
                                </div>
                            ))}
                            {commentMessage.map((comment, idx) => (
                                <div key={idx}>
                                    <Dropdown.Item className='grid grid-cols-4 ps-7 pe-3'>
                                        <img
                                            src={comment.profilePic || '/noprofile.jpg'}
                                            alt={`User liked your post`}
                                            className="col-span-1 cursor-pointer w-12 h-12 shadow-lg rounded-3xl"
                                        />
                                        <div className='col-span-3 flex flex-col justify-center'>
                                            <p className='font-mainFont text-[15px] text-start'> <span className='font-poppinsBold'>{comment.firstUsername} {comment.othersText}</span>
                                                liked your comment 
                                                <span className='font-poppinsMed'>{comment.reply.length > 10 ? ` ${comment.reply.substring(0, 20)}...` : comment.reply}</span>
                                            </p>
                                        </div>
                                    </Dropdown.Item>
                                    <DropdownDivider className="border-2 my-0 border-ivory" />
                                </div>
                            ))}
                        </Dropdown>
                    </Badge> :
                    <Dropdown theme={customDropdown} className=" border-8 rounded-xl border-ivory w-96"
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
