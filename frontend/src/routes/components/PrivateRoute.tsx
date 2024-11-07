import * as React from "react";
import {useAppSelector} from "../../hooks/redux.ts";
import {authSelectors} from "../../features/auth/authSlice.ts";
import {Navigate} from "react-router-dom";
import {Routes} from "../../types/routes.ts";
import {FC} from "react";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = (
    {children}: PrivateRouteProps
) => {
    const isUserAuthenticated = useAppSelector(authSelectors.getIsAuthenticated);

    if (!isUserAuthenticated) {
        return <Navigate to={Routes.LoginPage}/>;
    }


    return <>{children}</>;
};
