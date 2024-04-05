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
            <Button className="darkBlue" onClick={() => setOpenModal(true)}>Create Club +</Button>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                
                <Modal.Body className="darkBeige">
                        <div className="flex justify-end justify-items-end">
                        <button className="text-xl" onClick={() => setOpenModal(false)}>X</button>
                        </div>
                    <div className="py-4 flex flex-1 justify-center">
                        <h1 className="text-center text-3xl">Create New Club</h1>
                    </div>
                    <div className="">
                        <div className="flex-col">
                            <label>Add Cover Image:</label>
                            <button className="opaqueWhite px-4 py-1 rounded-xl">Select File</button>
                        </div>
                        <div className="">
                            <label>Club Name</label>
                            <div>
                                <input className="opaqueWhite rounded-xl" />
                            </div>
                        </div>
                        <div className="">
                            <label>Description</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input className="opaqueWhite rounded-xl" />
                            </div>
                        </div>
                        <div className="flex flex-1">
                            <label>Privacy Settings: </label>
                            {/* dropdown, 2 options (public, private) */}
                            <div className="opaqueWhite rounded-xl dropdownBtn flex justify-center">
                            <Dropdown label={!privateClub ? "Public" : "Private"} style={{color: "black"}} dismissOnClick={false}>
                                <Dropdown.Item onClick={publicSettingOn}>Public</Dropdown.Item>
                                <Dropdown.Item onClick={privateSettingOn}>Private</Dropdown.Item>
                            </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end">
                    <Button className="darkBlue" onClick={() => setOpenModal(false)}>
                        Create +
                    </Button>
                    </div>
                </Modal.Body>
               
            </Modal>
        </>
    );
}

export default ClubModalComponent