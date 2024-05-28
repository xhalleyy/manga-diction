import React, { useEffect, useRef, useState } from 'react'
import { Chips } from 'primereact/chips'
import useAutosizeTextArea from "@/utils/useAutosizeTextArea";
import { TextInput, Label, Dropdown, Select } from 'flowbite-react';
import { createPost, getPostsByClubId, getRecentClubPosts } from '@/utils/DataServices';
import { IPostData, IPosts } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';

type CreatePostType = {
    setPosts: React.Dispatch<React.SetStateAction<IPosts[]>>
}
const CreatePostComponent = ({ setPosts }: CreatePostType) => {

    const info = useClubContext();
    const [value, setValue] = useState<any>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [pageSize, setPageSize] = useState<boolean>(false)


    const [id, setId] = useState<number>(0)
    const [userId, setUserId] = useState<number | undefined>(0);
    const [clubId, setClubId] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const [clubName, setClubName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const [image, setImage] = useState<string>("");
    const [category, setCategory] = useState<string>("Category");
    const [tags, setTags] = useState<string>("");
    const [expandValue, setExpandValue] = useState<string>(""); // description
    const [dateCreated, setDateCreated] = useState<string>("");
    const [dateUpdated, setDateUpdated] = useState<string>("");
    const [hasErrors, setErrors] = useState<boolean>(false);
    const resetValues = () => {
        setExpandValue("")
        setDateCreated("")
        setDateUpdated("")
        setTitle("")
        setCategory("Category")
        setTags("");
    }
    const customInput = {
        "field": {
            "input": {
                "sizes": {
                    "post": "py-1.5 px-2 text-[16px] font-mainFont"
                }
            }
        }
    }

    useAutosizeTextArea(textAreaRef.current, expandValue);
    const handleChange = (expand: string) => {
        setExpandValue(expand);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setTitle(value);
        setSuccess(value !== '' && category !== '');
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue !== 'Category') {
            setCategory(selectedValue);
        } else {
            setCategory('');
        }
        setSuccess(title !== '' && selectedValue !== 'Category');
    };

    const handleTagsChange = (tag: string) => {
        let tags = tag.replace(/[\s,]+/g, ',')
        setTags(tags);
    };

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const handleSubmit = async () => {
        if (title !== '' && category !== '') {
            try {
                let userId = Number(localStorage.getItem("UserId"));
                const postData: IPostData = {
                    id,
                    userId,
                    clubId: info.displayedClub!.id,
                    title,
                    category,
                    tags: tags ?? null,
                    description: expandValue,
                    image: null,
                    dateCreated: formattedDate,
                    dateUpdated: formattedDate,
                    isDeleted: false
                };
                const data = await createPost(postData);

                if (data) {
                    resetValues();
                    const getPosts = await getRecentClubPosts(info.displayedClub!.id);
                    setPosts(getPosts);
                }
                console.log(data);
                setSuccess(true);
            } catch (error) {
                console.log('An error occurred', error);
                setSuccess(false);
            }
        } else {
            setSuccess(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageSize(window.innerWidth > 768);
            const handleResize = () => {
                setPageSize(window.innerWidth > 768)
            }
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        }
    })


    return (
        <div className='bg-paleblue px-10 py-2 mb-5 rounded-xl'>

            <div className={pageSize ? 'hidden' : 'col-span-2 flex justify-end py-1'}>
                <Select onChange={handleCategoryChange} defaultValue="" required={true} className='font-mainFont'>
                    <option value="" disabled hidden>Category</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Spoilers">Spoilers</option>
                    <option value="Question">Question</option>
                    <option value="Rant">RANT</option>
                </Select>
            </div>

            {success === false && <p className={` py-0 my-0 text-center font-poppinsMed text-red-900`}>Please enter a Title AND choose a Category to post.</p>}
            <div className={pageSize ? 'grid grid-cols-12 items-center gap-3 py-1' : "grid grid-cols-5 pb-2"}>
                <Label htmlFor="base" value="Title*:" className='col-span-1 text-lg mt-1' />
                <TextInput onChange={handleTitleChange} theme={customInput} placeholder="What is the topic?" id="base" type="text" sizing="post" className={pageSize ? 'col-span-9' : 'col-span-4'} required />
                <div className={pageSize ? 'col-span-2 flex justify-center' : 'hidden'}>
                    <Select onChange={handleCategoryChange} defaultValue="" required={true} className='font-mainFont'>
                        <option value="" disabled hidden>Category</option>
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
                            handleTagsChange(e.value?.join(",") ?? "")
                        }
                        }
                            placeholder={"Press 'Enter' to separate tags"} separator="," />
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
                    value={expandValue}
                    className={pageSize ? 'col-span-11 w-full font-mainFont rounded-lg border-0 focus-within:border-0 focus-within:ring-0 px-5' : 'col-span-4 w-full font-mainFont rounded-lg border-0 focus-within:border-0 focus-within:ring-0 px-5'}
                />
                {/* <TextInput theme={customInput} id="base3" type="text" sizing="post" className='col-span-11 w-full' /> */}
            </div>
            <div className='flex flex-1 justify-end'>
                <button onClick={handleSubmit} className='bg-offwhite px-3 py-1.5 mt-2 font-poppinsMed text-darkbrown rounded-md'>Add Post</button>
            </div>
        </div>
    )
}

export default CreatePostComponent
