"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'


const FriendsComponent = () => {

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
    })

    return (
        <>
            {pageSize ?
                <div className="bg-white py-[10px] mb-1 flex rounded-t-md">
                    <img src='/aot.png' alt='profile image' className='w-14 friendPfp ms-10' />
                    <div className='ms-10'>
                        <h4>UserName</h4>
                        <p>Geto Suguru</p>
                    </div>
                </div>

                :

                <div>
                    <div className='flex justify-center pt-2 pb-2'>
                        <Image
                            src={'/dummyImg.png'}
                            width={100}
                            height={100}
                            alt={'profile image'}
                            className='friendPfp'
                        />
                    </div>

                    <div className='text-center'>
                        <p className='font-bold text-lg'> Username </p>
                        <p className='text-sm'> Geto Suguru</p>
                    </div>


                </div>
            }

        </>
    )
}

export default FriendsComponent
