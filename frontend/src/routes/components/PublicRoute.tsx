import * as React from "react";
import {useAppSelector} from "../../hooks/redux.ts";
import {authSelectors} from "../../features/auth/authSlice.ts";
import {Navigate} from "react-router-dom";
import {Routes} from "../../types/routes.ts";
import {FC} from "react";

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute: FC<PublicRouteProps> = (
    {children}: PublicRouteProps
) => {
    const isUserAuthenticated = useAppSelector(authSelectors.getIsAuthenticated);

    if (isUserAuthenticated) {
        return <Navigate to={Routes.HomePage}/>;
    }

    return <>{children}</>;
};
