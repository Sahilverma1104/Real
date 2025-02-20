import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FiSend } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

// Connect to the deployed backend on Render
const socket = io.connect('https://real-backend-8mte.onrender.com', {
  transports: ['websocket'], // Ensure WebSocket connection
});

const Chat = ({ username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.emit('join_room', room);
    
    return () => {
      socket.off('receive_message');
    };
  }, [room]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => {
        const exists = list.some(msg => msg.id === data.id);
        return exists ? list : [...list, data];
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, []);

  const sendMessage = async () => {
    if (currentMessage.trim()) {
      const tempId = uuidv4();
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString(),
        id: tempId,
      };

      // Optimistic update without status indicator
      setMessageList(list => [...list, messageData]);
      
      await socket.emit('send_message', { ...messageData, tempId });
      setCurrentMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat - Room: {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => (
            <div
              key={messageContent.id}
              className="message"
              id={username === messageContent.author ? 'you' : 'other'}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type your message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;
