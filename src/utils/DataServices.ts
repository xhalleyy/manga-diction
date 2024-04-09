import { IClubs, ILoginUserInfo, IToken, IUserData } from "@/Interfaces/Interfaces";

const url = 'https://mangadictionapi.azurewebsites.net/';

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
    console.log(data);
}

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
    return data;
}

export const checkToken = () => {
    let result = false;
    let isData = localStorage.getItem("Token");

    if(isData != null){
        result = true;
    }

    return result;
}

// Get Public Clubs
export const publicClubsApi = async() => {
    const promise = await fetch('https://mangadictionapi.azurewebsites.net/Club/GetAllClubs');
    const data: IClubs[] = await promise.json();
    return data;
}