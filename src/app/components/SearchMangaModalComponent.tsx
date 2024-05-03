"use client"

import { Button, Modal } from 'flowbite-react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import {Chips} from 'primereact/chips'

interface SearchMangaModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// React.FC type to specify that the SearchMangaModalComponent is a functional component that accepts the props of type SearchMangaModalProps
const SearchMangaModalComponent: React.FC<SearchMangaModalProps> = ({ open, setOpen }) => {

    const [titleInput, setTitleInput] = useState<string>('');
    const [authorInput, setAuthorInput] = useState<string>('');
    const [tagsInput, setTagsInput] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('');
    const [demographicOptions, setDemographicOptions] = useState<string>('');
    const [publishStatus, setPublishStatus] = useState<string>('');
    const [value, setValue] = useState<any>([]);
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
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" id="titleSearch" onChange={(e) => setTitleInput(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Author Name</label>
                            <div>
                                <input className="opaqueWhite rounded-xl w-[50%] h-8" onChange={(e) => setAuthorInput(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Tags</label>
                            <div>
                                {/* wider + taller than club name input */}
                                {/* <input className="opaqueWhite rounded-xl w-[100%] h-14" onChange={(e) => setTagsInput(e.target.value)} /> */}
                                <Chips className="opaqueWhite rounded-xl w-[100%] h-14 p-fluid" value={value} onChange={(e) => setValue(e.value)} separator="," />
                            </div>
                        </div>
                        <div className={pageSize ? "grid grid-cols-2 rounded-xl  " : "grid grid-cols-2"}>

                            {/* dropdown, 2 options (public, private) */}

                            <div className={pageSize ? "col-span-1" : ""}>
                                <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none">
                                    <option value="public" className="font-mainFont">Demographics</option>
                                    <option value="public" className="font-mainFont" onClick={() => setDemographicOptions("shounen")}>Shounen</option>
                                    <option value="public" className="font-mainFont" onClick={() => setDemographicOptions("shoujo")}>Shoujo</option>
                                    <option value="public" className="font-mainFont" onClick={() => setDemographicOptions("josei")}>Josei</option>
                                    <option value="public" className="font-mainFont" onClick={() => setDemographicOptions("seinen")}>Seinen</option>
                                </select>
                            </div>

                            <div className={pageSize ? "col-span-1" : "pt-3"}>
                                <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none">
                                    <option value="public" className="font-mainFont">Publication Status</option>
                                    <option value="public" className="font-mainFont" onClick={() => setPublishStatus("ongoing")}>Ongoing</option>
                                    <option value="public" className="font-mainFont" onClick={() => setPublishStatus("hiatus")}>Hiatus</option>
                                    <option value="public" className="font-mainFont" onClick={() => setPublishStatus("completed")}>Completed</option>
                                    <option value="public" className="font-mainFont" onClick={() => setPublishStatus("cancelled")}>Cancelled</option>
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
