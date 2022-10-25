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
