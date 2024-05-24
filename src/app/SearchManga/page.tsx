'use client'

import React, { MouseEventHandler, useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import Link from 'next/link'
import axios from 'axios';
import { searchManga, specificManga } from '@/utils/DataServices';
import { IGetManga, IManga } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';
import { notFound, useRouter } from 'next/navigation';
import MangaInfo from '../MangaInfo/page';
import { checkToken } from '@/utils/token';


const SearchManga = () => {
    const { title, demographics, publication, tags, mangaId, setMangaId, mangaInfo, setMangaInfo } = useClubContext();
    // const [mangaList, setMangaList] = useState<IManga[]>([]);
    const [coverArtList, setCoverArtList] = useState<string[]>([]);
    // const tempID: string = '304ceac3-8cdb-4fe7-acf7-2b6ff7a60613';
    const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    const maxTitleLength = 30;
    const router = useRouter();

    const findCoverArt = (manga: IManga): string | undefined => {
        const relationships = manga.relationships;
        const coverArt = relationships.find(rel => rel.type === 'cover_art');
        if (coverArt) {
            return coverArt.attributes.fileName;
        } else {
            return undefined;
        }
    };

    const handleMangaSubmit = (mangaId: string) => {
        setMangaId(mangaId);
        router.push('/MangaInfo');
    }

    if (!checkToken()) {
        notFound();
    }

    return (

        <>
            <div className='bg-offwhite  min-h-screen'>

                <NavbarComponent />


                <div className='pt-6'>
                    <div className='pt-6'>
                        <h1 className='px-16 text-[26px] font-poppinsMed text-darkbrown '>Manga Results for &apos;{formattedTitle}&apos;</h1>

                        <div className="grid lg:grid-cols-5 grid-cols-1 px-[70px] mt-8 pb-6 gap-4">
                            {/* search results, 5 per 'row' */}
                            {/* if no matches found, display 'hidden' h1 with a message similar to "Can't find what you're looking for? Double check your spelling" */}
                            {/* 1st result */}
                            {
                                mangaInfo.map((manga: IManga, index: number) => {
                                    //    console.log(`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(rel => rel.type === "cover_art")?.attributes.fileName}`)
                                    return (
                                        <div key={index} className='flex justify-center' onClick={() => handleMangaSubmit(manga.id)}>
                                            <div className='px-0 mx-0 cursor-pointer'>
                                                <img src={`https://manga-covers.vercel.app/api/proxy?url=https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(rel => rel.type === "cover_art")?.attributes.fileName}`} alt='Title of Manga' className='w-[177px] h-64' />
                                                <h2 className='text-center text-xl font-semibold max-w-[170px] mt-2 text-darkbrown font-mainFont'>
                                                    {manga.attributes.title?.en && manga.attributes.title.en.length > maxTitleLength
                                                        ? `${manga.attributes.title.en.substring(0, maxTitleLength)}...`
                                                        : manga.attributes.title?.en || 'Default Title'}
                                                </h2>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchManga
