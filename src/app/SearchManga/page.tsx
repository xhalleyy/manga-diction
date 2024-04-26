'use client'
import React, { useEffect } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import Link from 'next/link'
import axios from 'axios';
import { getTags, mangaSearch, specificManga } from '@/utils/DataServices';


const SearchManga = () => {

    useEffect(()=> {
        async function fetchData() {
            try {
                const includedTagNames = ['391b0423-d847-456f-aff0-8b0cfc03066b'];
                const fetchedTags = await getTags(includedTagNames);
                const fetchedData = await mangaSearch('shingeki', '31e059c9-6040-4765-b7bd-40a16d657a94', fetchedTags.includedTagIDs, ['completed'], ['safe', 'suggestive', 'erotica']);
                // shows the list of manga IDs in the console
                console.log(fetchedData);
                return fetchedData;
            } catch (error) {
                // console.error('Error fetching data:', error);
                return null;
            }
        }
        async function getManga () {
            try {
                const fetchedManga = await specificManga("304ceac3-8cdb-4fe7-acf7-2b6ff7a60613");
                console.log(fetchedManga)
            } catch (error) {
                console.log("Error");
            }
        }
        fetchData();
        getManga();
    },[])

    return (
        <div className='bg-offwhite h-screen'>

            <NavbarComponent />

            <div className='mt-5'>
                <h1 className='px-16 text-[26px] font-poppinsMed text-darkbrown '>Manga Results for &apos;{ }&apos;</h1>

                <div className="grid grid-cols-5 px-[70px] mt-8">
                    {/* search results, 5 per 'row' */}
                    {/* if no matches found, display 'hidden' h1 with a message similar to "Can't find what you're looking for? Double check your spelling" */}

                    {/* 1st result */}
                    <div className='flex justify-center'>
                        <Link href='MangaInfo'>
                        <div className='px-0 mx-0'>
                            <img src='/aot.png' alt='Title of Manga' className='w-[177px] h-64' />
                            <h2 className='text-center text-xl font-semibold max-w-[170px] mt-2 text-darkbrown font-mainFont'>Attack on Titan</h2>
                        </div>
                        </Link>
                    </div>


                </div>

            </div>


        </div>
    )
}

export default SearchManga
