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

export interface IPosts {
    id: number,
    userId: number,
    clubId: number,
    title: string,
    category: string,
    tags: string,
    description: string,
    image: string,
    likes: number,
    dateCreated: string,
    dateUpdated: string,
    isDeleted: boolean
}