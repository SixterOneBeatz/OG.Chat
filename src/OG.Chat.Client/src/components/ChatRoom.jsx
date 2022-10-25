import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoomContext } from '../contexts/ChatRoomContextProvider';
import { ChatRoomService } from '../services/ChatRoomService';
import { hubConnection } from '../services/SignalRService';

const ChatRoom = () => {
  let chatRoomContext = useContext(ChatRoomContext);
  let navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [incomingMsg, setIncomingMsg] = useState({});

  const handleSend = e => {
    e.stopPropagation();
    ChatRoomService.sendMessage(chatRoomContext.userName, message)
      .then(response => {})
      .catch(err => console.error(err));
  };

  const handleReset = () => chatRoomContext.resetMessages();

  useEffect(() => {
    if (chatRoomContext.userName === '') {
      navigate('/');
    }

    if (hubConnection) {
      debugger;
      hubConnection.off('SendMessage');
      hubConnection.on('SendMessage', hubResponse => {
        setIncomingMsg({ ...hubResponse });
      });
    }
  }, []);

  useEffect(() => {
    console.log(incomingMsg);
    chatRoomContext.addMessage(incomingMsg);
  }, [incomingMsg]);

  return (
    <>
      <input
        type='text'
        placeholder='message...'
        onChange={e => setMessage(e.target.value)}
        value={message}
      />
      <button onClick={handleSend}>Send</button>
      <button onClick={handleReset}>Reset</button>
      <ul>
        {chatRoomContext.messages.map(
          (m, i) =>
            m.author !== undefined &&
            m.text !== undefined && (
              <li key={i}>{`(${m.author}): ${m.text}`}</li>
            )
        )}
      </ul>
    </>
  );
};

export default ChatRoom;
