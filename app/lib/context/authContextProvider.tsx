/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import useLocalStorage from 'use-local-storage';
import { createContext, useState } from 'react';
import SignupResponse from '../network/auth/AuthResponse';
import AuthResponse from '../network/auth/AuthResponse';

interface UserAuthContextProps {
    auth: Omit<AuthResponse, 'message'> | null;
    setAuth: (auth: AuthResponse) => void;
}

const AuthContext = createContext({} as UserAuthContextProps);

export function AuthContextProvider({ children }: {
    children: React.ReactNode
}) {

    const [auth, setAuthUser] = useLocalStorage('fundfair', {} as Omit<AuthResponse, 'message'>)
    const setAuth = (userAuth: Omit<AuthResponse, 'message'>) => setAuthUser(userAuth);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;