import React, { createContext, useContext, useState } from 'react';
import { IUserData } from '@/Interfaces/Interfaces';

type UserContextType = {
    displayedUser: IUserData | null,
    setDisplayedUser: React.Dispatch<React.SetStateAction<IUserData | null>>
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const AppWrapper = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [displayedUser, setDisplayedUser] = useState<IUserData | null>(null); 

    return (
        <UserContext.Provider value={{displayedUser, setDisplayedUser}}>
            {children}
        </UserContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(UserContext);
};