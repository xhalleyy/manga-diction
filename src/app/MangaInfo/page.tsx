'use client'
import React, { useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { Badge, Button } from 'flowbite-react'
import { useClubContext } from '@/context/ClubContext'
import { addMangaFav, getCompletedManga, getInProgessManga, removeFavManga, specificManga } from '@/utils/DataServices'
import { IFavManga, IManga } from '@/Interfaces/Interfaces'
import { notFound } from 'next/navigation'
import { checkToken } from '@/utils/token'

const MangaInfo = () => {
    const { mangaId } = useClubContext();
    const [manga, setManga] = useState<IManga | null>(null);
    const [fileName, setFileName] = useState<string | undefined>("");
    const [favBool, setFavBool] = useState<boolean>(false);
    const [formattedStatus, setFormattedStatus] = useState<string>("");
    const [formattedDemographics, setFormattedDemographics] = useState<string>("");
    const [isFavManga, setIsFavManga] = useState<IFavManga | undefined>();
    const [completed, setCompleted] = useState<boolean>(false);
    const [isReading, setIsReading] = useState<boolean>(false);
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

    useEffect(() => {
        const fetchMangaInfo = async () => {
            try {
                const data = await specificManga(mangaId);
                setManga(data.data);
                findCoverArt(data.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchMangaInfo();
    }, [mangaId]);

    useEffect(() => {
        const checkIsFavManga = async () => {
            const user = Number(localStorage.getItem("UserId"));
            if (manga) {
                const completedManga = await getCompletedManga(user);
                const inProgressManga = await getInProgessManga(user);
                const favoriteManga = [...completedManga, ...inProgressManga].find(favManga => favManga.mangaId === manga.id);
                setIsFavManga(favoriteManga);
                setFavBool(!!favoriteManga);
            }
        };

        checkIsFavManga();
    }, [manga]);

    useEffect(() => {
        if (isFavManga) {
            setCompleted(isFavManga.completed);
            setIsReading(!isFavManga.completed);
        }
    }, [isFavManga]);

    const findCoverArt = (manga: IManga) => {
        const relationships = manga.relationships;
        const coverArt = relationships.find(rel => rel.type === "cover_art");
        if (coverArt) {
            setFileName(coverArt.attributes.fileName);
        }

        const status = manga.attributes.status;
        setFormattedStatus(status.charAt(0).toUpperCase() + status.slice(1));

        const demographics = manga.attributes.publicationDemographic;
        const formatDemo = demographics.charAt(0).toUpperCase() + demographics.slice(1);
        setFormattedDemographics(formatDemo);
    };

    const updateDT = () => {
        const dateTimeString = manga?.attributes.updatedAt;
        if (!dateTimeString) return "";
        const dateTime = new Date(dateTimeString);
        const month = dateTime.toLocaleString('en-US', { month: 'long' });
        const day = dateTime.getDate();
        const year = dateTime.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const trimDescription = (description: string) => {
        if (description) {
            const indexEnd = description.indexOf('---');
            if (indexEnd !== -1) {
                return description.substring(0, indexEnd).trim();
            } else {
                return description;
            }
        }
    };

    const handleFavoriteChange = async (newCompleted: boolean, isChecked: boolean) => {
        let user = Number(localStorage.getItem("UserId"));
        if (!isChecked && isFavManga) {
            await removeFavManga(user, mangaId);
            setIsFavManga(undefined);
            setFavBool(false);
            setCompleted(false);
            setIsReading(false);
            setFavBool(false);
        } else if (isChecked && manga) {
            const favMangaData: IFavManga = {
                id: isFavManga ? isFavManga.id : 0,
                userId: user,
                mangaId: manga.id,
                completed: newCompleted
            };
            await addMangaFav(favMangaData);
            setIsFavManga(favMangaData);
            setCompleted(newCompleted);
            setIsReading(!newCompleted);
            setFavBool(true);
            // Do not set favBool to true here
        }
    };

    const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFavoriteChange(true, e.target.checked);
    };

    const handleOngoingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFavoriteChange(false, e.target.checked);
    };

    if (!checkToken()) {
        notFound();
    }

    return (
        <div className='bg-offwhite min-h-screen'>
            <NavbarComponent />
            {manga && (
                <div className={pageSize ? 'grid lg:grid-cols-7 lg:grid-rows-1 grid-rows-2 lg:ms-1 lg:px-16 ' : ''}>
                    <div className={pageSize ? 'lg:col-span-2 row-span-1 lg:flex lg:flex-col lg:justify-center w-full mt-20 lg:mt-0' : ''}>
                        <div className={pageSize ? 'flex lg:justify-end xl:justify-center justify-center lg:pt-10 lg:px-0 pt-0 px-2' : 'flex justify-center mt-5'}>
                            {fileName && <img className='rounded-lg max-h-[455px] max-w-[342px]' src={`https://manga-covers.vercel.app/api/proxy?url=https://uploads.mangadex.org/covers/${manga.id}/${fileName}`} />}
                        </div>
                        <div className={pageSize ? 'flex lg:justify-end xl:justify-center justify-center items-center lg:pt-8 lg:mt-0 mt-10 flex-col w-full text xl:w-[300px] mx-auto ' : 'my-8'}>
                            <div className={pageSize ? 'flex justify-center lg:px-0 px-5' : 'flex justify-center px-5'}>
                                <Button className={pageSize ? 'bg-darkblue rounded-2xl enabled:hover:bg-darkerblue focus:ring-0 px-12 font-mainFont w-full ' : 'bg-darkblue enabled:hover:bg-darkerblue rounded-2xl focus:ring-0 font-mainFont w-80' } onClick={() => setFavBool(!favBool)} disabled={isReading && completed} >
                                    <span className={(isReading || completed) ? 'text-xl lg:text-nowrap px-5' : 'text-xl lg:text-nowrap'}>{(isReading || completed) ? "Favorited ✔" : "Favorite Manga +"}</span>
                                </Button>
                            </div>
                            <div id='dropCont' className={pageSize ? `favdrop bg-ivory mx-auto lg:w-[94%] md:w-[40%] ${favBool ? "show" : ""}` : `favdrop bg-ivory mx-auto md:w-[40%] w-[70%] ${favBool ? "show" : ""}`}>
                                <div className='mt-1 ms-4'>
                                    <div className="flex my-2">
                                        <input
                                            onChange={handleOngoingChange}
                                            checked={isReading}
                                            type='checkbox'
                                            className='me-2 mt-1' />
                                        <p>Currently Reading</p>
                                    </div>
                                    <div className="flex my-2">
                                        <input
                                            onChange={handleCompletedChange}
                                            checked={completed}
                                            type='checkbox'
                                            className='me-2 mt-1' />
                                        <p>Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={pageSize ? 'lg:col-span-5 row-span-1 flex flex-col lg:mt-10 lg:ml-5 lg:mr-10 lg:px-0 px-5 rounded-lg pb-5 lg:pb-0' : 'm-2'}>
                        <div className='bg-white border-darkbrown border-2 rounded-t-lg'>
                            <div className='p-5 inline-flex'>
                                <p className='text-3xl text-darkbrown font-bold'>{manga.attributes.title.en}</p>
                                <div className='p-2'>
                                    <Badge className='bg-darkblue rounded-xl text-white px-2 mr-1 font-mainFont'>{formattedStatus}</Badge>
                                </div>
                            </div>
                            <div className='px-5'>
                                <div className='inline-flex flex-wrap'>
                                    {manga.attributes.tags.map((tag: any, index: number) => (
                                        <Badge key={index} className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1 truncate my-1'>{tag.attributes.name.en}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className='p-5'>
                                <span className="font-mainFont">{trimDescription(manga.attributes.description.en)}</span>
                            </div>
                        </div>
                        <div className='bg-ivory leading-loose text-darkbrown border-2 border-t-0 border-darkbrown rounded-b-lg font-mainFont p-5'>
                            <p className='font-bold'> Author:
                                <span className='font-normal'> {manga.relationships.find(rel => rel.type === "author")?.attributes.name}</span>
                            </p>
                            <p className='font-bold'> Demographics:
                                <span className='font-normal'> {manga.attributes.publicationDemographic ? formattedDemographics : 'N/A'}</span>
                            </p>
                            <p className='font-bold'> Chapters:
                                <span className='font-normal'> {manga.attributes.lastChapter}</span>
                            </p>
                            <p className='font-bold'> Last Updated:
                                <span className='font-normal'> {updateDT()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MangaInfo
