"use client "

import { IClubs } from "@/Interfaces/Interfaces";
import { useClubContext } from "@/context/ClubContext";
import { updateClubs } from "@/utils/DataServices";
import { error } from "console";
import { Label, TextInput } from "flowbite-react"
import { describe } from "node:test";
import { spec } from "node:test/reporters";
import { useEffect, useState } from "react";
import {Chocolate} from 'react-kawaii'

interface successProps {
    updateSuccess: () => void
}

const EditClubSettingsComponent: React.FC<successProps> = ({updateSuccess}) => {

    const { displayedClub, setDisplayedClub } = useClubContext();
    const [pageSize, setPageSize] = useState<boolean>(false);
    const [clubImg, setClubImg] = useState<string>('');
    const [clubName, setClubName] = useState<string>(displayedClub?.clubName || '');
    const [clubDesc, setClubDesc] = useState<string>(displayedClub?.description || '');
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean | undefined>(undefined);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);
            const handleResize = () => {
                setPageSize(window.innerWidth > 768)
            }
            window.addEventListener('resize', handleResize)
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    useEffect(() => {
        if (displayedClub) {
            setClubName('');
            setClubDesc('');
            setClubImg('');
        }
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubName(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubDesc(e.target.value);
    }

    const handleClubImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        // Check if a file is selected
        if (!file) {
            alert("Please select a file.");
            return;
        }

        // Check file size (limit to 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSizeInBytes) {
            alert("File size exceeds the limit. Please choose a smaller file.");
            e.target.value = ''; // Clear the input value
            return;
        }

        // Check file type (accept only PNG and JPEG)
        const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!acceptedTypes.includes(file.type)) {
            alert("Please select a PNG or JPEG file.");
            e.target.value = ''; // Clear the input value
            return;
        }

        let reader = new FileReader();
        reader.onload = () => {
            setClubImg(reader.result as string);
            // console.log(reader.result);
        }
        reader.readAsDataURL(file);
    };

    const updateClubInfo = async () => {
        try {
            // using .trim() to remove whitespace so that if the user wants to only edit one aspect, it won't change the other
            if (!clubName.trim() && !clubDesc.trim() && !clubImg) {
                setErrorMessage(!errorMessage)
                setTimeout(() => {
                    setErrorMessage(undefined);
                }, 3000);
                return;
            }
                const updatedClub = {
                    ...displayedClub!,
                    clubName: clubName.trim() || displayedClub!.clubName,
                    description: clubDesc.trim() || displayedClub!.description,
                    image: clubImg || displayedClub!.image,
                };

                await updateClubs(updatedClub);
                setDisplayedClub(updatedClub)
                setIsUpdated(true);
                
                setClubDesc('')
                setClubName('')
                
                updateSuccess();
        } catch (error) {
            console.error('Failed to update:', error);
        }
    };

    return (
        <div className={pageSize ? "bg-mutedblue px-5 pb-5 pt-2 rounded-xl font-mainFont" : "bg-ivory px-5 pb-5 pt-5 my-3 rounded-lg font-mainFont"}>
            <div className="pb-3">
                {errorMessage && <p className="text-re text-red-900"> Nothing to update. Please enter a new club name, description or image before updating.</p>}
                <Label htmlFor="base" value="Club Name:" className='col-span-1 text-lg mt-1' />
                <TextInput onChange={handleTitleChange} value={clubName} placeholder="Enter new club name" id="base" type="text" sizing="post" className={pageSize ? 'col-span-9' : 'col-span-4'} required />
            </div>

            <div className="pb-3">
                <Label htmlFor="base" value="Description:" className='col-span-1 text-lg mt-1' />
                <TextInput onChange={handleDescriptionChange} value={clubDesc} placeholder="Enter new description" id="base" type="text" sizing="post" className={pageSize ? 'col-span-9' : 'col-span-4'} required />
            </div>

            <div className={pageSize ? "grid grid-cols-4" : "grid grid-cols-2"}>
                <div className="col-span-1">
                    <label className="font-mainFont text-lg">Add Cover Image:</label>
                </div>

                <label className="col-span-1 opaqueWhite px-4 py-1 rounded-xl ms-2 font-mainFont">
                    Select New Image
                    <input
                        required
                        type="file"
                        onChange={handleClubImg}
                        className="hidden"
                        accept="image/png, image/jpeg" // Add your accepted file types here
                    />
                </label>
            </div>
            
            <div className="flex justify-end">
                <button onClick={updateClubInfo} className={pageSize ? 'bg-offwhite enabled:hover:bg-ivory px-3 py-1.5 mt-2 font-poppinsMed text-darkbrown rounded-md' : 'bg-offwhite enabled:hover:bg-ivory px-3 py-1.5 mt-4 font-poppinsMed text-darkbrown rounded-md'}>Update Club</button>

            </div>
        </div>
    )
}

export default EditClubSettingsComponent
