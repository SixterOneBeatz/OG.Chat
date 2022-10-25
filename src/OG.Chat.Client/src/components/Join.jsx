import { useContext, useEffect, useState } from 'react';
import { ChatRoomContext } from '../contexts/ChatRoomContextProvider';
import { useNavigate } from 'react-router-dom';
import { ChatRoomService } from '../services/ChatRoomService';
import { startConnection } from '../services/SignalRService';

const Join = () => {
  let chatRoomContext = useContext(ChatRoomContext);
  let navigate = useNavigate();

  const [userName, setUserName] = useState(chatRoomContext.userName);

  useEffect(() => {
    if (chatRoomContext.userName !== '') {
      navigate('chatroom');
    }
  }, []);

  const handleJoin = e => {
    e.stopPropagation();
    if (chatRoomContext.userName !== '') {
      ChatRoomService.join(chatRoomContext.userName)
        .then(async response => {
          await startConnection();
          navigate('/chatroom');
        })
        .catch(err => console.error(err));
    }
  };

  useEffect(() => chatRoomContext.setUserName(userName), [userName]);

  return (
    <>
      <input
        type='text'
        placeholder='Username...'
        onChange={e => setUserName(e.target.value)}
        value={userName}
      />
      <button onClick={handleJoin}>Join</button>
    </>
  );
};

export default Join;
