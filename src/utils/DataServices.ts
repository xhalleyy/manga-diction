import { IAcceptedFriends, IClubs, IComments, ILoginUserInfo, IMemberToClubAssociation, IPostData, IPosts, IToken, IUpdateUser, IUserData, IFavManga, IPendingFriends, IGetLikes, IPendingMembers, IGetManga, IUserLikes, IPopularClubs, IPostLikes, IMostLikedPost, IMostCommentedPost, ILastChapter, IStatus, TReply } from "@/Interfaces/Interfaces";
import axios from 'axios';

const url = 'https://mangadictionapi.azurewebsites.net/';
// let userData: IClubs
// --------------------- CREATING AN ACCOUNT/ LOGIN ----------------------
// FETCH TO CREATE USER
export const createUser = async (createdUser: IUserData) => {

    const res = await fetch(url + 'User/CreateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createdUser)
    })

    console.log('Response: ' + res)
    if (!res.ok) {
        const message = 'an error has occured! ' + res.status;
        throw new Error(message);
    }

    const data = await res.json()
    console.log(data)
    return data;
    // console.log(data);
}

// FETCH FOR LOGIN
export const login = async (loginUser: ILoginUserInfo) => {
    const res = await fetch(url + 'User/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginUser)
    })

    if (!res.ok) {
        const message = 'an error has occured! ' + res.status;
        console.log(message)
        throw new Error(message);
    }

    const data: IToken = await res.json();
    console.log(data);
    return data;
}

// FETCH FOR CHECKING LOGIN TOKEN
export const checkToken = () => {
    let result = false;
    let isData = localStorage.getItem("Token");

    if (isData != null) {
        result = true;
    }

    return result;
}

// ----------------- CLUB API FETCHES -----------------------
// FETCH FOR CREATING CLUB
export const createClub = async (Club: IClubs) => {
    const res = await fetch(url + 'Club/CreateClub', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Club)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json;
    // console.log(data);
    return data;

}

