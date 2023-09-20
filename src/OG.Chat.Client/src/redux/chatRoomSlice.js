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
        }
    }
});

export const { setUsername, setRoomname, addMessage, resetMessages } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;