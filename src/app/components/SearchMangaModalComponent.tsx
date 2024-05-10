"use client"

import { Button, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Chips, ChipsChangeEvent } from 'primereact/chips'
import { useClubContext } from '@/context/ClubContext';
import { useRouter } from 'next/navigation';

interface SearchMangaModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// React.FC type to specify that the SearchMangaModalComponent is a functional component that accepts the props of type SearchMangaModalProps
const SearchMangaModalComponent: React.FC<SearchMangaModalProps> = ({ open, setOpen }) => {

    const { title, setTitle, author, setAuthor, demographics, setDemographics, publication, setPublication, tags, setTags } = useClubContext();
    // const [titleInput, setTitleInput] = useState<string>('');
    // const [authorInput, setAuthorInput] = useState<string>('');
    // const [tagsInput, setTagsInput] = useState<string>('');
    // const [demographicOptions, setDemographicOptions] = useState<string>('');
    // const [publishStatus, setPublishStatus] = useState<string>('');
    const [value, setValue] = useState<any>([]);
    const [pageSize, setPageSize] = useState<boolean>(false);
    const router = useRouter();

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

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputTags = e.target.value.trim(); // Remove leading/trailing whitespace
        const newTagsArray = inputTags.split(',').map(tag => tag.trim()); // Split by comma and trim whitespace
        setTags(newTagsArray);
    }

    const handleSubmit = () => {
        console.log({
            title,
            author,
            demographics,
            publication,
            tags
        })
        setOpen(false)
        router.push('/SearchManga')
    }

    return (
        <div>

            <Modal show={open} onClose={() => setOpen(false)} className='mobileBgColor'>

                <Modal.Body className="darkBeige rounded-lg px-10">
                    <div className="flex justify-end justify-items-end">
                        <button className="text-xl" onClick={() => setOpen(false)}>X</button>
                    </div>
                    <div className="pb-5 pt-2 flex flex-1 justify-center">
                        <h1 className="text-center text-3xl font-mainFont font-bold">Find a Manga</h1>
                    </div>
                    <div className="pt-3">
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Search Manga Title</label>
                            <div>
                                <input value={title} className="opaqueWhite rounded-xl w-[50%] h-8" id="titleSearch" onChange={(e) => setTitle(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Author Name</label>
                            <div>
                                <input value={author} className="opaqueWhite rounded-xl w-[50%] h-8" onChange={(e) => setAuthor(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Tags</label>
                            <div>
                                {/* wider + taller than club name input */}
                                {/* <input className="opaqueWhite rounded-xl w-[100%] h-14" onChange={(e) => setTagsInput(e.target.value)} /> */}
                                <Chips className="opaqueWhite rounded-xl w-[100%] h-14 p-fluid" value={tags} // Ensure value is an array of strings
                                    onChange={(e) => setTags(e.value || [])} separator="," />
                            </div>
                        </div>
                        <div className={pageSize ? "grid grid-cols-2 rounded-xl  " : "grid grid-cols-1"}>

                            {/* dropdown, 2 options (public, private) */}

                            <div className={pageSize ? "col-span-1" : "pt-4"}>
                                <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none" onChange={(e) => setDemographics(e.target.value)}>
                                    <option value="" className="font-mainFont">Demographics</option>
                                    <option value="shounen" className="font-mainFont">Shounen</option>
                                    <option value="shoujo" className="font-mainFont">Shoujo</option>
                                    <option value="josei" className="font-mainFont">Josei</option>
                                    <option value="seinen" className="font-mainFont">Seinen</option>
                                </select>
                            </div>

                            <div className={pageSize ? "col-span-1" : "pt-3"}>
                                <select className="rounded-xl text-sm opaqueWhite font-mainFont h-10 border-none" onChange={(e) => setPublication(e.target.value)}>
                                    <option value="" className="font-mainFont">Publication Status</option>
                                    <option value="ongoing" className="font-mainFont">Ongoing</option>
                                    <option value="hiatus" className="font-mainFont">Hiatus</option>
                                    <option value="completed" className="font-mainFont">Completed</option>
                                    <option value="cancelled" className="font-mainFont">Cancelled</option>
                                </select>
                            </div>


                        </div>
                    </div>
                    <div className="flex flex-1 justify-end mt-48">
                        {/* <Link href="SearchManga"> */}
                        <Button className="darkBlue rounded-xl" onClick={handleSubmit}>
                            <span className="font-mainFont text-lg">Submit</span>
                            {/* <img alt="plus sign" src=""/> */}
                        </Button>
                        {/* </Link> */}
                    </div>
                </Modal.Body>

            </Modal>


        </div>
    )
}

export default SearchMangaModalComponent
