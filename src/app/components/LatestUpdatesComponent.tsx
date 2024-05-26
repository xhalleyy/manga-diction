import { IFavManga, IManga } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';
import { getCompletedManga, getInProgessManga, getLastChapter, specificManga } from '@/utils/DataServices';
import { Card } from 'flowbite-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const LatestUpdatesComponent = () => {
    const {setMangaId} = useClubContext();
    const [completed, setCompleted] = useState<IManga[]>([]);
    const [ongoing, setOngoing] = useState<IManga[]>([]);
    const [combinedManga, setCombinedManga] = useState<{
        manga: IManga;
        coverArtUrl: string;
        lastUpdate: string;
        favedMangaId: string;
    }[]>([])
    const router = useRouter();
    const [lastChapter, setLastChapter] = useState<string[]>([])

    useEffect(() => {
        const fetchManga = async () => {
            let user = Number(localStorage.getItem("UserId"));

            const completedManga = await getCompletedManga(user);
            const ongoingManga = await getInProgessManga(user);

            // combining completed and ongoing mangas
            const allManga = [...completedManga, ...ongoingManga];

            // getting all manga details and sort by last update
            const allMangaDetails = await Promise.all(
                allManga.map(async (manga: IFavManga) => {
                    const mangaResponse = await specificManga(manga.mangaId);
                    const mangaData: IManga = mangaResponse.data;
                    const updatedAt = mangaData.attributes.updatedAt;
                    const coverArt = `https://manga-covers.vercel.app/api/proxy?url=https://uploads.mangadex.org/covers/${mangaData.id}/${mangaData.relationships.find(rel => rel.type === "cover_art")?.attributes.fileName}`;
                    const mangaIdFav = manga.mangaId
                    return {
                        manga: mangaData,
                        coverArtUrl: coverArt,
                        lastUpdate: updatedAt,
                        favedMangaId: mangaIdFav
                    };
                })
            );
            const sortedManga = allMangaDetails.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
            setCombinedManga(sortedManga);

            const chapterPromises = sortedManga.map(async (manga) => {
                if (manga.manga.attributes?.lastChapter) {
                    return manga.manga.attributes.lastChapter;
                } else {
                    const chapterId = manga.manga.attributes?.latestUploadedChapter;
                    if (chapterId) {
                        const chapterInfo = await getLastChapter(chapterId);
                        return chapterInfo?.data.attributes.chapter || 'Unknown';
                    } else {
                        return 'Unknown';
                    }
                }
            });

            const chapters = await Promise.all(chapterPromises);
            setLastChapter(chapters);
        };

        fetchManga();
    }, []);

    const handleRouting= (mangaIdFav: string) => {
        setMangaId(mangaIdFav);
        router.push('/MangaInfo');
    }

    return (
        <div>
            {combinedManga.slice(0,3).map((manga, index) => (
                <div key={index} className="flex flex-col sm:flex-row p-2 cursor-pointer">
                    <Card className="w-[27%] h-[125px] cardImg border-none" onClick={() => handleRouting(manga.favedMangaId)}>
                        <img className="w-full h-full object-cover rounded-l-lg" src={manga.coverArtUrl} alt={manga.manga.attributes.title.en} />
                    </Card>
                    <Card className="w-[73%] h-[125px] cardTxt rounded-l-none border-none " onClick={() => handleRouting(manga.favedMangaId)}>
                        <h5 className="text-md font-semibold font-poppinsMed text-gray-900 justify-start text-start">
                            {manga.manga.attributes.title.en}
                        </h5>
                        <p className="text-md font-mainFont">Chapter {lastChapter[index] !== undefined ? lastChapter[index] : 'N/A'} </p>
                    </Card>
                </div>
            ))}
        </div>
    )
}

export default LatestUpdatesComponent
