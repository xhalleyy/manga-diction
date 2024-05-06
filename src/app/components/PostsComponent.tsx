'use client'

import { Avatar, Badge, CustomFlowbiteTheme } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { Category } from '@mui/icons-material';


interface PostsProps {
    id: number
    userId: number
    username: string
    clubName: string
    clubId: number
    title: string
    category: string
    tags: string[] | null
    description: string
    image: string
    dateCreated: string
    dateUpdated: string
    isDeleted: boolean
    displayClubName: boolean // Define displayClubName as a prop
}

const PostsComponent = ({ id, userId, username, clubId, clubName, title, category, tags, description, image, dateCreated, dateUpdated, isDeleted, displayClubName }: PostsProps) => {

    const [pageSize, setPageSize] = useState<boolean>(false);

    const customAvatar: CustomFlowbiteTheme['avatar'] = {
        "root": {
            "rounded": "rounded-full shadow-lg",
            "size": {
                "md": "h-14 w-14"
            }
        }
    }

    useEffect(() => {
        // handling resize
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);

            const handleResize = () => {
                setPageSize(window.innerWidth > 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    })

    return (
        <div className='font-mainFont w-full bg-white rounded-lg'>

            <div className='pl-8 pt-2'>
                {displayClubName && (<p className='text-2xl'>{clubName}</p>)}
            </div>

            <div className={pageSize ? 'flex' : 'hidden'}>

                <div style={{ width: '10%' }} className='flex flex-col place-content-center mt-[-35px]'>
                    <Avatar img={image} rounded theme={customAvatar} size="md" />
                </div>

                <div style={{ width: '90%' }} className='flex-col mt-1.5'>
                    <p className='text-xl'>{username}</p>

                    <div className='inline-flex'>
                        <Badge className='bg-darkblue rounded-lg text-white px-2 mr-1'>{category}</Badge>
                        {
                            tags && tags.map((tag, idx) => <Badge key={idx} className='bg-darkblue rounded-lg text-white'>{tag}</Badge>)
                        }
                    </div>

                    <div>
                        <p className='font-bold text-lg mb-1'> {title} </p>
                        <p className='ps-1 pb-2 font-normal text-md'> {description && (description.length < 150 ? description : `${description.substring(0, 150)} (see more)`)}</p>
                    </div>

                    <div className='inline-flex gap-1 mb-2'>
                        <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                            <ThumbUpOutlinedIcon sx={{ fontSize: '16px' }} />
                            <div></div>
                        </div>


                        <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                            <ModeCommentOutlinedIcon sx={{ fontSize: '16px' }} />
                            <p>comments</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className={pageSize ? 'hidden' : 'contents '}>
                <div>
                    <div className='grid grid-cols-3'>
                        <div className='col-span-1'>
                            <Avatar img={image} rounded theme={customAvatar} size="md" />
                        </div>

                        <div className='col-span-2'>
                            <div className=''>
                                <p className='text-xl'>{username}</p>
                                <div className=' w-auto inline-flex'>
                                    <Badge className='bg-darkblue rounded-lg inline-block text-white px-2 mr-1'>{category}</Badge>
                                    {
                                        tags && tags.map((tag, idx) => <Badge key={idx} className='bg-darkblue rounded-lg text-white'>{tag}</Badge>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='px-10 pt-2'>
                        <p className='font-bold text-lg mb-1'> {title} </p>
                        <p className='ps-1 pb-2 font-normal text-md'> {description && (description.length < 150 ? description : `${description.substring(0, 150)} (see more)`)}</p>
                    </div>

                    <div className='inline-flex gap-1 mb-2 pl-10 pb-1'>
                        <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                            <ThumbUpOutlinedIcon sx={{ fontSize: '16px' }} />
                            <div></div>
                        </div>


                        <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                            <ModeCommentOutlinedIcon sx={{ fontSize: '16px' }} />
                            <p>comments</p>
                        </div>
                    </div>
                </div>
            </div>




        </div>
    )
}

export default PostsComponent
