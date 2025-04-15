'use client';

import { useState, useEffect, useRef } from 'react';

const ChatBox = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef(null); // To auto-scroll to the bottom of the chat

  useEffect(() => {
    setIsClient(true); // Ensure component is mounted on the client

    // Only set up socket listener if the socket is available
    if (socket) {
      socket.on('receiveMessage', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // Cleanup the socket listener when the component unmounts
      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Don't render the component if the socket is not available or it's not a client-side render
  if (!isClient || !socket) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="max-h-60 overflow-y-auto mb-4 p-2 bg-gray-900 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className="text-white mb-2 p-2 rounded-lg bg-gray-700">
            {msg}
          </div>
        ))}
        {/* Auto-scroll marker */}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 w-full rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 p-2 ml-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
