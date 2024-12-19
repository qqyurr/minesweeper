import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/boardSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "board",
  storage,
  whitelist: ["difficulty", "rows", "cols", "mines"],
};

const persistedReducer = persistReducer(persistConfig, boardReducer);

export const store = configureStore({
  reducer: {
    board: persistedReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
