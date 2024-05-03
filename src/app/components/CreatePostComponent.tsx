import React, { useEffect, useRef, useState } from 'react'
import { Chips } from 'primereact/chips'
import useAutosizeTextArea from "@/utils/useAutosizeTextArea";
import { TextInput, Label, Dropdown, Select } from 'flowbite-react';
import { createPost, getPostsByClubId } from '@/utils/DataServices';
import { IPostData, IPosts } from '@/Interfaces/Interfaces';
import { useClubContext } from '@/context/ClubContext';

type CreatePostType =  {
    setPosts: React.Dispatch<React.SetStateAction<IPosts[]>>
}
const CreatePostComponent = ({setPosts}:CreatePostType) => {

    const info = useClubContext();
    const [value, setValue] = useState<any>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const [id, setId] = useState<number>(0)
    const [userId, setUserId] = useState<number | undefined>(0);
    const [clubId, setClubId] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const [clubName, setClubName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
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

    const handleTitleChange = (title: string) => {
        setTitle(title);
    };

    const handleCategoryChange = (category: string) => {
        setCategory(category);
    };

    const handleTagsChange = (tag: string) => {
       let tags = tag.replace(/[\s,]+/g, ',')
        setTags(tags);
    };

    const handleSubmit = async () => {
        let userId = Number(localStorage.getItem("UserId"));
        try {
          // datecreated is auto filled in the backend
        
          if(title === ''){
              alert("Please Enter a Title.")
              setErrors(true);
            }
          else if(category === "Category"){
            alert("Please choose a Category.")
            setErrors(true);
        }
        else if(expandValue === ''){
            alert("Please enter the Post.")
            setErrors(true);
          }else{
            setErrors(false);
          }

        if(!hasErrors){

            const postData: IPostData = {
                id,
                userId,
                clubId: info.displayedClub!.id,
                title,
                category: category,
                tags: tags ?? null,
                description: expandValue,
                image: null, //TODO add a way to add images
                dateUpdated: null,
                isDeleted: false
            };
            const data = await createPost(postData);

            if(data){
                resetValues()
                    const getPosts = await getPostsByClubId(info.displayedClub!.id);
                    setPosts(getPosts);
            }
            console.log(data)
   
            
        }
        
            
        } catch (error) {
            console.log('An error occurred', error);
        }
    };


    return (
        <div className='bg-paleblue px-10 py-2 mb-5 rounded-xl'>
            <div className='grid grid-cols-12 items-center gap-3 py-1'>
                <Label htmlFor="base" value="Title:" className='col-span-1 text-lg' />
                <TextInput onChange={(e)=>handleTitleChange(e.target.value)} value={title} theme={customInput} placeholder="What is the topic?" id="base" type="text" sizing="post" className='col-span-9' required />
                <div className='col-span-2 flex justify-center'>
                    <Select onChange={(e)=> handleCategoryChange(e.target.value)} value={category} id='myDropdown' defaultValue={"Category"} required={true} className='font-mainFont'>
                        <option value="Category" disabled>Category</option>
                        <option value="Discussion">Discussion</option>
                        <option value="Spoilers">Spoilers</option>
                        <option value="Question">Question</option>
                        <option value="Rant">RANT</option>
                    </Select>
                </div>
            </div>
            <div className='grid grid-cols-12 items-center gap-3 py-1'>
                <Label htmlFor="base2" value="Tags:" className='col-span-1 text-lg' />
                <div className="card p-fluid col-span-11">
                    {value !== undefined && value !== null && (
                        <Chips className='' value={value} onChange={(e) =>{

                            setValue(e.value)
                            handleTagsChange(e.value?.join(",") ?? "")
                        } 
                        }
                        placeholder='Enter to separate tags' separator="," />
                    )}
                </div>
            </div>
            <div className='grid grid-cols-12 items-center gap-3 py-1'>
                <Label htmlFor="base3" value="Post:" className='col-span-1 text-lg' />
                <textarea
                    required
                    id="review-text"
                    onChange={(e)=>handleChange(e.target.value)}
                    ref={textAreaRef}
                    placeholder='Write your thoughts...'
                    rows={1}
                    value={expandValue}
                    className='col-span-11 w-full font-mainFont rounded-lg border-0 focus-within:border-0 focus-within:ring-0 px-5'
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
