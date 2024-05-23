export interface IUserData {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    age: number;
    profilePic: string | null;
}

export interface IUpdateUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    age: number;
    profilePic: string | null;
    currentPassword: string | null;
    newPassword: string | null;
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
    isMature: boolean,
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
            name: string
            volume: string,
            fileName: string
        }
    }]
}

export interface IGetLikes {
    likesCount: number
    likedByUsers: [{
        userId: number
        username: string
    }]
}

export interface IUserLikes {
    postId: number
    commentId: number
    userId: number
    likes: IGetLikes
}

export interface IComments {
    id: number,
    userId: number,
    reply: string,
    postedAt: string,
    postId: number,
    parentCommentId: number | null,
    user: {
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        age: number,
        profilePic: string
    }
}

export interface IFavManga {
    id: number,
    userId: number,
    mangaId: string,
    completed: boolean
}

export interface IAcceptedFriends {
    id: number
    username: string,
    firstName: string,
    lastName: string,
    age: number,
    profilePic: string,
    salt: string,
    hash: string
}

export interface IPendingFriends {
    id: number,
    userId: number,
    friendId: number,
    status: 0,
}

export interface IUserDataWithRequestId extends IUserData {
    requestId: number;
}

export interface LikedUser {
    userId: number | string;
    username: string;
}

export interface IPendingMembers {
    clubName: string
    clubId: number
    members: [
        {
            id: number
            memberId: number
            name: string
            profilepic: string
        }
    ]
}

export interface IGetManga {
    name: string,
    tagInput: string[],
    demographic: string,
    status: string
}