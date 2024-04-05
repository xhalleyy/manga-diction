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
                <Modal.Header className="darkBeige">Create New Club</Modal.Header>
                <Modal.Body className="darkBeige">
                    <div className="">
                        <div className="flex-col">
                            <label>Add Cover Image:</label>
                            <button>Select File</button>
                        </div>
                        <div className="">
                            <label>Club Name</label>
                            <div>
                                <input />
                            </div>
                        </div>
                        <div className="">
                            <label>Description</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input />
                            </div>
                        </div>
                        <div className="flex flex-1">
                            <label>Privacy Settings: </label>
                            {/* dropdown, 2 options (public, private) */}
                            <div>
                            <Dropdown label={!privateClub ? "Public" : "Private"} dismissOnClick={false}>
                                <Dropdown.Item onClick={publicSettingOn}>Public</Dropdown.Item>
                                <Dropdown.Item onClick={privateSettingOn}>Private</Dropdown.Item>
                            </Dropdown>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="darkBeige">
                    <div className="flex flex-1 justify-end">
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Create +
                    </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ClubModalComponent