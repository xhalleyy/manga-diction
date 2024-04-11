'use client'

import { Avatar, Badge } from 'flowbite-react'
import React from 'react'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { Category } from '@mui/icons-material';

const PostsComponent = ( prop: {id:number, userId: number, clubId: number, title:string, category:string, tags:string, description:string, image:string, likes:number, dateCreated:string, dateUpdated:string, isDeleted:boolean}) => {
    return (
        <div className='font-mainFont w-full bg-white rounded-lg'>

            <div className='pl-8 pt-2'>
                <p className='text-2xl'>Jujutsu Lovers&lt;3</p>
            </div>

            <div className='flex'>

            <div style={{ width: '10%' }} className='flex-col mt-1.5'>
                <Avatar rounded />
            </div>

            <div style={{ width: '90%' }} className='flex-col mt-1.5'>
                <p className='text-xl'> gegehater_xD </p>

                <div className='inline-flex'>
                    <Badge className='bg-darkblue rounded-lg text-white px-2 mr-1'>{prop.category}</Badge>
                    {/* <Badge className='bg-darkblue rounded-lg text-white'>{prop.tags}</Badge> */}
                </div>

                <div>
                    <p className='font-bold text-lg mb-1'> {prop.title} <span className='ps-1 font-normal text-md'>{prop.description} (see more)</span></p>
                </div>

                <div className='inline-flex gap-1 mb-2'>
                    <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                            <ThumbUpOutlinedIcon sx={{fontSize: '16px'}}/>
                            <div>0</div>
                    </div>
                    

                    <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                        <ModeCommentOutlinedIcon sx={{fontSize: '16px'}}/>
                        <p>likes</p>
                    </div>
                </div>

            </div>

            </div>
            



        </div>
    )
}

export default PostsComponent
