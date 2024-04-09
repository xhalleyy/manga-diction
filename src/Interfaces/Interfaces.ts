export interface IUserData {
    id: number
    username: string
    firstName: string
    lastName: string
    age: number
    password: string
}

export interface ILoginUserInfo {
    username: string
    password: string
}

export interface IToken {
    token: string
}

export interface IClubs {
    id: number;
    leaderId: number;
    clubName: string;
    image: string;
    description: string;
    dateCreated: string;
    isPublic: boolean;
    isDeleted: boolean;
}