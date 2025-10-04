"use client"
import {io,Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';


export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const socket = io('http://localhost:3001');

  useEffect(() => {
    // Only run on client
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3001');
      console.log(process.env.NEXT_PUBLIC_SOCKET_URL);
    }
    const socket = socketRef.current;
    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off('message');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim() && socketRef.current && isUsernameSet) {
      const messageWithUser = `${username}: ${input}`;
      setMessages((prevMessages) => [...prevMessages, messageWithUser]);
      socketRef.current.emit('message-send', messageWithUser);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  if (!isUsernameSet) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to Chat Room</h2>
        <p>Please enter your username to start chatting</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
          placeholder="Enter your username..."
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleSetUsername} style={{ padding: '10px' }}>
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <div>
          <h2>Chat Room - {username}</h2>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Connected users can chat in real-time
          </p>
          <div id="messages">
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input 
            id="messageInput" 
            type="text" 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={handleKeyPress}
            value={input} 
            placeholder="Type your message..." 
          />
          <button id="sendMessage" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
