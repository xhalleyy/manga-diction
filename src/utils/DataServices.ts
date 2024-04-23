import { IClubs, ILoginUserInfo, IMemberToClubAssociation, IPosts, IToken, IUserData } from "@/Interfaces/Interfaces";
import axios from 'axios';

const url = 'https://mangadictionapi.azurewebsites.net/';
let userData: IClubs
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
    if(!res.ok){
        const message = 'an error has occured! ' + res.status;
        throw new Error(message);
    }

    const data = await res.json()
    // console.log(data);
}

// FETCH FOR LOGIN
export const login = async(loginUser: ILoginUserInfo) => {
    const res = await fetch(url + 'User/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginUser)
    })

    if(!res.ok){
        const message = 'an error has occured! ' + res.status;
        throw new Error(message);
    }

    const data: IToken = await res.json();
    // console.log(data);
    return data;
}

// FETCH FOR CHECKING LOGIN TOKEN
export const checkToken = () => {
    let result = false;
    let isData = localStorage.getItem("Token");

    if(isData != null){
        result = true;
    }

    return result;
}

// ----------------- CLUB API FETCHES -----------------------
// FETCH FOR CREATING CLUB
export const createClub = async (Club: IClubs) => {
    const res = await fetch(url + 'Club/CreateClub', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(Club)
    });

    if(!res.ok){
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json;
    return data;
    
}

// FETCH FOR UPDATING CLUBS
export const updateClubs = async (Club: IClubs) => {
    const res = await fetch(url + 'Club/UpdateClub/', {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(Club)
    });

    if(!res.ok){
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

// FETCH FOR GETTING CLUB BY LEADERS
export const getClubItemsByLeaderId = async (leaderId: number) => {
    const res = await fetch(url + 'Club/GetClubById/' + leaderId)
    const data = await res.json();
    // console.log(data);
    return data;
}

// getClubItemsByLeaderId(1);

export const loggedInData = () => {
    return userData;
}

// Get Public Clubs
export const publicClubsApi = async() => {
    const promise = await fetch('https://mangadictionapi.azurewebsites.net/Club/GetAllClubs');
    const data: IClubs[] = await promise.json();
    // console.log(data);
    return data;
}

// GET CLUB BY ID
export const specifiedClub = async(clubId: number) => {
    const promise = await fetch(url + '/Club/GetClubById/' + clubId);
    const data: IClubs = await promise.json();
    console.log(data);
    return data;
}

publicClubsApi();

// ----------------- MANGADEX API -------------------------
// for example: https://api.mangadex.org/manga?limit=10&title=shingeki&includedTags%5B%5D=391b0423-d847-456f-aff0-8b0cfc03066b&includedTagsMode=AND&excludedTagsMode=OR&status%5B%5D=completed&publicationDemographic%5B%5D=shounen&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc
const mangaUrl: string = 'https://api.mangadex.org';

export const getTags = async (includedTagNames: string[]) => {
    const tagsResponse = await axios.get(`${mangaUrl}/manga/tag`);
    const includedTagIDs: string[] = tagsResponse.data.data
        .filter((tag: any) => includedTagNames.includes(tag.attributes.name.en))
        .map((tag: any) => tag.id);
    return { includedTagIDs };
};

export const mangaSearch = async (title: string, author: string, includedTagIDs: string[], status: string[], contentRating: string[]) => {
    const queryParams = new URLSearchParams({
        limit: '10',
        title: title,
        authorOrArtist: author,
        includedTagsMode: 'AND',
        excludedTagsMode: 'OR',
        'order[latestUploadedChapter]': 'desc'
    });

    // Add includedTagIDs to query string if present
    if (includedTagIDs.length > 0) {
        includedTagIDs.forEach(tagId => {
            queryParams.append('includedTags[]', tagId);
        });
    }

    // Add status to query string if present
    if (status.length > 0) {
        status.forEach(s => {
            queryParams.append('status[]', s);
        });
    }

    // Add contentRating to query string if present
    if (contentRating.length > 0) {
        contentRating.forEach(rating => {
            queryParams.append('contentRating[]', rating);
        });
    }

    const res = await axios.get(`${mangaUrl}/manga?${queryParams}`);
    return res.data.data.map((manga: any) => manga.id);
};

// GET MANGA BY ID
export const specificManga = async(mangaId: string) => {
    const promise = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes%5B%5D=cover_art`)
    const data = await promise.json();
    return data;
}

// ------------------------ POST API FETCHES -----------------------
// GET POSTS BY CLUB ID 
export const getPostsByClubId = async( clubId: number) => {
    const res = await fetch(url + 'Post/GetAllPostsInClub/' + clubId)
    const data: IPosts[] = await res.json();
    // console.log(data);
    return data;
}

// ---------------------- USERS API FETCHES ------------
// GET USER INFO
export const getUserInfo = async(userId: number) => {
    const res = await fetch(url + 'User/GetUser/' + userId);
    const data: IUserData = await res.json();
    console.log(data)
    return data;
}

// UPDATE USER INFO
export const updateUser = async(User: IUserData) => {
    const res = await fetch(url + 'User/UpdateUser/', {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(User)
    });

    if(!res.ok){
        const message = 'An error has occured: ' + res.status;
        throw new Error(message);
    }

    const data = await res.json();
    return data;
}

// ----------------- CLUB MEMBERS API FETCHES--------------
// GET USER'S CLUBS
export const getUserClubs = async(userId: number ) => {
    const res = await fetch(url + '/Member/GetUserClubs/' + userId);
    const data: number[] = await res.json();
    console.log(data);
    return data;
}

// GET CLUB'S MEMBERS
export const getClubMembers = async(clubId: number | undefined) => {
    const res = await fetch(url + '/Member/GetClubMembers/' + clubId);
    const data: number[] = await res.json();
    console.log(data);
    return data;
}

// ADD USER TO CLUB
export const AddUserToClub = async(userId: number, clubId: number) => {
    const res = await fetch(`${url}Member/AddMemberToClub?userId=${userId}&clubId=${clubId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
    });

    const data = res.json();
    console.log(data);
    return data;
}