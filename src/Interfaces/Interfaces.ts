export interface IUserData {
    id: number
    username: string
    firstName: string
    lastName: string
    age: number
    password: string
    profilePic: string | null
}

export interface ILoginUserInfo {
    username: string
    password: string
}

export interface IToken {
    token: string, 
    userId: number
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

export interface IPostData {
    id: number,
    userId: number,
    clubId: number,
    title: string,
    category: string,
    tags: string | null,
    description: string,
    image: string | null,
    dateCreated?: string,
    dateUpdated: string | null,
    isDeleted: boolean 
}

export interface IPosts {
    id: number,
    userId: number,
    username: string,
    clubId: number,
    clubName: string,
    title: string,
    category: string,
    tags: string,
    description: string,
    image: string,
    dateCreated: string,
    dateUpdated: string,
    isDeleted: boolean
}

export interface IMemberToClubAssociation {
    // id: number,
    userId: number,
    clubId: number
}

export interface IManga {
    data: {
        id: string,
        type: string,
        attributes: {
            altTitles: [{}],
            description: {
                en: string
            },
            createdAt: string,
            updatedAt: string,
            lastChapter: string,
            lastVolume: string,
            publicationDemographic: string,
            state: string,
            status: string,
            tags: [{}],
            title: {
                en: string
            },
            year: number
        },
        relationships: [{
            id: string,
            type: string
            attributes: {
                volume: string,
                fileName: string
            }
        }]
    },
    result: string
}

export interface IGetLikes {
    likesCount: number
    likedByUsers: [{
        userId: string
        username: string
    }]
}
