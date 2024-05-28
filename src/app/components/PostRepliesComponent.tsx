import { useClubContext } from '@/context/ClubContext';
import React, { useEffect, useRef, useState } from 'react';
import { AddLikeToComment, GetLikesByComment, RemoveLikeFromComment, addCommentToPost, addReplyToComment, deleteComment, getComments, getPostById, getRepliesFromComment, getUserInfo, specifiedClub } from '@/utils/DataServices';
import PostsComponent from './PostsComponent';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { IClubs, IComments, IGetLikes, ILikedByUsers, IPostData, IUserData, LikedUser } from '@/Interfaces/Interfaces';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { Avatar, Button, CustomFlowbiteTheme, Modal } from 'flowbite-react';
import useAutosizeTextArea from "@/utils/useAutosizeTextArea";
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import { Tooltip } from '@mui/material';
import { File } from 'react-kawaii'


const PostRepliesComponent = () => {
    const { selectedPostId } = useClubContext();
    const [post, setPost] = useState<IPostData | null>(null);
    const [club, setClub] = useState<IClubs | null>(null);
    const [postUser, setPostUser] = useState<IUserData | null>(null);
    const [parentComments, setParentComments] = useState<IComments[]>([]);
    // const [allReplies, setAllReplies] = useState<{ [key: number]: IComments[] }>({});

    const [likes, setLikes] = useState<number>(0);
    const [allLikesTopComments, setAllLikesTopComments] = useState<{ [key: number]: IGetLikes }>({});
    const [userLikedTopComments, setUserLikedTopComments] = useState<{ [key: number]: boolean }>({});
    const [allReplies, setAllReplies] = useState<{ [key: number]: IComments[] }>({});
    const [allLikesReplies, setAllLikesReplies] = useState<{ [key: number]: IGetLikes }>({});
    const [userLikedReplies, setUserLikedReplies] = useState<{ [key: number]: boolean }>({});

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [expandValue, setExpandValue] = useState<string>("");
    const [replyValue, setReplyValue] = useState("");
    const [validInput, setValidInput] = useState(false);
    // const [newReplies, setNewReplies] = useState<{ [key: string]: boolean }>({});
    const [validReply, setValidReply] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [commentToDeleteId, setCommentToDeleteId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const maxCharacters = 300;
    const userId = Number(localStorage.getItem("UserId"));

    useAutosizeTextArea(textAreaRef.current, expandValue);

    const handleChange = (expand: string) => {
        if (expand.length > 0 && expand.length <= maxCharacters) {
            setExpandValue(expand);
            setValidInput(true);
        } else {
            setExpandValue(expand)
            setValidInput(false);
        }
    };

    const handleReplyChange = (text: string) => {
        if (text.length > 0 && text.length <= maxCharacters) {
            setReplyValue(text);
            setValidReply(true);
        } else {
            setReplyValue(text)
            setValidReply(false);
        }
    }

    const fetchedPost = async () => {
        try {
            const userId = localStorage.getItem("UserId");
            if (selectedPostId !== null) {
                const getPost = await getPostById(selectedPostId);
                setPost(getPost);

                const getClub = await specifiedClub(getPost.clubId);
                setClub(getClub);

                const memberInfo = await getUserInfo(getPost.userId);
                setPostUser(memberInfo);

                // getting all top level comments for the posts
                const topComments = await getComments(getPost.id);
                setParentComments(topComments);

                // from these comments, we are then getting the likes (like count and list of users)
                const likesDataTopComments = await Promise.all(
                    topComments.map(async (comment: IComments) => {
                        const likes = await GetLikesByComment(comment.id);
                        // this checks if the current user has liked each comment 
                        const isUserLiked = (likedByUsers: ILikedByUsers[], userId: number) => {
                            for (let i = 0; i < likedByUsers.length; i++) {
                                if (likedByUsers[i].userId === userId) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        const userLiked = isUserLiked(likes.likedByUsers, Number(userId));
                        // console.log(`Comment ID: ${comment.id}, Is User Liked: ${userLiked}`);
                        return { commentId: comment.id, likes, isUserLiked: userLiked };
                    })
                );

                // Combine likes data for top-level comments into one object
                const allLikesTopComments = likesDataTopComments.reduce((acc, { commentId, likes }) => ({ ...acc, [commentId]: likes }), {});
                const userLikedTopComments = likesDataTopComments.reduce((acc, { commentId, isUserLiked }) => ({ ...acc, [commentId]: isUserLiked }), {});

                setAllLikesTopComments(allLikesTopComments);
                setUserLikedTopComments(userLikedTopComments);

                const repliesData = await Promise.all(
                    topComments.map(async (comment: IComments) => {
                        const replies = await getRepliesFromComment(comment.id);
                        return { commentId: comment.id, replies };
                    })
                );

                // Fetch likes for replies
                const likesDataReplies = await Promise.all(
                    repliesData.flatMap(({ replies }) =>
                        replies.map(async (reply: IComments) => {
                            const likes = await GetLikesByComment(reply.id);
                            const isUserLiked = (likedByUsers: ILikedByUsers[], userId: number) => {
                                for (let i = 0; i < likedByUsers.length; i++) {
                                    if (likedByUsers[i].userId === userId) {
                                        return true;
                                    }
                                }
                                return false;
                            };
                            const userLiked = isUserLiked(likes.likedByUsers, Number(userId));
                            return { replyId: reply.id, likes, isUserLiked: userLiked };
                        })
                    )
                );

                // Combine replies data into one object
                const allRepliesObject = repliesData.reduce((acc, { commentId, replies }) => ({ ...acc, [commentId]: replies }), {});
                setAllReplies(allRepliesObject);

                // Combine likes data for replies into one object
                const allLikesReplies = likesDataReplies.reduce((acc, { replyId, likes }) => ({ ...acc, [replyId]: likes }), {});
                const userLikedReplies = likesDataReplies.reduce((acc, { replyId, isUserLiked }) => ({ ...acc, [replyId]: isUserLiked }), {});

                setAllLikesReplies(allLikesReplies);
                setUserLikedReplies(userLikedReplies);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const handleNewComment = async () => {
        let userId = Number(localStorage.getItem("UserId"));

        if (validInput) {
            // alert("Comment being added...");
            const addComment = await addCommentToPost(selectedPostId, userId, expandValue);

            if (addComment === "Comment added successfully.") {
                fetchedPost();
                setExpandValue('');
            }
        } else {
            alert("Invalid input!");
        }
    };

    const handleNewReply = async (commentId: number) => {
        let userId = Number(localStorage.getItem("UserId"));

        if (validReply) {
            const addReply = await addReplyToComment(commentId, userId, replyValue);

            if (addReply === "Reply added successfully.") {
                fetchedPost();
                setReplyValue('');
            }
        } else {
            alert("Invalid input!");
        }
    }

    const handleToggleReply = (commentId: number) => {
        setSelectedCommentId(prevId => (prevId === commentId ? null : commentId));
    };

    useEffect(() => {
        fetchedPost();
    }, []);

    const toggleLike = async (itemId: number, isParent: boolean) => {
        const userId = Number(localStorage.getItem("UserId"));
        const currentLikesData = await GetLikesByComment(itemId);
        const isUserLiked = currentLikesData.likedByUsers.some(likedUser => likedUser.userId === userId);

        if (isUserLiked) {
            await RemoveLikeFromComment(itemId, userId);
        } else {
            await AddLikeToComment(itemId, userId);
        }

        const updatedLikes = await GetLikesByComment(itemId);
        if (isParent) {
            setUserLikedTopComments(prevState => ({
                ...prevState,
                [itemId]: !isUserLiked,
            }))
            setAllLikesTopComments(prevState => ({
                ...prevState,
                [itemId]: updatedLikes,
            }));
        } else {
            setAllLikesReplies(prevState => ({
                ...prevState,
                [itemId]: updatedLikes,
            }));
            setUserLikedReplies(prevState => ({
                ...prevState,
                [itemId]: !isUserLiked,
            }))
        }
    };

    const handleDeleteComment = async () => {
        try {
            if (commentToDeleteId) {
                await deleteComment(commentToDeleteId);
                setOpenModal(false);
                fetchedPost();
                console.log(commentToDeleteId); // Log the correct comment ID
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const customAvatar: CustomFlowbiteTheme['avatar'] = {
        "root": {
            "base": "flex items-center space-x-4 justify-center rounded",
            "rounded": "rounded-full shadow-lg",
            "size": {
                "md": "h-12 w-12"
            }
        }
    };


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
                        image={postUser.profilePic || "/noprofile.jpg"}
                        dateCreated={post.dateCreated || ''}
                        dateUpdated={post.dateUpdated || ''}
                        isDeleted={post.isDeleted}
                        displayClubName={false}
                        shouldSort={false}
                        onSortCategory={() => { }}
                        onSortTag={() => { }}
                        fetchedPost={fetchedPost}
                        shouldEdit={true}
                    />
                )}
            </div>
            <div className='pt-2 pb-1 px-8 relative'>
                <textarea
                    required
                    onChange={(e) => handleChange(e.target.value)}
                    ref={textAreaRef}
                    placeholder='Add a comment...'
                    rows={1}
                    value={expandValue}
                    className='w-full rounded-lg font-mainFont border-0 focus-within:border-0 focus-within:ring-2 focus-within:ring-cyan-300 px-5 pt-5 pb-6'
                />
                <button onClick={handleNewComment} className='font-mainFont text-white text-md bg-darkerblue px-1.5 rounded-tl-lg rounded-br-lg absolute right-8 bottom-2.5'>Submit</button>
            </div>
            <div className='mx-5'>
                <div>
                    {parentComments.map((comment) => (
                        <div key={comment.id} className='flex flex-col relative rounded-md pt-3 my-2 bg-white/95'>
                            <div className='flex flex-row border-b-2 border-paleblue rounded-md px-14'>
                                {/* <div className='arrow inline-block ms-10 place-content-end mt-6'>
                                    <TurnLeftIcon sx={{ fontSize: 30 }} />
                                </div> */}

                                <div className='flex flex-col place-content-start mt-3'>
                                    <Avatar img={comment.user.profilePic} rounded theme={customAvatar} size="md" className='px-2' />
                                </div>

                                <div className='flex flex-col place-content-center px-3'>
                                    <h1 className='font-poppinsMed'>{comment.user.username}</h1>
                                    <p className='font-mainFont text-[15px]'>{comment.reply}</p>
                                    <div className='inline-flex gap-1 mb-3 mt-1.5 '>
                                        <div onClick={() => toggleLike(comment.id, true)} className={`flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer ${userLikedTopComments[comment.id] ? 'bg-darkblue text-white' : ''}`}
                                        >
                                            <ThumbUpOutlinedIcon sx={{ fontSize: '15px' }} />
                                            <div className='font-mainFont text-[15px]'><p>{allLikesTopComments[comment.id]?.likesCount}</p></div>
                                        </div>
                                        <div onClick={() => handleToggleReply(comment.id)} className='flex border border-black rounded-xl h-[22px] text-black font-normal mr-1 px-5  justify-around items-center gap-3 cursor-pointer'>
                                            <ModeCommentOutlinedIcon sx={{ fontSize: '15px' }} />
                                            <p className='font-mainFont text-[15px]'>{allReplies[comment.id]?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {comment.userId === userId && (
                                    <div className="absolute top-1 right-1 p-3 cursor-pointer">
                                        <Tooltip onClick={() => {
                                            setCommentToDeleteId(comment.id);
                                            setOpenModal(true);
                                        }} title='Delete Post' placement='right' content={undefined}>
                                            <DeleteIcon />
                                        </Tooltip>

                                        <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} popup>
                                            <Modal.Header className='bg-offwhite rounded-t-xl p-5' />
                                            <Modal.Body className='bg-offwhite rounded-b-xl'>
                                                <div className="text-center bg-offwhite">
                                                    <h3 className="bg-offwhite mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                        <div className='grid grid-cols-3'>
                                                            <div className='col-span-1'>
                                                                <File size={100} mood="ko" color="#afdeee " />
                                                            </div>

                                                            <div className='font-mainFont col-span-2'>
                                                                Are you sure you want to delete this comment?
                                                            </div>
                                                        </div>
                                                    </h3>
                                                    <div className="flex justify-end gap-8 bg-offwhite">
                                                        <Button className='bg-mutedred enabled:hover:bg-red-800' onClick={handleDeleteComment}>
                                                            {"Yes, I'm sure"}
                                                        </Button>
                                                        <Button color="gray" onClick={() => setOpenModal(false)}>
                                                            No, cancel
                                                        </Button>
                                                    </div>

                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                )}
                            </div>
                            {selectedCommentId === comment.id && (
                                <div className='py-3 px-8 relative'>
                                    <textarea
                                        required
                                        id="review-text"
                                        onChange={(e) => handleReplyChange(e.target.value)}
                                        ref={textAreaRef}
                                        placeholder='Add a comment...'
                                        rows={1}
                                        value={replyValue}
                                        className='w-full shadow-lg rounded-lg font-mainFont border-0 focus-within:border-0 focus-within:ring-2 focus-within:ring-cyan-300 px-5 pt-5 pb-6'
                                    />
                                    <button onClick={() => handleNewReply(comment.id)} className='font-mainFont text-white text-md bg-darkerblue px-1.5 rounded-tl-lg rounded-br-lg absolute right-[31px] bottom-[17px]'>Submit</button>
                                </div>
                            )}
                            {/* Render replies for each comment */}
                            {allReplies[comment.id] && allReplies[comment.id].map((reply) => (
                                <div key={reply.id} className='flex flex-col mt-3 relative py-3 pl-10  rounded-md'>
                                    <div className='flex flex-row'>
                                        {/* <div className='arrow inline-block ms-20 place-content-end mt-6'>
                                            <TurnLeftIcon sx={{ fontSize: 30 }} />
                                        </div> */}
                                        <div className='inline-block ms-10 place-content-end relative bottom-10 mt-6'>
                                            <Image
                                                src="/replyLine.png"
                                                width={60}
                                                height={60}
                                                alt="Picture of the author"
                                                unoptimized
                                            />

                                        </div>
                                        <div className='flex flex-col place-content-start mt-3'>
                                            <Avatar img={reply.user.profilePic} rounded theme={customAvatar} size="md" className='px-2' />
                                        </div>
                                        <div className='flex flex-col place-content-center px-3'>
                                            <div className='grid grid-cols-2'>
                                                <h1 className='font-poppinsMed'>{reply.user.username}</h1>
                                            </div>
                                            <p className='font-mainFont text-[15px]'>{reply.reply}</p>
                                            <div className='inline-flex gap-1 mb-2 mt-1.5'>
                                                <div onClick={() => toggleLike(reply.id, false)} className={`flex border border-black rounded-xl h-6 text-black font-normal mr-1 px-5 justify-around items-center gap-3 cursor-pointer ${userLikedReplies[reply.id] ? 'bg-darkblue text-white' : ''}`}
                                                >
                                                    <ThumbUpOutlinedIcon sx={{ fontSize: '15px' }} />
                                                    <div className='font-mainFont text-[15px]'><p>{allLikesReplies[reply.id]?.likesCount}</p></div>
                                                </div>

                                                {reply.userId === userId && (
                                                    <div className="absolute top-1 right-1 p-3">
                                                        <Tooltip onClick={() => {
                                                            setCommentToDeleteId(reply.id);
                                                            setOpenModal(true);
                                                        }} title='Delete Post' placement='right' content={undefined}>
                                                            <DeleteIcon />
                                                        </Tooltip>

                                                        <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} popup>
                                                            <Modal.Header />
                                                            <Modal.Body>
                                                                <div className="text-center">
                                                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                        <div>
                                                                            Are you sure you want to delete this comment?
                                                                        </div>

                                                                    </h3>
                                                                    <div className="flex justify-center gap-4">
                                                                        <Button color="failure" onClick={handleDeleteComment}>
                                                                            {"Yes, I'm sure"}
                                                                        </Button>
                                                                        <Button color="gray" onClick={() => setOpenModal(false)}>
                                                                            No, cancel
                                                                        </Button>
                                                                    </div>

                                                                </div>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </div>
                                                )}
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
