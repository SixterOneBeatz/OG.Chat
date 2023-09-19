import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import chatRoomReducer from './chatRoomSlice'
import { chatRoomApi } from "../services/ChatRoomService";

export const store = configureStore({
    reducer: {
        chatRoom: chatRoomReducer,
        [chatRoomApi.reducerPath] : chatRoomApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(chatRoomApi.middleware)
});

setupListeners(store.dispatch);

export default store;