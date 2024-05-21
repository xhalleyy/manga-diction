'use client'

import React, { MouseEventHandler, useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import Link from 'next/link'
import axios from 'axios';
import { getAuthorIds, getTags, getTagsIds, mangaSearch, specificManga } from '@/utils/DataServices';
import { IManga } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';
import { useRouter } from 'next/navigation';


const SearchManga = () => {
    const { title, demographics, publication, tags, mangaId, setMangaId } = useClubContext();
    const [mangaList, setMangaList] = useState<IManga[]>([]);
    const [coverArtList, setCoverArtList] = useState<string[]>([]);
    // const tempID: string = '304ceac3-8cdb-4fe7-acf7-2b6ff7a60613';
    const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    const maxTitleLength = 30;
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch tag IDs based on the tags array
                const tagIDs = await getTagsIds(tags);

                // Convert demographics and publication to arrays with a single element
                const demographicsArray = demographics ? [demographics] : [];
                const publicationArray = publication ? [publication] : [];

                // Call mangaSearch with the retrieved tag IDs
                const fetchedData = await mangaSearch(
                    title,
                    tagIDs, // Use the retrieved tag IDs directly
                    demographicsArray,
                    publicationArray,
                    ['safe', 'suggestive', 'erotica']
                );

                // Map through each manga ID and fetch manga details and cover file
                const mangaPromises = fetchedData.map(async (mangaId: string) => {
                    const mangaData = await specificManga(mangaId);
                    return mangaData;
                });

                const mangaResults = await Promise.all(mangaPromises);
                console.log(mangaResults);
                setMangaList(mangaResults);

                // Fetch cover files for each manga
                const coverPromises = mangaResults.map(async (manga: IManga) => {
                    const coverFileName = findCoverArt(manga);
                    return coverFileName;
                });

                const coverResults = await Promise.all(coverPromises);
                setCoverArtList(coverResults.filter(Boolean) as string[]); // Explicitly cast to string[]
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [title, demographics, publication, tags]);


    const findCoverArt = (manga: IManga): string | undefined => {
        const relationships = manga.data.relationships;
        const coverArt = relationships.find(rel => rel.type === 'cover_art');
        if (coverArt) {
            return coverArt.attributes.fileName;
        } else {
            return undefined;
        }
    };

    const handleMangaSubmit = (mangaId: string) => {
       setMangaId(mangaId);
    //    console.log({mangaId});
        router.push('/MangaInfo');
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

                            {mangaList.map((manga: IManga, index: number) => (
                                <div key={index} className='flex justify-center' onClick={() => handleMangaSubmit(manga.data.id)}>
                                        <div className='px-0 mx-0 cursor-pointer'>
                                            <img src={`https://uploads.mangadex.org/covers/${manga.data.id}/${coverArtList[index]}`} alt='Title of Manga' className='w-[177px] h-64' />
                                            <h2 className='text-center text-xl font-semibold max-w-[170px] mt-2 text-darkbrown font-mainFont'>
                                                {manga.data.attributes.title.en.length > maxTitleLength
                                                    ? `${manga.data.attributes.title.en.substring(0, maxTitleLength)}...`
                                                    : manga.data.attributes.title.en
                                                }
                                            </h2>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchManga
