import { createSlice } from "@reduxjs/toolkit";

export const chatRoomSlice = createSlice({
    name: 'chatRoom',
    initialState: {
        username: '',
        messages: []
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        resetMessages: (state) => {
            state.messages = [];
        }
    }
});

export const { setUsername, addMessage, resetMessages } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;