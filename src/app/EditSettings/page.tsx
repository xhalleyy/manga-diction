'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { getUserInfo, updateUser } from '@/utils/DataServices'
import { IUserData } from '@/Interfaces/Interfaces'
import Image from 'next/image'
import { Label, TextInput } from 'flowbite-react'

const EditSettings = () => {

    const [userData, setUserData] = useState<IUserData>();
    const [changePic, setChangePic] = useState<boolean>(true);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  
    const [id, setId] = useState<number>(0);
    const [firstN, setFirstN] = useState<string>("");
    const [lastN, setLastN] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [profilePic, setProfilePic] = useState<string>("");
  

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

    const updateUserInfo = () => {

        let userData = {
            id: id,
            username: username,
            firstName: firstN,
            lastName: lastN,
            age: age,
            password: password,
            picture: profilePic
        }
        // const changeInfo = aysnc() => {
        //     const user = await updateUser()
        // }
    }

    return (
        <div className='bg-offwhite h-screen'>
            <NavbarComponent />

            <div className='mx-40 my-8'>
                <h1 className='text-darkbrown font-mainFont text-4xl ps-4 pb-2'>Settings</h1>
                <div className='bg-paleblue p-8 rounded-xl grid grid-cols-2'>
                    <div className='col-span-1 flex justify-center'>
                        <Image
                            src={userData?.picture || '/dummyImg.png'}
                            onMouseEnter={() => setChangePic(true)}
                            onMouseLeave={() => setChangePic(false)}
                            alt='profile image'
                            width={200}
                            height={200}
                            className='settingsImg shadow-md'
                        />

                    </div>
                    <div className='col-span-1 flex-col justify-center items-center gap-3'>
                        <div className='flex  items-center gap-3 py-4'>
                            <Label htmlFor="base" value="Username:" className='col-span-1 text-lg' />
                            <TextInput theme={customInput} id="base" type="text" sizing="post" className='col-span-11 w-1/2' />
                        </div>
                        <div className='flex items-center gap-3 py-4'>
                            <Label htmlFor="base" value="First Name:" className='col-span-1 text-lg' />
                            <TextInput theme={customInput} id="base" type="text" sizing="post" className='col-span-11 w-1/2' />
                        </div>
                        <div className='flex items-center gap-3 py-4'>
                            <Label htmlFor="base" value="Last Name:" className='col-span-1 text-lg' />
                            <TextInput theme={customInput} id="base" type="text" sizing="post" className='col-span-11 w-1/2' />
                        </div>

                        <div className='flex items-center gap-3 py-4'>
                            <Label htmlFor="base" value="Password:" className='col-span-1 text-lg' />
                            <TextInput theme={customInput} id="base" type="text" sizing="post" className='col-span-11 w-1/2' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditSettings
