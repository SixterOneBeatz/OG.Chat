import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startListening } from '../services/SignalRService';
import {
  addMessage,
  resetMessages,
  setRoomname,
  setUsername,
  replaceMessages,
} from '../redux/chatRoomSlice';
import { useSelector, useDispatch } from 'react-redux';
import {
  useSendMessageMutation,
  useLeaveMutation,
  useLazyGetMessagesQuery,
} from '../services/ChatRoomService';

const ChatRoom = () => {
  const { username, roomname, messages } = useSelector(state => state.chatRoom);
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();
  const [leave] = useLeaveMutation();
  const [getInitialMessages] = useLazyGetMessagesQuery(roomname);

  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const handleSend = e => {
    e.stopPropagation();
    sendMessage({ roomname, username, message })
      .unwrap()
      .then(response => setMessage(''))
      .catch(err => console.error(err));
  };

  const handleReset = () => dispatch(resetMessages());

  const handleLeave = () => {
    leave({ roomname, username })
      .unwrap()
      .then(response => {
        dispatch(setRoomname(''));
        dispatch(setUsername(''));
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (username === '' && roomname === '') {
      navigate('/');
    } else {
      getInitialMessages(roomname)
        .unwrap()
        .then(response => dispatch(replaceMessages(response)))
        .catch(err => console.error(err));
    }

    startListening(hubResponse => dispatch(addMessage({ ...hubResponse })));
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
      <button onClick={handleLeave}>Leave</button>
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
