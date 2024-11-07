import * as React from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {Loading} from "../../components/Loading";
import {useEffect} from "react";
import {authSelectors, authSlice} from "./authSlice.ts";
import {requestMe} from "../../api";
import {useSelector} from "react-redux";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(authSelectors.getIsAuthenticated);
    const user = useAppSelector(authSelectors.getUser);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        const fetchUser = async () => {
            try {
                const data = await requestMe();
                dispatch(authSlice.actions.setUser(data));
            } catch (e) {
                console.error(e);
            }
        }
        fetchUser().then().catch()
    }, [dispatch, isAuthenticated]);

    if (isAuthenticated && !user) {
        return <Loading/>;
    }

    return <>{children}</>;
};
