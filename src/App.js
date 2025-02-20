import React, { useState } from 'react';
import Username from './components/Username';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <Username
          setUsername={setUsername}
          setRoom={setRoom}
          joinRoom={joinRoom}
        />
      ) : (
        <Chat username={username} room={room} />
      )}
    </div>
  );
}

export default App;
