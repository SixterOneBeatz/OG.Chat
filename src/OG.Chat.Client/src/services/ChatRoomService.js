import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { httpClient } from './HttpClient';

const apiURL = `/ChatRoom`;

const join = userName => httpClient.get(`${apiURL}/Join/${userName}`);

const leave = userName => httpClient.get(`${apiURL}/Leave/${userName}`);

const sendMessage = (userName, message) =>
  httpClient.post(`${apiURL}/SendMessage`, { author: userName, text: message });

export const ChatRoomService = {
  join,
  leave,
  sendMessage,
};

export const chatRoomApi = createApi({
  reducerPath: 'chatRoomApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.API_URL}/ChatRoom/` }),
  endpoints: builder => ({
    join: builder.mutation({
      query: data => ({
        url: `Join`,
        method: 'POST',
        body: { nickName: data.username, roomName: data.roomname },
      }),
    }),
    leave: builder.mutation({
      query: data => ({
        url: `Leave`,
        method: 'POST',
        body: { nickName: data.username, roomName: data.roomname },
      }),
    }),
    sendMessage: builder.mutation({
      query: data => ({
        url: `SendMessage/${data.roomname}`,
        method: 'POST',
        body: { author: data.username, text: data.message },
      }),
    }),
  }),
});

export const { useJoinMutation, useLeaveMutation, useSendMessageMutation } =
  chatRoomApi;
