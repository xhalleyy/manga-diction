"use client";

import { Button, Dropdown, Modal } from "flowbite-react";
import { useState } from "react";

function ClubModalComponent() {
    const [openModal, setOpenModal] = useState(false);
    const [privateClub, setPrivateClub] = useState<boolean>(false);

    const privateSettingOn= () => {
        setPrivateClub(true)
    }
    const publicSettingOn = () => {
        setPrivateClub(false)
    }

    return (
        <>
            <Button className="darkBlue rounded-xl" onClick={() => setOpenModal(true)}>
                <span className="font-mainFont text-[22px]">Create Club</span>
                <img alt="plus sign" src="" />
            </Button>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                
                <Modal.Body className="darkBeige rounded-2xl px-10">
                        <div className="flex justify-end justify-items-end">
                        <button className="text-xl" onClick={() => setOpenModal(false)}>X</button>
                        </div>
                    <div className="pb-5 pt-2 flex flex-1 justify-center">
                        <h1 className="text-center text-3xl font-mainFont font-bold">Create New Club</h1>
                    </div>
                    <div className="pt-3">
                        <div className="flex-col pb-3">
                            <label className="font-mainFont text-lg">Add Cover Image:</label>
                            <button className="opaqueWhite px-4 py-1 rounded-xl ms-2 font-mainFont">Select File</button>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Club Name:</label>
                            <div>
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Description:</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input className="opaqueWhite rounded-xl w-[100%] h-14" />
                            </div>
                        </div>
                        <div className="flex flex-1 pt-5">
                            <label className="mt-1 font-mainFont text-lg">Privacy Settings: </label>
                            {/* dropdown, 2 options (public, private) */}
                            <div className="opaqueWhite rounded-xl dropdownBtn flex justify-center ms-3 font-mainFont">
                            <Dropdown label={!privateClub ? "Public" : "Private"} style={{color: "black"}} dismissOnClick={false}>
                                <Dropdown.Item onClick={publicSettingOn}>Public</Dropdown.Item>
                                <Dropdown.Item onClick={privateSettingOn}>Private</Dropdown.Item>
                            </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end mt-48">
                    <Button className="darkBlue rounded-xl" onClick={() => setOpenModal(false)}>
                        <span className="font-mainFont text-lg">Create</span>
                        <img alt="plus sign" src=""/>
                    </Button>
                    </div>
                </Modal.Body>
               
            </Modal>
        </>
    );
}

export default ClubModalComponent