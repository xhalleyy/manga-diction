"use client";

import { Button, Dropdown, FileInput, Modal } from "flowbite-react";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { IClubs } from "@/Interfaces/Interfaces";
import { getClubItemsByLeaderId, loggedInData, updateClubs } from "@/utils/DataServices";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ClubModalComponent() {
    const [openModal, setOpenModal] = useState(false);
    const [clubItems, setClubItems] = useState<IClubs[]>();

    const [clubName, setClubName] = useState<string>("");
    const [clubDescription, setClubDescription] = useState<string>("");
    const [clubImg, setClubImg] = useState<any>("");
    const [privateClub, setPrivateClub] = useState<boolean>(false);

    const uploadFiles = styled(Button)({
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    });


    const privateSettingOn = () => {
        setPrivateClub(true)
    }
    const publicSettingOn = () => {
        setPrivateClub(false)
    }

    const handleCreateClub = async (clubs: IClubs) => {
        let result = await updateClubs(clubs)

        if (result) {
            const loggedIn = loggedInData();
            let userClubs: IClubs[] = await getClubItemsByLeaderId(loggedIn.leaderId)
            let filteredClubs = userClubs.filter(club => club.isDeleted == false)
            setClubItems(filteredClubs);
        }

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
                                <input onChange={handleClubName} className="opaqueWhite rounded-xl w-[50%] h-8" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Description:</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input onChange={handleClubDescription} className="opaqueWhite rounded-xl w-[100%] h-14" />
                            </div>
                        </div>
                        <div className="flex flex-1 pt-5">
                            <label className="mt-1 font-mainFont text-lg">Privacy Settings: </label>
                            {/* dropdown, 2 options (public, private) */}
                            <div className="rounded-xl dropdownBtn flex justify-center ms-3">
                                <select className="rounded-xl opaqueWhite font-mainFont h-9 px-4 border-none">
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
                        <Button  className="darkBlue rounded-xl" onClick={() => handleCreateClub}>
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