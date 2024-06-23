import React, { useContext, useState, useEffect } from 'react';
import { Question } from '../../context/QuestionContext';
import './Host.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Host() {
  const [isLoading, setIsLoading] = useState(true);
  const [roomCode, setRoomCode] = useState(null);
  const [joinedUsers, setJoinedUsers] = useState([]); // Add a state to store the joined users
  const { setRoom } = useContext(Question);
  let navigate = useNavigate();

  useEffect(() => {
    const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000).toString();

    const code = generateRandomCode();
    setRoomCode(code);
    setRoom(code);
    socket.emit('createRoom', code);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setRoom]);

  useEffect(() => {
    socket.on('joinedUsers', (users) => {
      console.log(users);
      setJoinedUsers(users); // Update the joinedUsers state
    });
  }, []);

  return (
    <div className="host">
      <div className="code">
        <div className="wrap">
          <div className="pin">Game pin:</div>
          {isLoading? (
            <div className="pincode">Loading...</div>
          ) : (
            <div className="pincode">{roomCode}</div>
          )}
        </div>
      </div>
      <div className="players">
        <div className="player-list">
          {joinedUsers.map((user, index) => (
            <div key={index}>{user.name}</div>
          ))}
        </div>
        <div className="start">
          <button disabled={true} className='btn'>Start</button>
        </div>
      </div>
    </div>
  );
}

export default Host;