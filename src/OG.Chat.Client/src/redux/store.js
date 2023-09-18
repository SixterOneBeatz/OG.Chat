import { configureStore } from "@reduxjs/toolkit";
import chatRoomReducer from './chatRoomSlice'

export default configureStore({
    reducer: {
        chatRoom: chatRoomReducer
    }
});