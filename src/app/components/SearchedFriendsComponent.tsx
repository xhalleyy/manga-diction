import React, { useEffect, useState } from 'react'
import Image from 'next/image'


const SearchedFriendsComponent = () => {
    const [pageSize, setPageSize] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768)

            const handleResize = () => {
                setPageSize(window.innerWidth > 768)
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <>

            {pageSize ?

                <div className="ms-auto mt-5">
                    <Image
                        src='/aot.png'
                        alt='profile picture'
                        height={110}
                        width={110}
                        className='searchPfp'
                        unoptimized />
                    <div className='text-center mt-2'>
                        <p className='text-lg font font-poppinsMed'>UserName</p>
                        <p className='text-sm -mt-1'>Geto Suguru</p>
                    </div>
                </div>
                :
                <div className='mt-7 mx-auto'>
                    {/* mobile formatted friend components */}
                    <Image
                        src='/noprofile.jpg'
                        alt='profile picture'
                        height={110}
                        width={110}
                        className='searchPfp'
                        unoptimized />
                    <div className='text-center mt-2'>
                        <p className='text-lg font font-poppinsMed'>UserName</p>
                        <p className='text-sm -mt-1'>Geto Suguru</p>
                    </div>
                </div>
            }
        </>
    )
}

export default SearchedFriendsComponent
