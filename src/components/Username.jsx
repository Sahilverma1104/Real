import React, { useState } from 'react';

const Username = ({ setUsername, setRoom, joinRoom }) => {
  const [input, setInput] = useState('');
  const [roomInput, setRoomInput] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && roomInput.trim()) {
      setUsername(input);
      setRoom(roomInput);
      joinRoom();
    }
  };

  return (
    <div className="username-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter room name"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          required
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
};

export default Username;