'use client'
import React, { use, useEffect, useState } from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { Badge, Button, Dropdown } from 'flowbite-react'
import { useClubContext } from '@/context/ClubContext'
import { addMangaFav, getAuthorName, getCompletedManga, getInProgessManga, removeFavManga, specificManga } from '@/utils/DataServices'
import { IFavManga, IManga } from '@/Interfaces/Interfaces'


const MangaInfo = () => {

    const { mangaId } = useClubContext();
    const [manga, setManga] = useState<IManga | null>(null); //null to handle intitial state
    const [authorName, setAuthorName] = useState<string>("");
    const [fileName, setFileName] = useState<string | undefined>("");
    // need to capitalize: Status and Demographic - manga possibly undefined, declare inside func
    const [favBool, setFavBool] = useState<boolean>(false);
    const [formattedStatus, setFormattedStatus] = useState<string>("");
    const [formattedDemographics, setFormattedDemographics] = useState<string>("");
    const [isFavManga, setIsFavManga] = useState<IFavManga | undefined>();
    const [fav, setFave] = useState<boolean>(false)
    const [completed, setCompleted] = useState<boolean>(false);
    const [isReading, setIsReading] = useState<boolean>(false);

    const [completedChecked, setCompletedChecked] = useState<boolean>(false);
    const [readingChecked, setReadingChecked] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<'completed' | 'ongoing' | ''>('');



    useEffect(() => {

        const fetchMangaInfo = async () => {
            try {
                const data = await specificManga(mangaId);
                setManga(data.data);
                findCoverArt(data.data);
                const authorRel = data?.data.relationships;
                const authorTruthy = authorRel?.find((auth: { type: string }) => auth.type === "author");
                if (authorTruthy) {
                    if (authorTruthy) {
                        const theAuthor = authorTruthy.id;
                        // console.log(theAuthor);
                        fetchAuthor(theAuthor);
                    } else {
                        return undefined
                    }
                }
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
                // Check if the manga is favorited by the user
                const completedManga = await getCompletedManga(user);
                const inProgressManga = await getInProgessManga(user)
                setIsFavManga(inProgressManga || completedManga);
            }
        };

        checkIsFavManga();
    }, [manga]);

    useEffect(() => {
        // Set the initial state of isChecked based on whether the manga is favorited
        if (isFavManga) {
            setCompletedChecked(isFavManga.completed);
            setReadingChecked(!isFavManga.completed);
            setIsChecked(isFavManga.completed ? 'completed' : 'ongoing');
        } else {
            setIsChecked('');
        }
    }, [isFavManga]);

    // useEffect(() => {
    //     // Initialize checkbox states based on manga status
    //     if (isFavManga) {
    //         setCompletedChecked(isFavManga.completed);
    //         setReadingChecked(!isFavManga.completed);
    //     } else {
    //         setCompletedChecked(false);
    //         setReadingChecked(false);
    //     }
    // }, [isFavManga]);

    const fetchAuthor = async (authorId: string) => {
        const aData = await getAuthorName(authorId);
        // console.log(aData);
        setAuthorName(aData.data.attributes.name);
        console.log(aData.data.attributes.name);
    };

    const findCoverArt = (manga: IManga) => {
        const relationships = manga.relationships;
        const coverArt = relationships.find(rel => rel.type === "cover_art");
        if (coverArt) {
            setFileName(coverArt.attributes.fileName);
        } else {
            return undefined;
        }
        // less complicated than making a separate function just to format and set 2 variables 
        const status = manga.attributes.status;
        setFormattedStatus(status.charAt(0).toUpperCase() + status.slice(1))

        const demographics = manga.attributes.publicationDemographic;
        setFormattedDemographics(demographics.charAt(0).toUpperCase() + demographics.slice(1))
    };

    const updateDT = () => {
        const dateTimeString = manga?.attributes.updatedAt;
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
        if (description) {
            const indexEnd = description.indexOf('---');
            // if '---', trims description up to that index
            if (indexEnd !== -1) {
                return description.substring(0, indexEnd).trim();
            } else
                return description;
        }
    };

    const favBtnDisplay = () => {
        if (favBool == false && isFavManga) {
            setFavBool(true);
            // include display block dropdown toggle
            document.getElementById("dropCont")?.classList.add("show");
        } else {
            setFavBool(false);
            document.getElementById("dropCont")?.classList.remove("show");
        }

        // Reset isChecked state when the button is clicked
        setIsChecked('');
    };

    const toggleCheck = (value: 'completed' | 'ongoing') => {
        if (isChecked === value) {
            setIsChecked('')
            localStorage.removeItem('checkboxstate')
        } else {
            setIsChecked(value);
            localStorage.setItem('checkboxstate', value)
        }
    }

    useEffect(() => {
        const savedState = localStorage.getItem('checkboxstate');
        if (savedState) {
            setIsChecked(savedState as 'completed' | 'ongoing');
        } else {
            setIsChecked('');
        }
    }, []);

    const handleCompleted = async (manga: IManga) => {
        let user = Number(localStorage.getItem("UserId"));

        try {
            if (!completed && manga) {
                const favMangaData: IFavManga = {
                    id: isFavManga ? isFavManga.id : 0,
                    userId: user,
                    mangaId: manga.id,
                    completed: true
                };

                await addMangaFav(favMangaData);
                setIsFavManga(favMangaData);
                setIsChecked('completed');
            } else if (completed && isFavManga && isFavManga !== undefined) {
                await removeFavManga(user, mangaId);
                setIsFavManga(undefined);
                setIsChecked('');
            }

            setCompletedChecked(true);
            setReadingChecked(false);
        } catch (error) {
            console.error('Error updating manga status!', error);
        }

        setCompleted(!completed);
        setIsReading(false);
        setFave(!fav);
    };

    const handleOngoing = async (manga: IManga) => {
        let user = Number(localStorage.getItem("UserId"));

        try {
            if (!isReading && manga) {
                const favMangaData: IFavManga = {
                    id: isFavManga ? isFavManga.id : 0,
                    userId: user,
                    mangaId: manga.id,
                    completed: false
                };

                await addMangaFav(favMangaData);
                setIsFavManga(favMangaData);
                setIsChecked('ongoing');
            } else if (isReading && isFavManga) {
                await removeFavManga(user, mangaId);
                setIsFavManga(undefined);
                setIsChecked('');
            }

            setCompletedChecked(false);
            setReadingChecked(true);
        } catch (error) {
            console.error('Error updating manga status!', error);
        }

        setCompleted(false);
        setIsReading(!isReading);
        setFave(!fav);
    };

    return (
        <>
            <div className='bg-offwhite  min-h-screen'>

                <NavbarComponent />

                {manga && (
                    // all variables rendering dependent on successful fetch

                    <div className='grid grid-cols-7 ms-1 lg:px-16 '>
                        <div  className='col-span-2 flex flex-col justify-center'>
                            <div className=' flex justify-end xl:justify-center pt-10 w-full'>

                                {fileName && <img className='rounded-lg max-h-[555px]' src={`https://uploads.mangadex.org/covers/${manga.id}/${fileName}`} />}
                            </div>

                            <div className='flex justify-end xl:justify-center pt-8 flex-col w-full text xl:w-[300px] mx-auto '>
                                {/* favorites button */}
                                <div className='flex justify-center '>
                                    <Button className='bg-darkblue rounded-2xl enabled:hover:bg-darkerblue focus:ring-0 xl:px-12 px-8 font-mainFont' onClick={favBtnDisplay}>
                                        <span className='text-xl lg:text-nowrap'>{isFavManga && fav ? "Favorited ✔" : "Favorite Manga +"}</span>
                                    </Button>
                                </div>
                                <div id='dropCont' className={"favdrop bg-ivory mx-auto"}>
                                    {/* will fix formatting */}
                                    <div className='mt-1 ms-4'>

                                        <div className="flex my-2">
                                            <input
                                                onClick={() => handleOngoing(manga)}
                                                checked={isChecked === 'ongoing'}
                                                onChange={() => toggleCheck('ongoing')}
                                                type='checkbox'
                                                className='me-2 mt-1' />
                                            <p>Currently Reading</p>
                                        </div>

                                        <div className="flex my-2">
                                            <input
                                                onClick={() => handleCompleted(manga)}
                                                checked={isChecked === 'completed'}
                                                onChange={() => toggleCheck('completed')}
                                                type='checkbox'
                                                className='me-2 mt-1' />
                                            <p>Completed</p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        <div className='col-span-5 flex flex-col mt-10 ml-5 mr-10 rounded-lg '>
                            {/* manga name, tags, sypnosis */}
                            <div className='bg-white border-darkbrown border-2 rounded-t-lg'>
                                <div className='p-5 inline-flex'>
                                    {/* title */}
                                    <p className='text-3xl text-darkbrown font-bold'>{manga.attributes.title.en}</p>
                                    <div className='p-2'>
                                        {/* publication status */}
                                        <Badge className='bg-darkblue rounded-xl text-white px-2 mr-1 font-mainFont'>{formattedStatus}</Badge>
                                    </div>
                                </div>

                                <div className='px-5'>
                                    <div className='inline-flex flex-wrap'>
                                        {/* all applicable tags, .map */}
                                        {manga.attributes.tags.map((tag: any, index: number) => (
                                            <Badge key={index} className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1 truncate my-1'>{tag.attributes.name.en}</Badge>
                                        ))}

                                    </div>

                                </div>

                                <div className='p-5'>
                                    <span className="font-mainFont">{trimDescription(manga.attributes.description.en)}</span>

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
        </>
    )
}

export default MangaInfo
