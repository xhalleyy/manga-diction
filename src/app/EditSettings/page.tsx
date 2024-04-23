'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { getUserInfo, updateUser } from '@/utils/DataServices'
import { IUserData } from '@/Interfaces/Interfaces'
import Image from 'next/image'
import {  Button, Label, TextInput } from 'flowbite-react'
import { AlertTitle } from '@mui/material'
import Alert from '@mui/material/Alert'

const EditSettings = () => {

    const [userData, setUserData] = useState<IUserData>({
        id: 0,
        username: "",
        firstName: "",
        lastName: "",
        age: 0,
        password: "",
        picture: ""
    }
    );
    const [changePic, setChangePic] = useState<boolean>(true);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [id, setId] = useState<number>(0);
    const [firstN, setFirstN] = useState<string>("");
    const [lastN, setLastN] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [profilePic, setProfilePic] = useState<string>(() => {
        return localStorage.getItem('profilePic') || '/dummyImg.png'
    });

    const [success, setSuccess] = useState<boolean | undefined>(undefined);


    useEffect(() => {
        let userId = Number(localStorage.getItem("UserId"));
        const fetchedUser = async () => {
            const user = await getUserInfo(userId);
            setUserData(user);
        }
        fetchedUser();
    }, [])

    const customInput = {
        "field": {
            "input": {
                "sizes": {
                    "post": "py-1 px-2 text-lg font-mainFont"
                }
            }
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            username: value
        }));
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            firstName: value
        }))
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            lastName: value
        }))
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            password: value
        }))
    };

    const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const picData = reader.result as string;
                setUserData(prevUserData => ({
                    ...prevUserData,
                    picture: picData
                }));
                localStorage.setItem('profilePic', picData)
                setProfilePic(picData)
            };
            reader.readAsDataURL(file);
        }

    }


    const updateUserInfo = () => {
        try {
            const changeInfo = async () => {
                const user = await updateUser(userData)
                return user;
            }
            changeInfo();
            setSuccess(true);
        } catch (error) {
            console.error('Failed to update:', error)
            setSuccess(false)
        }
    }

    return (
        <div className='bg-offwhite h-screen'>
            <NavbarComponent />

            <div className='mx-40 my-8'>
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
                <h1 className='text-darkbrown font-mainFont text-4xl ps-4 pb-2'>Account Settings</h1>
                <div className='bg-paleblue p-8 rounded-xl grid grid-cols-2'>
                    <div className='col-span-1 flex justify-center'>
                        <Image
                            src={profilePic}
                            onMouseEnter={() => setChangePic(true)}
                            onMouseLeave={() => setChangePic(false)}
                            alt='profile image'
                            width={200}
                            height={200}
                            className='settingsImg shadow-md'
                        />

                    </div>
                    <div className='col-span-1 flex-col justify-center items-center gap-3'>
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
                            <div className='flex items-center gap-2 py-2'>
                                <div className="flex">
                                    <Label htmlFor="picture" value="Profile Picture:" className='text-lg font-mainFont flex-shrink-0 w-32 text-right' />
                                </div>
                                <input
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
    )
}

export default EditSettings
