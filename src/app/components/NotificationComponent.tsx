'use client'

import React, { useEffect, useState } from 'react'
import { CustomFlowbiteTheme, Dropdown, DropdownDivider } from "flowbite-react";
import { getPendingFriends, getUserInfo, handlePendingFriends } from '@/utils/DataServices';
import { IPendingFriends, IUserDataWithRequestId, IUpdateUser, IUserData } from '@/Interfaces/Interfaces';

const NotificationComponent = () => {
    const [requestedFriends, setRequestedFriends] = useState<IUserDataWithRequestId[]>([]);
    // const [requestsIds, setRequestsIds] = useState<IPendingFriends[]>([]);
    const [confirmationMessages, setConfirmationMessages] = useState<string[]>([]);

    // SEE PENDING FRIEND REQUESTS
    const seePendingFriends = async () => {
        let userId = Number(localStorage.getItem("UserId"));
        const pendingFriends = await getPendingFriends(userId);
        // setRequestsIds(pendingFriends);
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

    useEffect(() => {
        seePendingFriends();
    }, []);

    const handleFriends = async (requestId: number, decision: string) => {
        const data = await handlePendingFriends(requestId, decision);
        console.log(data);
        seePendingFriends();
    };

    const customDropdown: CustomFlowbiteTheme["dropdown"] = {
        "content": "h-72 focus:outline-none overflow-y-auto"
    }

    return (
        <div>
            <Dropdown theme={customDropdown} className=" border-8 rounded-xl border-offwhite w-96"
                arrowIcon={false}
                inline
                label={
                    <img src="/Bell.png" />
                }
            >
                {requestedFriends.length === 0 ? (
                    <p className='mt-24 text-center font-mainFont text-xl text-lightbrown'>you have no notifications <br />{'(｡ •́︿•̀｡ )'}</p>
                ) : (
                    requestedFriends.map((user) => (
                        <div key={user.id}>
                            <Dropdown.Item className='grid grid-cols-4 ps-7 pe-3'>
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
                                            className='bg-darkerblue px-2 text-white font-poppinsMed rounded-lg py-0.5 hover:bg-emerald-200 hover:text-darkbrown'
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleFriends(user.requestId, "deny")}
                                            className='bg-darkerblue px-2 text-white font-poppinsMed rounded-lg py-0.5 hover:bg-red-400 hover:text-darkbrown'
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
                {/* <Dropdown.Item className="text-xl text-darkbrown">notification</Dropdown.Item>
            <Dropdown.Item className="text-xl text-darkbrown">notification</Dropdown.Item>
            <DropdownDivider className="border-2 border-offwhite" />
            <Dropdown.Item className="text-xl text-darkbrown">notification</Dropdown.Item> */}
            </Dropdown>
        </div>
    )
}

export default NotificationComponent
