'use client'

import { Avatar, Badge, Button, CustomFlowbiteTheme, Label, Modal, Select, TextInput } from 'flowbite-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { Category } from '@mui/icons-material';
import { AddLikeToPost, GetLikesByPost, RemoveLikeFromPost, deletePosts, getPostsByCategory, getPostsByTags, updatePosts } from '@/utils/DataServices';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import { useClubContext } from '@/context/ClubContext';
import { ILikedByUsers, IPostData } from '@/Interfaces/Interfaces';
import { Chips } from 'primereact/chips';
import { useRouter } from 'next/navigation';


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
    displayClubName: boolean
    shouldSort: boolean
    onSortCategory: (event: React.MouseEvent<HTMLSpanElement>, clubId:number, category: string) => void;
    onSortTag: (event: React.MouseEvent<HTMLSpanElement>, clubId:number, tag: string) => void;

}

interface likedUser {
    userId: number
    username: string
}

interface successProps {
    updateSuccess: () => void
}


const PostsComponent = ({ id, userId, username, clubId, clubName, title: initialTitle, category: initialCategory, tags: initialTags, description: initialDescription, image, dateCreated, dateUpdated, isDeleted, displayClubName, shouldSort, onSortCategory, onSortTag }: PostsProps, { updateSuccess }: successProps) => {

    const info = useClubContext();
    const [pageSize, setPageSize] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(0);
    const [likedByUsers, setLikedByUsers] = useState<ILikedByUsers[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isUnliked, setIsUnliked] = useState<boolean>(false);
    const [yourPost, setYourPost] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>(initialTitle);
    const [newCategory, setNewCategory] = useState<string>(initialCategory);
    const [newTags, setNewTags] = useState(initialTags ? initialTags.join(', ') : '');
    const [newDesc, setNewDesc] = useState<string>(initialDescription);
    const [value, setValue] = useState<any>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    // const [expandValue, setExpandValue] = useState<string>(initialDescription);
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();

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
    }, [])

    const handleLikes = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        try {
            const user = Number(localStorage.getItem("UserId"))
            const likes = await AddLikeToPost(id, user)
            const likedPost = await GetLikesByPost(id);
            setLikes(likedPost.likesCount)

            const isUserLiked = likedPost.likedByUsers.some((likedUser: likedUser) => likedUser.userId === user);
            setIsLiked(isUserLiked)

        } catch (error) {
            console.error('error adding like: ', error)
        }
    }

    const removeLikes = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        try {
            const user = Number(localStorage.getItem("UserId"))
            const likes = await RemoveLikeFromPost(id, user)
            const likedPost = await GetLikesByPost(id);
            setLikes(likedPost.likesCount)
            const isUserLiked = likedPost.likedByUsers.some((likedUser: likedUser) => likedUser.userId === user);
            setIsLiked(isUserLiked)
        } catch (error) {

            console.error('error adding like: ', error)
        }
    }

    const handleEdit = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsEditing(!isEditing)
    }

    useEffect(() => {
        const getPost = async () => {
            if (info.displayedUser?.id === userId) {
                setYourPost(true);
            }
        }
        getPost();
    }, [id, info.displayedUser?.id, userId])



    useEffect(() => {
        const fetchedLikes = async () => {
            try {
                const user = Number(localStorage.getItem("UserId"))
                const likedPost = await GetLikesByPost(id);
                setLikes(likedPost.likesCount)
                setLikedByUsers(likedPost.likedByUsers)

                const isUserLiked = likedPost.likedByUsers.some((likedUser: likedUser) => likedUser.userId === user);
                setIsLiked(isUserLiked)
            } catch (error) {
                console.error('error fetching likes: ', error)
            }
        }
        fetchedLikes();
    }, [id])

    const handleChange = (desc: string) => {
        setNewDesc(desc);
    };


    const handleUpdatePost = async () => {

        try {
            const updatedPostData: IPostData = {
                id,
                userId,
                clubId,
                title: newTitle,
                category: newCategory,
                tags: newTags,
                description: newDesc,
                image,
                dateCreated,
                dateUpdated: new Date().toISOString(),
                isDeleted
            }

            const updatedPost = await updatePosts(updatedPostData);
            console.log(updatedPost);
            if (updatedPost) {
                setNewTitle(updatedPost.title);
                setNewCategory(updatedPost.category);
                setNewTags(updatedPost.tags);
                setNewDesc(updatedPost.description)
                setIsEditing(false);
                updateSuccess();
            }
        } catch (error) {
            console.log('error updating clubs', error)
        }

    }

    const handleDeletePost = async () => {
        try {
            await deletePosts({
                id,
                userId,
                clubId,
                title: initialTitle,
                category: initialCategory,
                tags: newTags,
                description: initialDescription,
                image,
                dateCreated,
                dateUpdated,
                isDeleted
            });
            setOpenModal(false)
        } catch (error) {
            console.log('error deleting club', error)
        }
    }



    return (
        <div className={isEditing ? 'font-mainFont w-full bg-darkBlue rounded-lg' : 'font-mainFont w-full bg-white rounded-lg'}>

            <div className='ps-10 pt-2'>
                {displayClubName && (<p className='text-[20px] font-poppinsMed'>{clubName}</p>)}
            </div>

            <div className={pageSize ? 'flex' : 'flex'}>

                <div style={pageSize ? { width: '12%' } : {width: '30%'}} className='flex flex-col place-content-center mt-[-35px]'>
                    <Avatar img={image} rounded theme={customAvatar} size="md" />
                </div>

                <div style={{ width: '90%' }} className='flex-col mt-1.5'>

                    <div className='grid grid-cols-2'>
                        {!isEditing && <p className='text-xl col-span-1'>{username}</p>}
                        {yourPost ?
                            <div className={isEditing ? 'col-span-2 flex justify-end float-end pe-8 gap-2' : 'col-span-1 flex justify-end float-end pe-8 gap-2'}>
                                <Tooltip onClick={handleEdit} title='Edit Post' placement='right'>
                                    <EditIcon className='col-span-1 items-end' />
                                </Tooltip>

                                <Tooltip onClick={() => setOpenModal(true)} title='Delete Post' placement='right'>
                                    <DeleteIcon />
                                </Tooltip>
                            </div>
                            : null}
                    </div>

                    <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} popup>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    <div>
                                        Are you sure you want to delete this post?
                                    </div>

                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="failure" onClick={handleDeletePost}>
                                        {"Yes, I'm sure"}
                                    </Button>
                                    <Button color="gray" onClick={() => setOpenModal(false)}>
                                        No, cancel
                                    </Button>
                                </div>

                            </div>
                        </Modal.Body>
                    </Modal>

                    {isEditing ? (
                        <div onClick={(event) => { event.stopPropagation() }} className=' rounded-lg pr-8 '>
                            <div className={pageSize ? 'grid grid-cols-12 items-center gap-3 py-2' : "grid grid-cols-5 pb-2"}>
                                <Label htmlFor="base" value="Title:" className='col-span-1 text-lg mt-1' />
                                <TextInput onChange={(e) => setNewTitle(e.target.value)} value={newTitle} placeholder="What is the topic?" id="base" type="text" sizing="post" className={pageSize ? 'col-span-9' : 'col-span-4'} required />
                                <div className={pageSize ? 'col-span-2 flex justify-center' : 'hidden'}>
                                    <Select onChange={(e) => setNewCategory(e.target.value)} value={newCategory} id='myDropdown' defaultValue={"Category"} required={true} className='font-mainFont'>
                                        <option value="Category" disabled>Category</option>
                                        <option value="Discussion">Discussion</option>
                                        <option value="Spoilers">Spoilers</option>
                                        <option value="Question">Question</option>
                                        <option value="Rant">RANT</option>
                                    </Select>
                                </div>
                            </div>
                            <div className={pageSize ? 'grid grid-cols-12 items-center gap-3 py-1' : "grid grid-cols-5 pb-2"}>
                                <Label htmlFor="base2" value="Tags:" className='col-span-1 text-lg mt-1' />
                                <div className={pageSize ? "card p-fluid col-span-11" : "col-span-4"}>
                                    {value !== undefined && value !== null && (
                                        <Chips className='' value={value} onChange={(e) => {

                                            setValue(e.value)
                                            setNewTags(e.value?.join(",") ?? "")
                                        }
                                        }
                                            placeholder='Enter to separate new tags' separator="," />
                                    )}
                                </div>
                            </div>
                            <div className={pageSize ? 'grid grid-cols-12 items-center gap-3 py-1' : "grid grid-cols-5"}>
                                <Label htmlFor="base3" value="Post:" className='col-span-1 text-lg mt-1' />
                                <textarea
                                    required
                                    id="review-text"
                                    onChange={(e) => handleChange(e.target.value)}
                                    ref={textAreaRef}
                                    placeholder='Write your thoughts...'
                                    rows={1}
                                    value={newDesc}
                                    className={pageSize ? 'col-span-11 w-full font-mainFont rounded-lg border-0 focus-within:border-0 focus-within:ring-0 px-5' : 'col-span-4 w-full font-mainFont rounded-lg border-0 focus-within:border-0 focus-within:ring-0 px-5'}
                                />
                                {/* <TextInput theme={customInput} id="base3" type="text" sizing="post" className='col-span-11 w-full' /> */}
                            </div>


                            <button className='font-poppinsMed flex justify-end float-end bg-offwhite text-darkbrown px-3 rounded-lg  mt-1 py-1 hover:bg-emerald-200' onClick={handleUpdatePost}>
                                update
                            </button>
                        </div>
                    )
                        :
                        <div>

                            <div>
                                <div className='inline-flex'>
                                    <Badge onClick={(event) => shouldSort && onSortCategory(event, clubId, initialCategory)}  className='bg-darkblue rounded-lg text-white px-2 mr-1'>{initialCategory}</Badge>
                                    {
                                        initialTags && initialTags.map((tag, idx) => <Badge onClick={(event) => shouldSort && onSortTag(event, clubId, tag)}  key={idx} className='bg-darkblue rounded-lg text-white me-1.5'>{tag}</Badge>)
                                    }
                                </div>

                            </div>

                            <div>
                                <p className='font-bold text-lg mb-1'> {initialTitle} </p>
                                <p onClick={(event) => event.stopPropagation()} className={`ps-1 pb-2 font-normal text-md ${initialCategory === "Spoilers" && 'invisibleInk'}`} tabIndex={-1}> {initialDescription && (initialDescription.length < 150 ? initialDescription : `${initialDescription.substring(0, 150)} (see more)`)}</p>
                            </div>

                            <div className='inline-flex gap-1 mb-2'>
                                <div onClick={(event) => { isLiked ? removeLikes(event) : handleLikes(event) }} className={isLiked ? 'flex border border-black rounded-xl h-6 text-white bg-darkblue font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer' : 'flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'}>
                                    <ThumbUpOutlinedIcon sx={{ fontSize: '16px' }} />
                                    <div> <p> {likes} </p></div>
                                </div>


                                <div className='flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                                    <ModeCommentOutlinedIcon sx={{ fontSize: '16px' }} />
                                    <p>comments</p>
                                </div>
                            </div>
                        </div>}



                </div>

            </div>



        </div>
    )
}

export default PostsComponent
