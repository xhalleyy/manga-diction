import { Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

const LatestUpdatesComponent = () => {
    const [pageSize, setPageSize] = useState<boolean>(true);

    useEffect(() => {
        // handling window resize 
        const handleResize = () => {
            setPageSize(window.innerWidth > 768)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div>
            <div className={pageSize ? 'flex flex-row pb-3' : '' }>
                <Card className={pageSize ? "w-full object-fit h-36" : " w-full h-full"}imgSrc="/mangaexample.png" horizontal>
                    <div className=''>
                        <h5 className="text-2xl font-poppinsMed text-gray-900 justify-start text-start">
                            Dreaming Freedom
                        </h5>
                        <p className='text-md font-mainFont'>Chapter 103</p>
                    </div>
                </Card>
            </div>
            
        </div>
    )
}

export default LatestUpdatesComponent
