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
    join: builder.query({
      query: username => ({ url: `Join/${username}` }),
    }),
    leave: builder.query({
      query: username => ({ url: `Leave/${username}` }),
    }),
    sendMessage: builder.mutation({
      query: data => ({
        url: 'SendMessage',
        method: 'POST',
        body: { author: data.username, text: data.message },
      }),
    }),
  }),
});

export const { useLazyJoinQuery, useLazyLeaveQuery, useSendMessageMutation } =
  chatRoomApi;
