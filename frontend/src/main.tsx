import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import router from "./routes";

import {AuthProvider} from "./features/auth/AuthProvider.tsx";
import {store} from "./store";
import {Provider} from "react-redux";


import './index.css'
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
import "@fontsource/inter/500.css"; // Specify weight
import "@fontsource/inter/600.css"; // Specify weight
import "@fontsource/inter/700.css";
import 'react-toastify/dist/ReactToastify.css';

import {PopupProvider} from "./components/PopupProvider";
import {ToastContainer} from "react-toastify";
import {TelegramProvider} from "./features/telegram/TelegramProvider.tsx"; // Specify weight


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ToastContainer autoClose={3000} theme={'dark'}/>
        <AuthProvider>
            <TelegramProvider>
                <PopupProvider>
                    <RouterProvider router={router}/>
                </PopupProvider>
            </TelegramProvider>
        </AuthProvider>
    </Provider>
)

