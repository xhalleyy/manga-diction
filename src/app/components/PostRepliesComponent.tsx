import { useClubContext } from '@/context/ClubContext'
import React, { useEffect, useState } from 'react'
import { getComments, getPostById, getRepliesFromComment, getUserInfo, specifiedClub } from '@/utils/DataServices';
import PostsComponent from './PostsComponent';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { IClubs, IComments, IPostData, IUserData } from '@/Interfaces/Interfaces';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { Avatar, CustomFlowbiteTheme } from 'flowbite-react'

const PostRepliesComponent = () => {

    const { selectedPostId } = useClubContext();
    const [post, setPost] = useState<IPostData | null>(null);
    const [club, setClub] = useState<IClubs | null>(null);
    const [postUser, setPostUser] = useState<IUserData | null>(null);
    const [parentComments, setParentComments] = useState<IComments[]>([])
    const [replies, setReplies] = useState<IComments[]>([]);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

    // JUST COPY AND PASTED TO GET RID OF ERRORS FOR NOW; NEED TO ADD IN LIKES AND
    const [likes, setLikes] = useState<number>(0);
    const [likedByUsers, setLikedByUsers] = useState<string[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isUnliked, setIsUnliked] = useState<boolean>(false);

    const fetchedPost = async () => {
        // console.log(data);
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
            } else {
                // Handle the case when selectedPostId is null
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchReplies = async (commentId: number) => {
        try {
            const repliesData = await getRepliesFromComment(commentId);
            setReplies(repliesData);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    useEffect(() => {
        fetchedPost();
    }, [selectedPostId]); // Fetch post data whenever selectedPostId changes

    useEffect(() => {
        if (selectedCommentId !== null) {
            fetchReplies(selectedCommentId);
        }
    }, [selectedCommentId]);

    const customAvatar: CustomFlowbiteTheme['avatar'] = {
        "root": {
            "rounded": "rounded-full shadow-lg",
            "size": {
                "md": "h-12 w-12"
            }
        }
    }

    return (
        <>
            <div className='py-2'>
                {post && club && postUser && (
                    <PostsComponent
                        id={post.id}
                        userId={postUser?.id}
                        username={postUser.username || "Unknown User"} // Use optional chaining and provide a default value
                        clubId={post.clubId}
                        clubName={club.clubName || "Default Club Name"}
                        title={post.title}
                        category={post.category}
                        tags={post.tags ? post.tags.split(',') : null}
                        description={post.description}
                        image={postUser.profilePic || "/dummyImg.png"} // Use optional chaining
                        dateCreated={post.dateCreated || ''} // Provide a default value or handle null/undefined
                        dateUpdated={post.dateUpdated || ''}
                        isDeleted={post.isDeleted}
                        displayClubName={false}
                    />
                )

                }
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
                                            <div className='font-mainFont text-[15px]'> <p> {likes} </p></div>
                                        </div>
                                        <div onClick={() => setSelectedCommentId(comment.id)} className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5  justify-around items-center gap-3 cursor-pointer'>
                                            <ModeCommentOutlinedIcon sx={{ fontSize: '15px' }} />
                                            <p className='font-mainFont text-[15px]'>{replies.filter((reply) => reply.parentCommentId === comment.id).length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Conditionally render replies if the comment is selected */}
                            {selectedCommentId === comment.id && (
                                <div>
                                    {replies
                                        .filter((reply) => reply.parentCommentId === comment.id)
                                        .map((reply) => (
                                            <div key={reply.id} className='flex flex-col relative py-3 pl-10 border-b-2 rounded-md'>
                                                <div className='flex flex-row'>
                                                    <div className='arrow inline-block ms-10 place-content-end mt-6'>
                                                        <TurnLeftIcon sx={{ fontSize: 30 }} />
                                                    </div>
                                                    <div style={{ width: '10%' }} className='flex flex-col place-content-start mt-3'>
                                                        {/* Assuming you have the profile picture URL in comment.user.profilePic */}
                                                        <Avatar img={reply.user.profilePic} rounded theme={customAvatar} size="md" />
                                                    </div>
                                                    <div className='flex flex-col place-content-center px-3'>
                                                        <h1 className='font-poppinsMed'>{reply.user.username}</h1>
                                                        <p className='font-mainFont text-[15px]'>{reply.reply}</p>
                                                        <div className='inline-flex gap-1 mb-2 mt-1.5'>
                                                            <div className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                                                                <ThumbUpOutlinedIcon sx={{ fontSize: '15px' }} />
                                                                <div className='font-mainFont text-[15px]'> <p> {likes} </p></div>
                                                            </div>
                                                            <div onClick={() => setSelectedCommentId(comment.id)} className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer'>
                                                                <ModeCommentOutlinedIcon sx={{ fontSize: '15px' }} />
                                                                <p className='font-mainFont text-[15px]'>{replies.filter((reply) => reply.parentCommentId === comment.id).length}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default PostRepliesComponent
