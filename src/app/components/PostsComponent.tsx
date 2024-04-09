'use client'

import { Avatar, Badge } from 'flowbite-react'
import React from 'react'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

const PostsComponent = () => {
    return (
        <div className='flex font-mainFont w-3/5 bg-white/80 rounded-md'>
            <div style={{ width: '10%' }} className='flex-col mt-1.5'>
                <Avatar rounded />
            </div>

            <div style={{ width: '90%' }} className='flex-col mt-1.5'>
                <p className='text-xl'> username </p>

                <div className='inline-flex'>
                    <Badge className='bg-tagsBg rounded-lg text-white px-2 mr-1'>tags</Badge>
                    <Badge className='bg-tagsBg rounded-lg text-white'>tags</Badge>
                </div>

                <div>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis maximus nunc, ac rhoncus odio congue quis. Sed ac semper orci, eu lacus</p>
                    <p> (see more) </p>
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
    )
}

export default PostsComponent
