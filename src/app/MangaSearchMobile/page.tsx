'use client'

import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { Button } from 'flowbite-react'
import { useClubContext } from '@/context/ClubContext';
import { notFound, useRouter } from 'next/navigation';
import { Chips } from 'primereact/chips';
import { checkToken } from '@/utils/token';
import { IGetManga } from '@/Interfaces/Interfaces';
import { searchManga } from '@/utils/DataServices';

const MangaSearchMobile = () => {

    const { title, setTitle, author, setAuthor, demographics, setDemographics, publication, setPublication, tags, setTags, setMangaInfo, mangaInfo } = useClubContext();
    const [pageSize, setPageSize] = useState<boolean>(false);
    const router = useRouter();

    const fetchManga = async () => {
        try {
            const searchInfo: IGetManga = {
                name: title,
                tagInput: tags,
                demographic: demographics,
                status: publication
            }

            const searchedManga = await searchManga(searchInfo)
            console.log(searchedManga)
            setMangaInfo(searchedManga.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

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
        fetchManga()
        console.log(mangaInfo)
        router.push('/SearchManga')
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    if (!checkToken()) {
        notFound();
      }
    

  return (
    <div className=' darkBlue h-screen'>
      <NavbarComponent/>
      
      <h2 className='text-center text-offwhite font-poppinsMed text-2xl my-10'>Find a Manga</h2>

      <div className="bg-offwhite mx-5 rounded-lg px-5">
      <div className="pt-3">
                        <div className="py-2">
                            <label className="font-mainFont text-lg">Search Manga Title</label>
                            <div>
                                <input value={title} onKeyDown={handleKeyPress} className="opaqueWhite rounded-lg w-[60%] h-8 px-3 text-mainFont" id="titleSearch" onChange={(e) => setTitle(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2 hidden">
                            <label className="font-mainFont text-lg">Author Name</label>
                            <div>
                                <input value={author} className="opaqueWhite rounded-xl w-[50%] h-8" onKeyDown={handleKeyPress} onChange={(e) => setAuthor(e.target.value)} />
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
                        <div className="grid grid-cols-1">

                            {/* dropdown, 2 options (public, private) */}

                            <div className="pt-5">
                                <select className="rounded-xl text-sm darkBeige font-mainFont h-10 border-none" onChange={(e) => setDemographics(e.target.value)}>
                                    <option value="" className="font-mainFont">Demographics</option>
                                    <option value="shounen" className="font-mainFont">Shounen</option>
                                    <option value="shoujo" className="font-mainFont">Shoujo</option>
                                    <option value="josei" className="font-mainFont">Josei</option>
                                    <option value="seinen" className="font-mainFont">Seinen</option>
                                </select>
                            </div>

                            <div className="pt-5">
                                <select className="rounded-xl text-sm darkBeige font-mainFont h-10 border-none" onChange={(e) => setPublication(e.target.value)}>
                                    <option value="" className="font-mainFont">Publication Status</option>
                                    <option value="ongoing" className="font-mainFont">Ongoing</option>
                                    <option value="hiatus" className="font-mainFont">Hiatus</option>
                                    <option value="completed" className="font-mainFont">Completed</option>
                                    <option value="cancelled" className="font-mainFont">Cancelled</option>
                                </select>
                            </div>


                        </div>
                    </div>
                    <div className="flex flex-1 justify-end mt-32 pb-5">
                        <Button className="darkBlue rounded-xl" onClick={handleSubmit}>
                            <span className="font-mainFont text-lg">Submit</span>
                        </Button>
                    </div>
      </div>
      
    </div>
  )
}

export default MangaSearchMobile
