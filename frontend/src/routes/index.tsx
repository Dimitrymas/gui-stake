import {createBrowserRouter} from 'react-router-dom';
import {Routes} from "../types/routes.ts";
import {PrivateRoute} from "./components/PrivateRoute.tsx";
import {LoginPage} from "../pages/LoginPage";
import {PublicRoute} from "./components/PublicRoute.tsx";
import {RegisterPage} from "../pages/RegisterPage";
import {HomePage} from "../pages/HomePage";
import {Layout} from "../components/Layout";
import {SettingsPage} from "../pages/SettingsPage";


const router = createBrowserRouter([
    {
        path: Routes.LoginPage,
        element: <PublicRoute><LoginPage/></PublicRoute>
    },
    {
        path: Routes.RegisterPage,
            element: <PublicRoute><RegisterPage/></PublicRoute>
    },
    {
        path: "/",
        element: <PrivateRoute><Layout/></PrivateRoute>,
        children: [
            {
                path: Routes.HomePage,
                element: <HomePage/>
            },
            {
                path: Routes.SettingsPage,
                element: <SettingsPage/>
            }
        ]
    }
]);

export default router;
