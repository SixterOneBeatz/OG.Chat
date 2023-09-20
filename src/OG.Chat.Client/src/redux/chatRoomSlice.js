import { createSlice } from "@reduxjs/toolkit";

export const chatRoomSlice = createSlice({
    name: 'chatRoom',
    initialState: {
        username: '',
        roomname: '',
        messages: []
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setRoomname: (state, action) => {
            state.roomname = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        resetMessages: (state) => {
            state.messages = [];
        },
        replaceMessages: (state, action) => {
            state.messages = action.payload
        }
    }
});

export const { setUsername, setRoomname, addMessage, resetMessages, replaceMessages } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;