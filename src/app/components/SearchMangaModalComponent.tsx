"use client"

import { Button, Modal } from 'flowbite-react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface SearchMangaModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// React.FC type to specify that the SearchMangaModalComponent is a functional component that accepts the props of type SearchMangaModalProps
const SearchMangaModalComponent: React.FC<SearchMangaModalProps> = ({ open, setOpen }) => {

    const [pageSize, setPageSize] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);

            const handleResize = () => {
                setPageSize(window.innerWidth > 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [])

    return (
        <div>

            <Modal show={open} onClose={() => setOpen(false)}>

                <Modal.Body className="darkBeige rounded-lg px-10">
                    <div className="flex justify-end justify-items-end">
                        <button className="text-xl" onClick={() => setOpen(false)}>X</button>
                    </div>
                    <div className="pb-5 pt-2 flex flex-1 justify-center">
                        <h1 className="text-center text-3xl font-mainFont font-bold">Find a Manga</h1>
                    </div>
                    <div className="pt-3">
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Search Manga</label>
                            <div>
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" id="titleSearch" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Author Name</label>
                            <div>
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Tags</label>
                            <div>
                                {/* wider + taller than club name input */}
                                <input className="opaqueWhite rounded-xl w-[100%] h-14" />
                            </div>
                        </div>
                        <div className={pageSize ? "grid grid-cols-3 rounded-xl  " : "grid grid-cols-2"}>

                            {/* dropdown, 2 options (public, private) */}
                            <div className={pageSize ? "col-span-1" : ""}>
                                <select className="rounded-xl w-36 text-sm opaqueWhite font-mainFont h-10  border-none">
                                    <option value="public" className="font-mainFont">Sort By</option>
                                </select>
                            </div>

                            <div className={pageSize ? "col-span-1" : ""}>
                                <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none">
                                    <option value="public" className="font-mainFont">Demographics</option>
                                </select>
                            </div>

                            <div className={pageSize ? "col-span-1" : "pt-3"}>
                                <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none">
                                    <option value="public" className="font-mainFont">Publication Status</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-1 justify-end mt-48">
                        <Link href="SearchManga">
                            <Button className="darkBlue rounded-xl" onClick={() => setOpen(false)}>
                                <span className="font-mainFont text-lg">Submit</span>
                                {/* <img alt="plus sign" src=""/> */}
                            </Button>
                        </Link>
                    </div>
                </Modal.Body>

            </Modal>


        </div>
    )
}

export default SearchMangaModalComponent
