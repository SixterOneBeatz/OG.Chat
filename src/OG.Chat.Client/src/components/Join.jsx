import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startConnection } from '../services/SignalRService';
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from '../redux/chatRoomSlice';
import { useLazyJoinQuery } from '../services/ChatRoomService';

const Join = () => {
  
  const navigate = useNavigate();
  
  const userName = useSelector(state => state.chatRoom.username);
  const dispatch = useDispatch();
  const [trigger, result, lastPromiseInfo] = useLazyJoinQuery();

  useEffect(() => {
    if (userName !== '') {
      navigate('/chatroom');
    }
  }, []);

  const handleJoin = e => {
    e.stopPropagation();
    if (userName !== '') {
      trigger(userName)
        .unwrap()
        .then(async response => {
          await startConnection();
          navigate('/chatroom');
        })
        .catch(err => console.error(err));
    }
  };

  const handleChange = e => {
    dispatch(setUsername(e.target.value));
  }

  return (
    <>
      <input
        type='text'
        placeholder='Username...'
        onChange={handleChange}
        value={userName}
      />
      <button onClick={handleJoin}>Join</button>
    </>
  );
};

export default Join;