// FETCH FOR UPDATING CLUBS
export const updateClubs = async (Club: IClubs) => {
    const res = await fetch(url + 'Club/UpdateClub/', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Club)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

// FETCH FOR DELETING CLUBS
export const deleteClub = async (Club: IClubs) => {
    const res = await fetch(url + 'Club/DeleteClub', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Club)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

// Get Public Clubs
export const publicClubsApi = async () => {
    const promise = await fetch('https://mangadictionapi.azurewebsites.net/Club/GetAllClubs');
    const data: IClubs[] = await promise.json();
    // console.log(data);
    return data;
}

// GET CLUB BY ID
export const specifiedClub = async (clubId: number) => {
    const promise = await fetch(url + 'Club/GetClubById/' + clubId);
    const data: IClubs = await promise.json();
    // console.log(data);
    return data;
}

// GET CLUB BY NAME
export const getClubsByName = async (clubName: string | null) => {
    const promise = await fetch(url + 'Club/GetClubsByName/' + clubName);
    const data: IClubs[] = await promise.json();
    // console.log(data);
    return data;
}

// GET CLUB BY LEADER
export const getClubsByLeader = async (userId: number) => {
    try {
        const res = await fetch(url + 'Club/GetClubsByLeader/' + userId)
        if (!res.ok) {
            throw new Error('Failed to fetch clubs by leader');
        }
        const data: IClubs[] = await res.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching clubs by leader:', error);
        return []; // Return an empty array in case of error to ensure clubs is iterable
    }
}

// GET POPULAR CLUBS
export const getPopularClubs = async() => {
    const promise = await fetch(url + 'Club/GetPopularClubs')
    const data: IClubs[] = await promise.json()
    return data;
}

publicClubsApi();

// ----------------- MANGADEX API -------------------------
// for example: https://api.mangadex.org/manga?limit=10&title=shingeki&includedTags%5B%5D=391b0423-d847-456f-aff0-8b0cfc03066b&includedTagsMode=AND&excludedTagsMode=OR&status%5B%5D=completed&publicationDemographic%5B%5D=shounen&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc

export const specificManga = async (mangaId: string) => {
    const promise = await fetch(`${url}GetMangaById/${mangaId}`)
    const data = await promise.json();
    return data;
}

// BACKEND'S MANGADEX POST ENDPOINT
export const searchManga = async(manga: IGetManga) => {
    const res = await fetch(url + 'GetManga', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(manga)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

// FAVORITED MANGA FETCHES 
export const addMangaFav = async (manga: IFavManga) => {
    // console.log(manga.id);
    const res = await fetch(`${url}Favorited/AddFavoriteManga/${manga.userId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(manga)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text();
    // console.log(data);
    return data;
}

export const getInProgessManga = async (userId: number) => {
    const promise = await fetch(url + 'Favorited/GetInProgressFavorites/' + userId)
    const data = await promise.json()
    // console.log(data);
    return data;
}

export const getCompletedManga = async (userId: number) => {
    const promise = await fetch(url + 'Favorited/GetCompletedFavorites/' + userId)
    const data = await promise.json();
    // console.log(data);
    return data;
}

export const removeFavManga = async (userId: number, mangaId: string) => {
    const res = await fetch(`${url}Favorited/DeleteFavoriteManga/${userId}/${mangaId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text();
    // console.log(data)
    return data;
}

export const getLastChapter = async (chapterId: string) => {
    try {
        const res = await fetch(url + 'GetLastChapter/' + chapterId);
        const data: ILastChapter = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching last chapter:', error);
        return null; // Return null in case of errors
    }
}

// ------------------------ POST API FETCHES -----------------------
// GET POSTS BY CLUB ID 
export const getPostsByClubId = async (clubId: number | undefined) => {
    const res = await fetch(url + 'Post/GetAllPostsInClub/' + clubId)
    const data: IPosts[] = await res.json();
    // console.log(data);
    return data;
}

export const getPostById = async (postId: number | null) => {
    const res = await fetch(url + 'Post/GetPostById/' + postId)
    const data: IPosts = await res.json();
    return data;
}

export const updatePosts = async (postData: IPostData) => {
    const res = await fetch(`${url}Post/UpdatePost`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }) 
    
    const data = await res.json();
    console.log(data);
    return data;
}

export const deletePosts = async (postData: IPostData) => {
    const res = await fetch(`${url}Post/DeletePost`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }) 
    
    const data = await res.json();
    console.log(data);
    return data;
}

// GET POSTS BY CATEGORY
export const getPostsByCategory = async (clubId: number, category: string) => {
    const promise = await fetch(`${url}Post/GetPostsByCategory/${clubId}/${category}`)
    const data: IPosts[] = await promise.json()
    return data;
}

export const getPostsByTags = async(clubId: number, tag: string) => {
    const promise = await fetch(`${url}Post/GetPostsByTags/${clubId}/${tag}`)
    const data: IPosts[] = await promise.json()
    return data;
}

// GET POPULAR POSTS
export const getPostsbyMostLiked = async (clubId:number) => {
    const promise = await fetch(url + 'Post/GetPostsByLikes/' + clubId);
    const data: IMostLikedPost[] = await promise.json()
    return data
}

export const getPostsbyComments = async(clubId: number) => {
    const promise = await fetch(url+ 'Post/GetPostsByComments/' + clubId)
    const data: IMostCommentedPost[] = await promise.json()
    return data
}

export const getRecentClubPosts = async(clubId: number) =>{
    const promise = await fetch(url + 'Post/GetRecentlyCreatedPosts/'+ clubId);
    const data: IPosts[] = await promise.json()
    return data;
}


// CREATE POST IN CLUB
export const createPost = async (postData: IPostData) => {
    const clubId = postData.clubId;
    const res = await fetch(`${url}Post/CreateNewPostInClub/${clubId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    // console.log(data);
    return data;
};

// RECENT POSTS FOR A USER
export const getRecentPosts = async (userId: number) => {
    const promise = await fetch(`${url}Post/GetRecentPostsForUserClubs/${userId}`)
    const data: IPosts[] = await promise.json();
    // console.log(data)
    return data;
}

// ---------------------- USERS API FETCHES ------------
// GET USER INFO
export const getUserInfo = async (userId: number | undefined) => {
    const res = await fetch(url + 'User/GetUser/' + userId);
    const data: IUserData = await res.json();
    // console.log(data);
    return data;
}

export const getUserInfoForClubs = async (userId: number | undefined): Promise<IUserData | null> => {
    if (!userId) {
      console.error('User ID is undefined');
      return null;
    }
  
    try {
      const response = await fetch(url + 'User/GetUser/' + userId);
  
      if (!response.ok) {
        console.error(`Error fetching user info: ${response.status} ${response.statusText}`);
        return null;
      }
  
      const text = await response.text(); // Read the raw response as text
      if (!text) {
        console.error(`Empty response for user ID ${userId}`);
        return null;
      }
  
      try {
        const data: IUserData = JSON.parse(text); // Parse the JSON from the response text
        return data;
      } catch (jsonError) {
        console.error(`Error parsing JSON for user ID ${userId}:`, jsonError);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching user info for user ID ${userId}:`, error);
      return null;
    }
  };

// UPDATE USER INFO
export const updateUser = async (user: IUpdateUser) => {
    const res = await fetch(`${url}User/UpdateUser/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (!res.ok) {
        if (res.status === 409) {
            throw new Error('Username already exists. Please choose a different username.');
        } else {
            const message = `An error has occurred: ${res.status}`;
            throw new Error(message);
        }
    }

    const data = await res.text();
    // console.log('User updated:', data);
    return data;
};


// GET USERS BY USERNAMES
export const getUsersByUsername = async (username: string) => {
    const promise = await fetch(url + 'User/GetUsersbyUsername/' + username);
    const data: IUserData[] = await promise.json()
    // console.log(data);
    return data;
}

// ----------------- CLUB MEMBERS API FETCHES--------------
// GET USER'S CLUBS
export const getUserClubs = async (userId: number | undefined) => {
    const res = await fetch(url + '/Member/GetUserClubs/' + userId);
    const data: number[] = await res.json();
    // console.log(data);
    return data;
}

// GET CLUB'S MEMBERS
export const getClubMembers = async (clubId: number | undefined) => {
    const res = await fetch(url + '/Member/GetClubMembers/' + clubId);
    const data: number[] = await res.json();
    // console.log(data);
    return data;
}

// ADD USER TO CLUB
export const AddUserToClub = async (userId: number | undefined, clubId: number | undefined, isLeader: boolean) => {
    const res = await fetch(`${url}Member/AddMemberToClub/${userId}/${clubId}/${isLeader}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

    });

    const data = res.text();
    // console.log(data);
    return data;
}

export const getStatusInClub = async(clubId: number | undefined, userId: number) => {
    const promise = await fetch(`${url}Member/GetUserStatusInClub/${clubId}/${userId}`);
    let data: IStatus = await promise.json()
    return data;
}

// DELETE USER IN CLUB
export const RemoveMember = async (userId: number | undefined, clubId: number | undefined) => {
    const res = await fetch(`${url}Member/RemoveMemberFromClub?userId=${userId}&clubId=${clubId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const data = res.text();
    // console.log(data);
    return data;
}

// GET PENDING REQUESTS 
export const getPendingMemberRequests = async (userId: number) => {
    const promise = await fetch(`${url}Member/GetPendingRequest/${userId}`);
    const data: IPendingMembers[] = await promise.json()
    // console.log(data);
    return data;
}

// HANDING CLUB REQUESTS
export const handlePendingMemberRequests = async (requestId: number, decision: string) => {
    const res = await fetch(`${url}Member/UpdatePendingStatus/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(decision)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text()
    return data;
}


// -----------------  LIKES API FETCHES--------------
export const GetLikesByPost = async (postId: number) => {
    const res = await fetch(`${url}Likes/GetLikesForPost/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data: IPostLikes = await res.json();
    return data;
}

export const GetLikesByComment = async (commentId: number) => {
    const promise = await fetch(`${url}Likes/GetLikesForComment/${commentId}`)
    const data: IGetLikes = await promise.json();
    // console.log(data)
    return data;
}

export const AddLikeToPost = async (postId: number, userId: number) => {
    const res = await fetch(`${url}Likes/AddLikeToPost/${postId}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

export const AddLikeToComment = async (commentId: number, userId: number) => {
    const res = await fetch(`${url}Likes/AddLikeToComment/${commentId}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

export const RemoveLikeFromPost = async (postId: number, userId: number) => {
    const res = await fetch(`${url}Likes/RemoveLike/${postId}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json()
    return data;
}

export const RemoveLikeFromComment = async (commentId: number, userId: number) => {
    const res = await fetch(`${url}Likes/RemoveCommentLike/${commentId}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json()
    return data;
}

// GET USER'S RECENT LIKES (NOTIFICATIONS)
export const getUserPostLikes = async(userId: number) => {
    const promise = await fetch(url + 'Likes/GetPostRecentLikes/' + userId);
    const data: IUserLikes[] = await promise.json()
    return data;
}

export const getUserCommentLikes = async(userId:number) =>{
    const promise = await fetch(url + '/Likes/GetCommentRecentLikes/' + userId);
    const data: IUserLikes[] = await promise.json()
    return data;
}


// ------------------- COMMENTS API FETCHES -----------------------

// GET COMMENT BY ID
export const getCommentById = async (commentId: number)=> {
    const promise = await fetch(url + 'Comment/GetCommentById/' + commentId)
    const data = await promise.json();
    return data;
}

// GET TOP LEVEL REPLIES
export const getComments = async (postId: number) => {
    const promise = await fetch(url + 'Comment/GetPostReplies/' + postId);
    const data = await promise.json();
    // console.log(data)
    return data;
}

// GET REPLIES TO COMMENTS
export const getRepliesFromComment = async (commentId: number) => {
    const promise = await fetch(url + 'Comment/GetRepliesFromComment/' + commentId)
    const data = await promise.json();
    // console.log(data);
    return data;
}

export const addCommentToPost = async (postId: number | null, userId: number, comment: string) => {
    const res = await fetch(`${url}Comment/AddCommentForPost/${postId}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text()
    return data;
}

export const addReplyToComment = async (commentId: number, userId: number, reply: string) => {
    const res = await fetch(`${url}Comment/AddReplyForComment/${commentId}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reply)
    });
    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text()
    return data;
}

export const deleteComment = async (commentId: number) => {
    const res = await fetch(`${url}Comment/DeleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentId)
    })

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text()
    return data;

}

// --------------------- FRIENDS API FETCHES ----------------------
export const getAcceptedFriends = async (userId: number) => {
    const promise = await fetch(url + 'Friend/GetAcceptedFriends/' + userId);
    const data: IAcceptedFriends[] = await promise.json();
    // console.log(data);
    return data;
}

export const addFriend = async (userId: number, friendId: number) => {
    const res = await fetch(`${url}Friend/AddFriend/${userId}/${friendId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text()
    return data;
}

export const getPendingFriends = async (friendId: number) => {
    const promise = await fetch(url + 'Friend/GetPendingFriends/' + friendId);
    const data: IPendingFriends[] = await promise.json();
    // console.log(data)
    return data;
}

export const handlePendingFriends = async (id: number, decision: string) => {
    const res = await fetch(`${url}Friend/HandleFriendRequest/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(decision)
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.text()
    return data;
}

export const deleteAsFriend = async (userId: number, friendId: number) => {
    const res = await fetch(`${url}Friend/DeleteFriend/${userId}/${friendId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }
    const data = await res.text()
    return data;
}

export const GetReplyNotification = async (userId: number) => {
    const res = await fetch(`${url}Notification/GetNotificationByUserId/${userId}`);
    const data : TReply[] = await res.json();
    
    return data;
}
