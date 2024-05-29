'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { updateUser } from '@/utils/DataServices'
import { IUserData } from '@/Interfaces/Interfaces'
import Image from 'next/image'
import { Button, CustomFlowbiteTheme, Label, TextInput } from 'flowbite-react'
import { AlertTitle } from '@mui/material'
import Alert from '@mui/material/Alert'
import { notFound, useRouter } from 'next/navigation'
import { useClubContext } from '@/context/ClubContext'
import { Planet } from 'react-kawaii'
import { checkToken } from '@/utils/token'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip } from '@mui/material';


const EditSettings = () => {

    const { displayedUser, setDisplayedUser } = useClubContext();
    const [changePic, setChangePic] = useState<boolean>(true);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [failed, setFailed] = useState<boolean | undefined>(undefined);

    const [newPass, setNewPass] = useState<string | null>(null);
    const [currentPass, setCurrentPass] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<boolean | undefined>(false);

    const [username, setUsername] = useState<string| null>()
    const [firstName, setFirstName] = useState<string| null>()
    const [lastName, setLastName] = useState<string| null>()
    const [age, setAge] = useState<number | null>(null)
    const [currVisibility, setCurrVisibility] = useState<boolean>(false);
    const [newVisibility, setNewVisibility] = useState<boolean>(false);

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
                setUsername(value)
            }else{
                setUsername(null)
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
                setFirstName(value)
            }else {
                setFirstName(null)
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
                setLastName(value)
            }else {
                setLastName(null)
            }
        }
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (displayedUser) {
            if(value !== '' && /^\d*\.?\d+$/.test(value) && Number(value)){
                setAge(Number(value));
                setDisplayedUser((prevUserData: IUserData | null) => ({
                    ...prevUserData!,
                    age: Number(value)
                }))
            }else{
                setAge(null)
            }
        }
    }

    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPass(e.target.value);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPass(e.target.value);
    };

    const handlePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        const maxByteSize = 5 * 1024 * 1024;
        if (file) {
            if (file.size > maxByteSize) {
                alert("File is too big!");
                return "";
            } else {
                const reader = new FileReader();
                reader.onload = () => {
                    const imageData = reader.result as string;
                    setProfilePic(imageData);
                    // console.log("New profile picture data:", imageData);
                };
                reader.readAsDataURL(file); // Read file as base64-encoded string
            }
        }
    };

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
            if(username || firstName || lastName || age || profilePic || (currentPass && newPass)){
                const response = await updateUser(updatedUser);
                console.log(response);
    
                if (response) {
                    setSuccess(true);
                    setCurrentPass(null);
                    setNewPass(null); 
                    setPasswordError(false)
                    setTimeout(() => {
                        setSuccess(undefined);
                        setFailed(false)
                    }, 5000);
                } else {
                    console.error('Failed to update user.');
                    setSuccess(false);
                    setFailed(true)
                }
            }else{
                setFailed(true)
                setSuccess(false);
                setTimeout(() => {
                    setFailed(false)
                    setSuccess(undefined);
                }, 5000);
            }
        } catch (error) {
            console.error('Failed to update:', error);
            setSuccess(false);
            setPasswordError(true);
            setTimeout(() => {
                setPasswordError(undefined);
            }, 5000);
        }
    };

    if (!checkToken()) {
        notFound();
    }

    const customInput: CustomFlowbiteTheme["textInput"] = {
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
            <div className='bg-offwhite  min-h-screen relative'>

                <NavbarComponent />

                <div className={pageSize ? 'mx-40 py-8' : 'pt-5 mx-5'}>
                    <div className="w-full absolute flex justify-end items-end -mt-[px] right-40">
                        {success && (
                            <div className="w-72 rounded-xl">
                                <Alert className='rounded-xl bg-paleblue flex items-center' icon={<Planet size={30} mood="happy" color="#FCCB7E" />} severity="success">
                                    User settings successfully updated!
                                </Alert>
                            </div>
                        )}
                        {failed && (
                            <div className="w-72 rounded-xl">
                                <Alert className='rounded-xl bg-rose-200 flex items-center font-mainFont text-lg' icon={<Image src={'/fail.png'} width={30} height={30} alt='Failed to update'/>} severity="error">
                                    Fields were empty!
                                </Alert>
                            </div>
                        )}
                    </div>

                    <h1 className={pageSize ? 'text-darkbrown font-mainFont text-4xl pt-10 ps-4 pb-2' : 'text-center text-darkbrown font-mainFont text-4xl py-5'}>Account Settings</h1>
                    <div className={pageSize ? 'bg-paleblue p-8 rounded-xl grid lg:grid-cols-2' : 'bg-paleblue p-8 rounded-xl grid grid-cols-1'}>
                        <div className='col-span-1 flex justify-center items-center '>
                            <div className='flex flex-col items-center'>
                                <img
                                    src={displayedUser?.profilePic || '/noprofile.jpg'}
                                    onMouseEnter={() => setChangePic(true)}
                                    onMouseLeave={() => setChangePic(false)}
                                    alt='profile image'
                                    width={250}
                                    height={250}
                                    className='settingsImg shadow-md'
                                />

                                <div className={pageSize ? 'flex flex-col justify-center items-center gap-2 py-2 mt-4' : "grid grid-cols-1"}>
                                    <div className={pageSize ? "flex" : "col-span-1 text-center"}>
                                        <Label htmlFor="picture" value="Profile Picture:" className='text-lg font-poppinsMed flex-shrink-0 w-32 text-right' />
                                    </div>
                                    <input
                                        className={pageSize ? "flex xl:w-72 lg:w-52 w-72 rounded-xl bg-white" : "mt-3 col-span-1 flex justify-center"}
                                        id="picture"
                                        name="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePicChange}
                                    />
                                </div>
                                <div className={pageSize ? 'flex flex-col justify-center w-full items-center gap-2 py-2' : "flex justify-center items-center my-3"}>
                                    {/* <Label htmlFor="base" value="Age:" className='text-lg font-mainFont flex-shrink-0 text-right pr-2' /> */}
                                    <TextInput onKeyDown={(evt) => ["e", "E", "+", "-", ".", "0"].includes(evt.key) && evt.preventDefault()} onChange={handleAgeChange} theme={customInput} placeholder='Age' type="number" sizing="post" className='w-1/3 text-center flex justify-center items-center' />
                                </div>

                            </div>

                        </div>
                        <div className='col-span-1 xl:col-span-1 flex-col justify-center items-center gap-3'>
                            <div className='flex flex-col gap-4 py-4'>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="Username:" className='text-lg font-poppinsMed flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handleUsernameChange} theme={customInput} type="text" sizing="post" className='w-1/2' />
                                </div>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="First Name:" className='text-lg font-poppinsMed flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handleFirstNameChange} theme={customInput} type="text" sizing="post" className='w-1/2' />
                                </div>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="Last Name:" className='text-lg font-poppinsMed flex-shrink-0 w-32 text-right pr-2' />
                                    <TextInput onChange={handleLastNameChange} theme={customInput} type="text" sizing="post" className='w-1/2' />
                                </div>
                                {passwordError ?
                                    <p className='text-red-900'>Current password incorrect. Cannot change password.</p>
                                    : null}
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="Current Password:" className='text-lg font-poppinsMed flex-shrink-0 w-32 text-right pr-2' />
                                    <div className='w-1/2 relative' >
                                        {currVisibility ?
                                            <>
                                                <TextInput required onChange={handleCurrentPasswordChange} theme={customInput} type="text" sizing="post" className='w-[100%]' />
                                                <Tooltip onClick={() => {setCurrVisibility(!currVisibility)}} title='Hide Password' placement='top'>
                                                    <VisibilityOffIcon fontSize="medium" className="me-1 absolute right-3 bottom-2" />
                                                </Tooltip>
                                            </>
                                            :
                                            <>
                                                <TextInput required onChange={handleCurrentPasswordChange} theme={customInput} type="password" sizing="post" className='w-[100%]' />
                                                <Tooltip onClick={() => {setCurrVisibility(!currVisibility)}} title='Show Password' placement='top'>
                                                    <RemoveRedEyeIcon fontSize="medium" className="me-1 absolute right-3 bottom-2" />
                                                </Tooltip>
                                            </>

                                        }

                                    </div>
                                </div>
                                <div className='flex items-center gap-2 py-2'>
                                    <Label htmlFor="base" value="New Password:" className='text-lg font-poppinsMed flex-shrink-0 w-32 text-right pr-2' />
                                    <div className='w-1/2 relative' >
                                        {newVisibility ?
                                            <>
                                                <TextInput required onChange={handleNewPasswordChange} theme={customInput} type="text" sizing="post" className='w-[100%]' />
                                                <Tooltip onClick={() => {setNewVisibility(!newVisibility)}} title='Hide Password' placement='top'>
                                                    <VisibilityOffIcon fontSize="medium" className="me-1 absolute right-3 bottom-2" />
                                                </Tooltip>
                                            </>
                                            :
                                            <>
                                                <TextInput required onChange={handleNewPasswordChange} theme={customInput} type="password" sizing="post" className='w-[100%]' />
                                                <Tooltip onClick={() => {setNewVisibility(!newVisibility)}} title='Show Password' placement='top'>
                                                    <RemoveRedEyeIcon fontSize="medium" className="me-1 absolute right-3 bottom-2" />
                                                </Tooltip>
                                            </>

                                        }

                                    </div>
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
