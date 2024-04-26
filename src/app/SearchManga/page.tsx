'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import Link from 'next/link'
import axios from 'axios';
import { getTags, mangaSearch, specificManga } from '@/utils/DataServices';
import { IManga } from '@/Interfaces/Interfaces';


const SearchManga = () => {
    const [manga, setManga] = useState<IManga>();
    const [coverId, setCoverId] = useState<string>("");
    const [coverFile, setCoverFile] = useState<string>("");
    let files: any = ''

    useEffect(() => {
        async function fetchData() {
            try {
                const includedTagNames = ['391b0423-d847-456f-aff0-8b0cfc03066b'];
                const fetchedTags = await getTags(includedTagNames);
                const fetchedData = await mangaSearch('shingeki', '31e059c9-6040-4765-b7bd-40a16d657a94', fetchedTags.includedTagIDs, ['completed'], ['safe', 'suggestive', 'erotica']);
                // shows the list of manga IDs in the console
                // console.log(fetchedData);
                return fetchedData;
            } catch (error) {
                // console.error('Error fetching data:', error);
                return null;
            }
        }
        async function getManga() {
            try {
                const fetchedManga = await specificManga("304ceac3-8cdb-4fe7-acf7-2b6ff7a60613");
                console.log(fetchedManga)
                setManga(fetchedManga);
            } catch (error) {
                console.log("Error");
            }
        }

        // filter through fetchedManga's relationships[] for type: "cover_art", id: and fileName: 
        // inside relationships[] => IF type == "cover_art", then filter through that array and attributes object to grab id and fileName
        // if relationships.includes("attributes") = true
        // .includes() would work for checking if attributes is in the array since attributes is a value inside the object array
        // *using relationships[] as base, function isCover(file) { return file.type }
        
        // .some() method to check if one or more of the values match what you're looking for, this will return true/false or a truthy/falsey value depending on if it is in the array or not

        // ex: const isCover = relationshipArr.some(file => file.attributes) 
        // since attributes is an object, maybe Object.values(attributes) (outputs the contents as an array)

        // let relationshipArr = manga?.data.relationships
        // const isCover = relationshipArr?.some(files => files.attributes) 

        async function findCID() {
            try {
                let relationshipArr = manga?.data.relationships
                const coverRelationships = relationshipArr?.find((relationship) => relationship.type === "cover_art");
                if (coverRelationships && coverRelationships.attributes) {
                    console.log(coverRelationships)
                    return coverRelationships.attributes.fileName
                } else {
                    console.log(undefined)
                    return undefined
                }
            } catch (error) {
                console.log("Error")
            }
        };
        fetchData();
        getManga();
        findCID();
    }, []);

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

                    <div className='flex justify-center'>
                        <Link href='MangaInfo'>
                            <div className='px-0 mx-0'>
                                <img src='/aot.png' alt='Title of Manga' className='w-[177px] h-64' />
                                <h2 className='text-center text-xl font-semibold max-w-[170px] mt-2 text-darkbrown font-mainFont'>{manga?.data.attributes.title.en}</h2>
                            </div>
                        </Link>
                    </div>

                    {/* {manga?.data.map((info) => (
                        <div key={info.id} className='flex justify-center'>
                        <Link href='MangaInfo'>
                        <div className='px-0 mx-0'>
                            <img src={info.cover} alt='Title of Manga' className='w-[177px] h-64' />
                            <h2 className='text-center text-xl font-semibold max-w-[170px] mt-2 text-darkbrown font-mainFont'>{info.title}</h2>
                        </div>
                        </Link>
                    </div>
                    ))
                    } */}

                </div>

            </div>


        </div>
    )
}

export default SearchManga
