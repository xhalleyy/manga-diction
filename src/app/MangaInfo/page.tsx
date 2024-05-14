'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { Badge, Button, Dropdown } from 'flowbite-react'
import { useClubContext } from '@/context/ClubContext'
import { getAuthorName, specificManga } from '@/utils/DataServices'
import { IManga } from '@/Interfaces/Interfaces'


const MangaInfo = () => {

    const { mangaId } = useClubContext();

    const [manga, setManga] = useState<IManga | null>(null); //null to handle intitial state

    const [authorName, setAuthorName] = useState<string>("");

    const [fileName, setFileName] = useState<string | undefined>("");

    // need to capitalize: Status and Demographic - manga possibly undefined, declare inside func
    const [favBool, setFavBool] = useState<boolean>(false);

    const [formattedStatus, setFormattedStatus] = useState<string>("");

    const [formattedDemographics, setFormattedDemographics] = useState<string>("");


    useEffect(() => {

        const fetchMangaInfo = async () => {
            try {
                const data = await specificManga(mangaId);
                setManga(data);
                findCoverArt(data);
                const authorRel = data?.data.relationships;
                const authorTruthy = authorRel?.find((auth: { type: string }) => auth.type === "author");
                if(authorTruthy){
                    const theAuthor = authorTruthy.id;
                    // console.log(theAuthor);
                    fetchAuthor(theAuthor);
                }else{
                    return undefined
                }
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        
        fetchMangaInfo();
    }, [mangaId]);
    
    const fetchAuthor = async (authorId: string) => {
        const aData = await getAuthorName(authorId);
        // console.log(aData);
        setAuthorName(aData.data.attributes.name);
        console.log(aData.data.attributes.name);
    };

    const findCoverArt = (manga: IManga) => {
        const relationships = manga.data.relationships;
        const coverArt = relationships.find(rel => rel.type === "cover_art");
        if (coverArt) {
            setFileName(coverArt.attributes.fileName);
        } else {
            return undefined;
        }
        // less complicated than making a separate function just to format and set 2 variables 
        const status = manga.data.attributes.status;
        setFormattedStatus(status.charAt(0).toUpperCase() + status.slice(1))

        const demographics = manga.data.attributes.publicationDemographic;
        setFormattedDemographics(demographics.charAt(0).toUpperCase() + demographics.slice(1))
    };

    const updateDT = () => {
        const dateTimeString = manga?.data.attributes.updatedAt;
        // will return empty string if value is undefined
        if (!dateTimeString) return "";
        const dateTime = new Date(dateTimeString);

        const month = dateTime.toLocaleString('en-US', { month: 'long' });
        const day = dateTime.getDate();
        const year = dateTime.getFullYear();

        // console.log(`${month} ${day}, ${year}`);

        return `${month} ${day}, ${year}`;
    };

    const trimDescription = (description: string) => {
        const indexEnd = description.indexOf('---');
        // if '---', trims description up to that index
        if (indexEnd !== -1) {
            return description.substring(0, indexEnd).trim();
        } else
            return description;
    };

    const favBtnDisplay = () => {
        if (favBool == false) {
            setFavBool(true);
            // include display block dropdown toggle
            document.getElementById("dropCont")?.classList.add("show");
        } else {
            setFavBool(false);
            document.getElementById("dropCont")?.classList.remove("show");
        }
    };

    return (
        <>
            <div className='bg-offwhite  min-h-screen'>

                <NavbarComponent />

                {manga && (
                    // all variables rendering dependent on successful fetch

                    <div className='flex ms-1'>
                        <div style={{ width: '30%' }} className='flex flex-col'>
                            <div className=' flex justify-end pt-10 w-full'>

                                {fileName && <img className='rounded-lg max-h-[555px]' src={`https://uploads.mangadex.org/covers/${manga.data.id}/${fileName}`} />}
                            </div>

                            <div className='flex justify-end pt-8 flex-col w-full'>
                                {/* favorites button */}
                                <div>
                                    <Button className='bg-darkblue rounded-2xl enabled:hover:bg-darkerblue focus:ring-0 px-12 font-mainFont w-full' onClick={favBtnDisplay}>
                                        <span className='text-xl'>{!favBool ? "Favorite Manga +" : "Favorited ✔"}</span>
                                    </Button>
                                </div>
                                <div id='dropCont' className="favdrop bg-ivory mx-auto">
                                    {/* will fix formatting */}
                                    <div className='mt-1 ms-4'>

                                    <div className="flex my-2">
                                        <input type='checkbox' className='me-2 mt-1' />
                                        <p>Currently Reading</p>
                                    </div>

                                    <div className="flex my-2">
                                        <input type='checkbox' className='me-2 mt-1' />
                                        <p>Completed</p>
                                    </div>
                                    
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div style={{ width: '70%' }} className='flex flex-col mt-10 ml-5 mr-10 rounded-lg '>
                            {/* manga name, tags, sypnosis */}
                            <div className='bg-white border-darkbrown border-2 rounded-t-lg'>
                                <div className='p-5 inline-flex'>
                                    {/* title */}
                                    <p className='text-3xl text-darkbrown font-bold'>{manga.data.attributes.title.en}</p>
                                    <div className='p-2'>
                                        {/* publication status */}
                                        <Badge className='bg-darkblue rounded-xl text-white px-2 mr-1 font-mainFont'>{formattedStatus}</Badge>
                                    </div>
                                </div>

                                <div className='px-5'>
                                    <div className='inline-flex flex-wrap'>
                                        {/* all applicable tags, .map */}
                                        {manga.data.attributes.tags.map((tag: any, index: number) => (
                                            <Badge key={index} className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1 truncate my-1'>{tag.attributes.name.en}</Badge>
                                        ))}

                                    </div>

                                </div>

                                <div className='p-5'>
                                    <span className="font-mainFont">{trimDescription(manga.data.attributes.description.en)}</span>

                                </div>
                            </div>

                            {/* manga author, demographic, chapters, last updated */}
                            <div className='bg-ivory leading-loose text-darkbrown border-2 border-t-0 border-darkbrown rounded-b-lg font-mainFont p-5'>
                                <p className='font-bold'> Author:
                                    <span className='font-normal'> {authorName}</span>
                                </p>

                                <p className='font-bold'> Demographics:
                                    <span className='font-normal'> {formattedDemographics}</span>
                                </p>

                                <p className='font-bold'> Chapters:
                                    <span className='font-normal'> {manga.data.attributes.lastChapter}</span>
                                </p>

                                <p className='font-bold'> Last Updated:
                                    <span className='font-normal'> {updateDT()}</span>
                                </p>
                            </div>


                        </div>

                    </div>

                )}


            </div>
        </>
    )
}

export default MangaInfo
