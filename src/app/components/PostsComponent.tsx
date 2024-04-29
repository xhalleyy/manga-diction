'use client'

import { Avatar, Badge, CustomFlowbiteTheme } from 'flowbite-react'
import React from 'react'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { Category } from '@mui/icons-material';


interface PostsProps {
    id: number;
    userId: number;
    clubId: number;
    title: string;
    category: string;
    tags: string;
    description: string;
    image: string;
    likes: number;
    dateCreated: string;
    dateUpdated: string;
    isDeleted: boolean;
    displayClubName: boolean; // Define displayClubName as a prop
  }

const PostsComponent = ({id, userId, clubId, title, category, tags, description, image, likes, dateCreated, dateUpdated, isDeleted, displayClubName}: PostsProps) => {

    const customAvatar: CustomFlowbiteTheme['avatar'] = {
        "root" : {
            "size": {
                "md": "h-14 w-14"
            }
        }
    }

    return (
        <div className='font-mainFont w-full bg-white rounded-lg'>

            <div className='pl-8 pt-2'>
                {displayClubName && (<p className='text-2xl'>Jujutsu Lovers&lt;3</p>)}
            </div>

            <div className='flex'>

            <div style={{ width: '10%' }} className='flex flex-col place-content-center mt-[-35px]'>
                <Avatar rounded theme={customAvatar} size="md" />
            </div>

            <div style={{ width: '90%' }} className='flex-col mt-1.5'>
                <p className='text-xl'> gegehater_xD </p>

                <div className='inline-flex'>
                    <Badge className='bg-darkblue rounded-lg text-white px-2 mr-1'>{category}</Badge>
                    {/* <Badge className='bg-darkblue rounded-lg text-white'>{Post.tags}</Badge> */}
                </div>

                <div>
                    <p className='font-bold text-lg mb-1'> {title} <span className='ps-1 font-normal text-md'>{description} (see more)</span></p>
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
