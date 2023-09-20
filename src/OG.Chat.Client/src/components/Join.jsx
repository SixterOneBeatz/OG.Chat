import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startConnection } from '../services/SignalRService';
import { useSelector, useDispatch } from 'react-redux';
import { setRoomname, setUsername } from '../redux/chatRoomSlice';
import { useJoinMutation } from '../services/ChatRoomService';

const Join = () => {
  const navigate = useNavigate();

  const { username, roomname } = useSelector(state => state.chatRoom);
  const dispatch = useDispatch();
  const [join] = useJoinMutation();

  useEffect(() => {
    if (username !== '' && roomname !== '') {
      navigate('/chatroom');
    }
  }, []);

  const handleJoin = e => {
    e.stopPropagation();
    if (username !== '' && roomname !== '') {
      join({ roomname, username })
        .unwrap()
        .then(async response => {
          await startConnection();
          navigate('/chatroom');
        })
        .catch(err => console.error(err));
    }
  };

  const handleUsernameChange = e => {
    dispatch(setUsername(e.target.value));
  };

  const handleRoomnameChange = e => {
    dispatch(setRoomname(e.target.value));
  };

  return (
    <>
      <input
        type='text'
        placeholder='Username...'
        onChange={handleUsernameChange}
        value={username}
      />
      <input
        type='text'
        placeholder='Room...'
        onChange={handleRoomnameChange}
        value={roomname}
      />
      <button onClick={handleJoin}>Join</button>
    </>
  );
};

export default Join;
