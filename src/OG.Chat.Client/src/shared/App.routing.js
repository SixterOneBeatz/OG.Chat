import { createHashRouter } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom';
import Join from '../components/Join';

export const router = createHashRouter([
  {
    path: '/',
    element: <Join />,
  },
  {
    path: 'chatroom',
    element: <ChatRoom />,
  },
]);
