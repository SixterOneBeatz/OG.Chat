import { createContext, useState } from 'react';

export const ChatRoomContext = createContext({
  userName: '',
  setUserName: name => {},
  messages: [],
  addMessage: msg => {},
  resetMessages: () => {},
});

const ChatRoomContextProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [msgs, setMsgs] = useState([]);
  return (
    <ChatRoomContext.Provider
      value={{
        userName: user,
        setUserName: name => setUser(name),
        messages: msgs,
        addMessage: msg => setMsgs([...msgs, msg]),
        resetMessages: () => setMsgs([]),
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};

export default ChatRoomContextProvider;
