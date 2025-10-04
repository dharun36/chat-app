"use client"
import {io,Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';


export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
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
    if (input.trim() && socketRef.current) {
      setMessages((prevMessages) => [...prevMessages, input]);
      socketRef.current.emit('message-send', input);
      setInput('');
    }
  };

  return (
    <>
      <div>
        <div>
          <h2>Chat Room</h2>
          <div id="messages">
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input id="messageInput" type="text" onChange={(e) => setInput(e.target.value)} value={input} placeholder="Type your message..." />
          <button id="sendMessage" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
