import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice"; //


import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// 1. Persist config
const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

// 2. Combine reducers
const rootReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice //
});

// 3. Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

// 5. Export persistor
export const persistor = persistStore(store);