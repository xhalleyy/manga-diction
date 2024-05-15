'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { getUserInfo, updateUser } from '@/utils/DataServices'
import { IUserData } from '@/Interfaces/Interfaces'
import Image from 'next/image'
import { Button, Label, TextInput } from 'flowbite-react'
import { AlertTitle } from '@mui/material'
import Alert from '@mui/material/Alert'
import { useRouter } from 'next/navigation'
import { useClubContext } from '@/context/ClubContext'


const EditSettings = () => {

    const { displayedUser, setDisplayedUser } = useClubContext();
    const [changePic, setChangePic] = useState<boolean>(true);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [newPass, setNewPass] = useState<string | null>(null);
    const [currentPass, setCurrentPass] = useState<string | null>(null);

    // useEffect(() => {
    //     let userId = Number(localStorage.getItem("UserId"));
    //     const fetchedUser = async () => {
    //         const user = await getUserInfo(userId);
    //         setDisplayedUser(user);
    //     };

    //     if (success) {
    //         fetchedUser();
    //     }

    // }, [success, setDisplayedUser]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768)
        }

        const handleResize = () => {
            setPageSize(window.innerWidth > 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (displayedUser) {
            if (value.trim() !== '') {
                setDisplayedUser((prevUser: IUserData | null) => ({
                    ...prevUser!,
                    username: value
                }));
            }
        }
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (displayedUser) {
            if (value.trim() !== '') {
                setDisplayedUser((prevUserData: IUserData | null) => ({
                    ...prevUserData!,
                    firstName: value
                }))
            }
        }
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (displayedUser) {
            if (value.trim() !== '') {
                setDisplayedUser((prevUserData: IUserData | null) => ({
                    ...prevUserData!,
                    lastName: value
                }))
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (displayedUser) {
            if (value.trim() !== '') {
                setDisplayedUser((prevUserData: IUserData | null) => ({
                    ...prevUserData!,
                    newPassword: value
                }))
            }
        }
    };

    const handlePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageData = reader.result as string;
                setProfilePic(imageData); 
                console.log("New profile picture data:", imageData);
            };
            reader.readAsDataURL(file); // Read file as base64-encoded string
        }
    };

    useEffect(() => {
        console.log("Profile Picture Updated:", profilePic);
    }, [profilePic]);

    const updateUserInfo = async () => {
        try {
            if (!displayedUser) {
                console.error('Cannot update user: displayedUser is null');
                setSuccess(false);
                return;
            }
    
            // To handle if the profilepic is null 
            const updatedProfilePic = profilePic || displayedUser.profilePic || '';
    
            // Update displayedUser with new picture
            setDisplayedUser((prevUser) => ({
                ...prevUser!,
                profilePic: updatedProfilePic,
            }));
    
            // Object of the returning data for updateUser API endpoint
            const updatedUser = {
                id: displayedUser.id,
                username: displayedUser.username,
                firstName: displayedUser.firstName,
                lastName: displayedUser.lastName,
                age: displayedUser.age,
                profilePic: updatedProfilePic,
                currentPassword: currentPass,
                newPassword: newPass
            };
    
            // console.log('Updated user data:', updatedUser);
    
            const response = await updateUser(updatedUser);
            console.log(response);
    
            if (response) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(undefined);
                }, 5000);
            } else {
                console.error('Failed to update user.');
                setSuccess(false);
            }
        } catch (error) {
            console.error('Failed to update:', error);
            setSuccess(false);
        }
    };
    


    const customInput = {
        "field": {
            "input": {
                "sizes": {
                    "post": "py-1 px-2 text-lg font-mainFont"
                }
            }
        }
    }

    return (
        <>
            <div className='bg-offwhite  min-h-screen'>

                <NavbarComponent />

                <div className={pageSize ? 'mx-40 py-8' : 'pt-5 mx-5'}>
                    <div className="w-full relative flex justify-end items-end -mt-[px]">
                        {success && (
                            <div className="w-72">
                                <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>
                                    Settings Updated!
                                </Alert>
                            </div>
                        )}
                    </div>

                    <h1 className={pageSize ? 'text-darkbrown font-mainFont text-4xl ps-4 pb-2' : 'text-center text-darkbrown font-mainFont text-4xl py-5'}>Account Settings</h1>
                    <div className={pageSize ? 'bg-paleblue p-8 rounded-xl grid xl:grid-cols-2 lg:grid-cols-3' : 'bg-paleblue p-8 rounded-xl grid grid-cols-1'}>
                        <div className='col-span-1 flex justify-center items-center lg:mt-[-70px]'>
                            <img
                                src={displayedUser?.profilePic || '/dummyImg.png'}
                                onMouseEnter={() => setChangePic(true)}
                                onMouseLeave={() => setChangePic(false)}
                                alt='profile image'
                                width={250}
                                height={250}
                                className='settingsImg shadow-md'
                            />

                        </div>
                        <div className='col-span-1 lg:col-span-2 xl:col-span-1 flex-col justify-center items-center gap-3'>
                            <div className='flex flex-col gap-4 py-4'>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="Username:" className='text-lg font-mainFont flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handleUsernameChange} theme={customInput} id="base" type="text" sizing="post" className='w-1/2' />
                                </div>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="First Name:" className='text-lg font-mainFont flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handleFirstNameChange} theme={customInput} id="base" type="text" sizing="post" className='w-1/2' />
                                </div>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="Last Name:" className='text-lg font-mainFont flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handleLastNameChange} theme={customInput} id="base" type="text" sizing="post" className='w-1/2' />
                                </div>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="Password:" className='text-lg font-mainFont flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handlePasswordChange} theme={customInput} id="base" type="text" sizing="post" className='w-1/2' />
                                </div>
                                <div className={pageSize ? 'flex items-center gap-2 py-2' : "grid grid-cols-1"}>
                                    <div className={pageSize ? "flex" : "col-span-1 text-center"}>
                                        <Label htmlFor="picture" value="Profile Picture:" className='text-lg font-mainFont flex-shrink-0 w-32 text-right' />
                                    </div>
                                    <input
                                        className={pageSize ? "flex" : "mt-3 col-span-1 flex justify-center"}
                                        id="picture"
                                        name="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePicChange}
                                    />
                                </div>
                            </div>

                            <div className='flex justify-end pt-5'>
                                <Button onClick={updateUserInfo} className='font-mainFont bg-darkblue focus:ring-0 enabled:hover:bg-darkerblue'>
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditSettings
