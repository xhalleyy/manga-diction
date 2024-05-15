import { useClubContext } from '@/context/ClubContext';
import React, { useEffect, useRef, useState } from 'react';
import { addCommentToPost, getComments, getPostById, getRepliesFromComment, getUserInfo, specifiedClub } from '@/utils/DataServices';
import PostsComponent from './PostsComponent';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { IClubs, IComments, IPostData, IUserData } from '@/Interfaces/Interfaces';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { Avatar, CustomFlowbiteTheme } from 'flowbite-react';
import useAutosizeTextArea from "@/utils/useAutosizeTextArea";


const PostRepliesComponent = () => {
    const { selectedPostId } = useClubContext();
    const [post, setPost] = useState<IPostData | null>(null);
    const [club, setClub] = useState<IClubs | null>(null);
    const [postUser, setPostUser] = useState<IUserData | null>(null);
    const [parentComments, setParentComments] = useState<IComments[]>([]);
    const [allReplies, setAllReplies] = useState<{ [key: number]: IComments[] }>({});
    const [likes, setLikes] = useState<number>(0);
    const [newComment, setNewComment] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [expandValue, setExpandValue] = useState<string>("");

    useAutosizeTextArea(textAreaRef.current, expandValue);
    const handleChange = (expand: string) => {
        setExpandValue(expand);
    };

    const fetchedPost = async () => {
        try {
            if (selectedPostId !== null) {
                const getPost = await getPostById(selectedPostId);
                setPost(getPost);

                const getClub = await specifiedClub(getPost.clubId);
                setClub(getClub);

                const memberInfo = await getUserInfo(getPost.userId);
                setPostUser(memberInfo);

                const topComments = await getComments(getPost.id);
                setParentComments(topComments);

                // Fetch replies for each comment
                const repliesData = await Promise.all(
                    topComments.map(async (comment: IComments) => {
                        const replies = await getRepliesFromComment(comment.id);
                        return { [comment.id]: replies };
                    })
                );
                // Merge all replies into a single object
                const allRepliesObject = repliesData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setAllReplies(allRepliesObject);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleNewComment = async () => {
        let userId = Number(localStorage.getItem("UserId"));
        const addComment = await addCommentToPost(selectedPostId, userId, expandValue);

        if (typeof addComment === 'object' && 'id' in addComment) {
            setParentComments([...parentComments, addComment as IComments]);
            setExpandValue(''); // Clear the textarea after adding the comment
        }
    }

    useEffect(() => {
        fetchedPost();
    }, [selectedPostId, parentComments]);

    
    const customAvatar: CustomFlowbiteTheme['avatar'] = {
        "root": {
            "rounded": "rounded-full shadow-lg",
            "size": {
                "md": "h-12 w-12"
            }
        }
    };

    const addComment = () => {
        setNewComment(true);
    }

    return (
        <>
            <div className='py-2'>
                {post && club && postUser && (
                    <PostsComponent
                        id={post.id}
                        userId={postUser?.id}
                        username={postUser.username || "Unknown User"}
                        clubId={post.clubId}
                        clubName={club.clubName || "Default Club Name"}
                        title={post.title}
                        category={post.category}
                        tags={post.tags ? post.tags.split(',') : null}
                        description={post.description}
                        image={postUser.profilePic || "/dummyImg.png"}
                        dateCreated={post.dateCreated || ''}
                        dateUpdated={post.dateUpdated || ''}
                        isDeleted={post.isDeleted}
                        displayClubName={false}
                    />
                )}
            </div>
            <div className='py-2 px-10 relative'>
                <textarea
                    required
                    id="review-text"
                    onChange={(e) => handleChange(e.target.value)}
                    ref={textAreaRef}
                    placeholder='Add a comment...'
                    rows={1}
                    value={expandValue}
                    className='w-full rounded-md font-mainFont border-0 focus-within:border-0 focus-within:ring-0 px-5 pt-5 pb-6'
                />
                <button onClick={handleNewComment} className='font-mainFont text-white text-md bg-darkerblue px-1.5 rounded-tl-lg rounded-br-lg absolute right-10 bottom-3.5'>Submit</button>
            </div>
            <div className='bg-white/95 rounded-md'>
                <div>
                    {parentComments.map((comment) => (
                        <div key={comment.id} className='flex flex-col relative pt-3'>
                            <div className='flex flex-row border-b-2 rounded-md'>
                                <div className='arrow inline-block ms-10 place-content-end mt-6'>
                                    <TurnLeftIcon sx={{ fontSize: 30 }} />
                                </div>
                                <div style={{ width: '10%' }} className='flex flex-col place-content-start mt-3'>
                                    <Avatar img={comment.user.profilePic} rounded theme={customAvatar} size="md" />
                                </div>
                                <div className='flex flex-col place-content-center px-3'>
                                    <h1 className='font-poppinsMed'>{comment.user.username}</h1>
                                    <p className='font-mainFont text-[15px]'>{comment.reply}</p>
                                    <div className='inline-flex gap-1 mb-3 mt-1.5 '>
                                        <div className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                                            <ThumbUpOutlinedIcon sx={{ fontSize: '15px' }} />
                                            <div className='font-mainFont text-[15px]'><p>{likes}</p></div>
                                        </div>
                                        <div className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5  justify-around items-center gap-3 cursor-pointer'>
                                            <ModeCommentOutlinedIcon sx={{ fontSize: '15px' }} />
                                            <p className='font-mainFont text-[15px]'>{allReplies[comment.id]?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Render replies for each comment */}
                            {allReplies[comment.id] && allReplies[comment.id].map((reply) => (
                                <div key={reply.id} className='flex flex-col relative py-3 pl-10 border-b-2 rounded-md'>
                                    <div className='flex flex-row'>
                                        <div className='arrow inline-block ms-20 place-content-end mt-6'>
                                            <TurnLeftIcon sx={{ fontSize: 30 }} />
                                        </div>
                                        <div style={{ width: '10%' }} className='flex flex-col place-content-start mt-3'>
                                            <Avatar img={reply.user.profilePic} rounded theme={customAvatar} size="md" />
                                        </div>
                                        <div className='flex flex-col place-content-center px-3'>
                                            <h1 className='font-poppinsMed'>{reply.user.username}</h1>
                                            <p className='font-mainFont text-[15px]'>{reply.reply}</p>
                                            <div className='inline-flex gap-1 mb-2 mt-1.5'>
                                                <div className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                                                    <ThumbUpOutlinedIcon sx={{ fontSize: '15px' }} />
                                                    <div className='font-mainFont text-[15px]'><p>{likes}</p></div>
                                                </div>
                                                {/* <div className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                                                    <ModeCommentOutlinedIcon sx={{ fontSize: '15px' }} />
                                                    <p className='font-mainFont text-[15px]'>{allReplies[reply.id]?.length || 0}</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default PostRepliesComponent;
