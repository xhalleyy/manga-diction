import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import Link from 'next/link'


const SearchManga = () => {

    return (
        <div className='bg-offwhite h-screen'>

            <NavbarComponent />

            <div className='mt-5'>
                <h1 className='px-16 text-3xl font-mainFont text-darkbrown font-bold'>Manga Results for &apos;{ }&apos;</h1>

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