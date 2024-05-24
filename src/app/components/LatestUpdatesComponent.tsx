import { IFavManga, IManga } from '@/Interfaces/Interfaces';
import { getCompletedManga, getInProgessManga, specificManga } from '@/utils/DataServices';
import { Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

const LatestUpdatesComponent = () => {
    const [completed, setCompleted] = useState<IManga[]>([]);
    const [ongoing, setOngoing] = useState<IManga[]>([]);
    const [combinedManga, setCombinedManga] = useState<{
        manga: IManga;
        coverArtUrl: string;
        lastUpdate: string;
    }[]>([])

    useEffect(() => {
        const fetchManga = async () => {
            let user = Number(localStorage.getItem("UserId"));

            const completedManga = await getCompletedManga(user);
            const ongoingManga = await getInProgessManga(user);

            // Combine completed and ongoing manga arrays
            const allManga = [...completedManga, ...ongoingManga];

            // Fetch manga details and sort by last update
            const allMangaDetails = await Promise.all(
                allManga.map(async (manga: IFavManga) => {
                    const mangaResponse = await specificManga(manga.mangaId);
                    const mangaData: IManga = mangaResponse.data;
                    const updatedAt = mangaData.attributes.updatedAt;
                    const coverArt = `https://manga-covers.vercel.app/api/proxy?url=https://uploads.mangadex.org/covers/${mangaData.id}/${mangaData.relationships.find(rel => rel.type === "cover_art")?.attributes.fileName}`;
                    return {
                        manga: mangaData,
                        coverArtUrl: coverArt,
                        lastUpdate: updatedAt
                    };
                })
            );

            // Sort the combined manga by last update date in descending order
            const sortedManga = allMangaDetails.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());

            // Set the state with the sorted combined manga
            setCombinedManga(sortedManga);
        };

        fetchManga();
    }, []);

    return (
        <div>
            {combinedManga.slice(0,3).map((manga, index) => (
                <div key={index} className="flex flex-col sm:flex-row p-2">
                    <Card className="w-[27%] h-[125px] cardImg border-none">
                        <img className="w-full h-full object-cover rounded-l-lg" src={manga.coverArtUrl} alt={manga.manga.attributes.title.en} />
                    </Card>
                    <Card className="w-[73%] h-[125px] cardTxt rounded-l-none border-none ">
                        <h5 className="text-md font-semibold font-poppinsMed text-gray-900 justify-start text-start">
                            {manga.manga.attributes.title.en}
                        </h5>
                        <p className="text-md font-mainFont">Chapter {manga.manga.attributes.lastChapter} </p>
                    </Card>
                </div>
            ))}
        </div>
    )
}

export default LatestUpdatesComponent
