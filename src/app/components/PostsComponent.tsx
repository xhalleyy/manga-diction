import { Avatar, Badge } from 'flowbite-react'
import React from 'react'

const PostsComponent = () => {
    return (
        <div className='flex font-mainFont w-3/5'>
            <div style={{ width: '10%' }} className='flex-col'>
                <Avatar rounded />
            </div>

            <div style={{ width: '90%' }} className='flex-col'>
                <p className='text-xl'> username </p>

                <div className='inline-flex'>
                    <Badge className='bg-tagsBg rounded-lg text-white mr-1'>tags</Badge>
                    <Badge className='bg-tagsBg rounded-lg text-white'>tags</Badge>
                </div>

                <div>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis maximus nunc, ac rhoncus odio congue quis. Sed ac semper orci, eu lacus</p>
                    <a> (see more) </a>
                </div>

                <div className='inline-flex'>
                    <Badge className='border rounded-lg text-black font-normal mr-1'>
                            <img src='/likes.png' />
                            <span>comments</span>
                    </Badge>

                    <Badge className='border text-black font-normal rounded-lg '>
                        <img src='/comments.png' />
                        <p>likes</p>
                    </Badge>
                </div>

            </div>



        </div>
    )
}

export default PostsComponent
