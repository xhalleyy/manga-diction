import { Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

const LatestUpdatesComponent = () => {

    return (
        <div>
            <div className="flex flex-col sm:flex-row p-2">
                <Card className="w-full sm:w-1/3 h-36 cardImg border-none">
                    <img className="w-full h-full object-cover rounded-l-lg" src="/mangaexample.png" alt="Blog" />
                </Card>
                <Card className="w-full sm:w-2/3 h-36 cardTxt rounded-l-none border-none">
                    <h5 className="text-md font-semibold font-poppinsMed text-gray-900 justify-start text-start">
                        Dreaming Freedom
                    </h5>
                    <p className="text-sm font-mainFont">Chapter 103</p>
                </Card>
            </div>

        </div>
    )
}

export default LatestUpdatesComponent
