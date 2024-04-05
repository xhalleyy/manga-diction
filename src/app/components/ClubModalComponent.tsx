"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

function ClubModalComponent() {
    const [openModal, setOpenModal] = useState(false);

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
                        <div>
                            <label>Club Name</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="darkBeige">
                    <Button onClick={() => setOpenModal(false)}>I accept</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ClubModalComponent