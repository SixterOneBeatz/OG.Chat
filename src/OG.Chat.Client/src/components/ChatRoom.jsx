import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoomService } from '../services/ChatRoomService';
import { startListening } from '../services/SignalRService';
import { addMessage, resetMessages } from '../redux/chatRoomSlice';
import { useSelector, useDispatch } from "react-redux";

const ChatRoom = () => {
  const { username, messages } = useSelector(state => state.chatRoom);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const handleSend = e => {
    e.stopPropagation();
    ChatRoomService.sendMessage(username, message)
      .then(response => setMessage(''))
      .catch(err => console.error(err));
  };

  const handleReset = () => dispatch(resetMessages());

  useEffect(() => {
    if (username === '') {
      navigate('/');
    }

    startListening((hubResponse) => dispatch(addMessage({...hubResponse})));
  }, []);

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
        {messages.map(
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
