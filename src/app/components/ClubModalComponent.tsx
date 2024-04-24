"use client";

import { Button, Dropdown, FileInput, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { IClubs } from "@/Interfaces/Interfaces";
import { updateClubs } from "@/utils/DataServices";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from "next/navigation";
import { useClubContext } from "@/context/ClubContext";

function ClubModalComponent() {
    const [openModal, setOpenModal] = useState(false);
    const [clubItems, setClubItems] = useState<IClubs[]>([]);
    const clubData = useClubContext();

    const [id, setId] = useState<number>(0);
    const [clubName, setClubName] = useState<string>("");
    const [clubDescription, setClubDescription] = useState<string>("");
    const [clubImg, setClubImg] = useState<any>("");
    const [privateClub, setPrivateClub] = useState<boolean>(false);
    const [dateCreated, setDateCreated] = useState<string>("");

    const router = useRouter();

    // useEffect(()=> {
    //     const fetchClubs = async () => {
    //         try {
    //             const userLoggedIn = loggedInData();

    //             if(userLoggedIn && userLoggedIn.leaderId){
    //                 const clubs = await getClubItemsByLeaderId(userLoggedIn.leaderId);
    //                 setClubItems(prevClubItems => [...prevClubItems, clubs]);

    //             }
    //         } catch (error) {
    //             console.error('Error fetching club data!')
    //         }
    //     }

    //     fetchClubs();
    // }, [])

    const privateSettingOn = () => {
        setPrivateClub(true)
    }
    const publicSettingOn = () => {
        setPrivateClub(false)
    }


    const handleClubName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubName(e.target.value);
    }

    const handleClubDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubDescription(e.target.value);
    }

    const handleClubImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();
        const file = e.target.files?.[0];

        if (file) {
            reader.onload = () => {
                setClubImg(reader.result)
                console.log(reader.result);
            }
            reader.readAsDataURL(file);
        }

    }

    const handleCreateClub = async () => {
        let userId = Number(localStorage.getItem("UserId"));
        const newClub: IClubs = {
            id: id,
            leaderId: userId,
            clubName: clubName,
            description: clubDescription,
            dateCreated: dateCreated,
            image: clubImg,
            isPublic: true,
            isDeleted: false
        };
        setClubItems(prevClubItems => [...prevClubItems, newClub]);

        try {
            let result = await updateClubs(newClub)

            if (result) {
                clubData.setDisplayedClub(newClub)
                router.push('/ClubPage')
            }
        } catch (error) {
            alert("Creating Group Unsuccessful!")
        }

    }

    return (
        <>
            <Button className="darkBlue rounded-xl enabled:hover:bg-darkerblue focus:ring-0" onClick={() => setOpenModal(true)}>
                <span className="font-mainFont text-[22px]">Create Club</span>
                {/* <img alt="plus sign" src={AddIcon} /> */}
                <AddIcon className="ms-2" />
            </Button>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>

                <Modal.Body className="darkBeige rounded-lg px-10">
                    <div className="flex justify-end justify-items-end">
                        <button className="text-xl" onClick={() => setOpenModal(false)}>X</button>
                    </div>
                    <div className="pb-5 pt-2 flex flex-1 justify-center">
                        <h1 className="text-center text-3xl font-mainFont font-bold">Create New Club</h1>
                    </div>
                    <div className="pt-3">

                        <div className=" pb-3 inline-flex">
                            <div>
                                <label className="font-mainFont text-lg">Add Cover Image:</label>
                            </div>

                            <div>
                                <label className="opaqueWhite px-4 py-1 rounded-xl ms-2 font-mainFont">
                                    Select File
                                    <input
                                        required
                                        type="file"
                                        onChange={handleClubImg}
                                        className="hidden"
                                        accept="image/png, image/jpeg" // Add your accepted file types here
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="py-2">
                            <label className="font-mainFont text-lg">Club Name:</label>
                            <div>
                                <input required onChange={handleClubName} className="opaqueWhite rounded-xl w-[50%] h-8" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Description:</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input required onChange={handleClubDescription} className="opaqueWhite rounded-xl w-[100%] h-14" />
                            </div>
                        </div>
                        <div className="flex flex-1 pt-5">
                            <label className="mt-1 font-mainFont text-lg">Privacy Settings: </label>
                            {/* dropdown, 2 options (public, private) */}
                            <div className="rounded-xl dropdownBtn flex justify-center ms-3">
                                <select required className="rounded-xl opaqueWhite font-mainFont h-9 px-4 border-none">
                                    <option value="public" className="font-mainFont" onClick={publicSettingOn}>Public</option>
                                    <option value="priv" onClick={privateSettingOn}>Private</option>
                                </select>
                                {/* <Dropdown label={!privateClub ? "Public" : "Private"} style={{color: "black"}} dismissOnClick={false}>
                                <Dropdown.Item onClick={publicSettingOn}>Public</Dropdown.Item>
                                <Dropdown.Item onClick={privateSettingOn}>Private</Dropdown.Item>
                            </Dropdown> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end mt-48">
                        <Button className="darkBlue rounded-xl" onClick={() => { handleCreateClub(); setOpenModal(false) }}>
                            <span className="font-mainFont text-lg">Create</span>
                            {/* <img alt="plus sign" src=""/> */}
                            <AddIcon className="ms-1" />
                        </Button>
                    </div>
                </Modal.Body>

            </Modal>
        </>
    );
}

export default ClubModalComponent