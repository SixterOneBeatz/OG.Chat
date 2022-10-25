import { RouterProvider } from 'react-router-dom';
import ChatRoomContextProvider from './contexts/ChatRoomContextProvider';
import { router } from './shared/App.routing';
export const App = () => {
  return (
    <ChatRoomContextProvider>
      <RouterProvider router={router} />
    </ChatRoomContextProvider>
  );
};
