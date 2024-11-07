import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authReducer, IAuthState} from "../features/auth/authSlice.ts";
import {settingsReducer, ISettingsState} from "../features/settings/settingsSlice.ts";
import {ITelegramState, telegramReducer} from "../features/telegram/telegramSlice.ts";
import {appReducer, IAppState} from "../features/app/appSlice.ts";

export interface IRootState {
    authReducer: IAuthState;
    settingsReducer: ISettingsState;
    telegramReducer: ITelegramState;
    appReducer: IAppState;
}

const rootReducer = combineReducers({
    authReducer,
    settingsReducer,
    telegramReducer,
    appReducer,
})

export const store = configureStore({
    devTools: import.meta.env.MODE !== 'production',
    reducer: rootReducer,
});


export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
