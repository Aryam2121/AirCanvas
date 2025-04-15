'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Canvas from '../components/Canvas';
import Sidebar from '../components/Sidebar';
import DrawingTools from '../components/DrawingTools';
import ChatBox from '../components/ChatBox';

let socket;

const DashboardPage = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Ensure socket connection is initialized
    socket = io('http://localhost:4000');  // Backend socket server URL

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('activeSessions', (sessions) => {
      setSessions(sessions);
      setLoading(false); // Stop loading once the data is fetched
    });

    socket.on('canvasesList', (canvases) => {
      setCanvases(canvases);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setLoading(false);  // Stop loading on error
    });

    return () => {
      socket.disconnect();  // Clean up on unmount
    };
  }, []);

  const handleNewCanvas = () => {
    setLoading(true); // Start loading when a new canvas is being created
    socket.emit('createNewSession', (newSession) => {
      // Assuming your backend sends back the newly created session info
      setActiveSession(newSession.id);
      setLoading(false); // Stop loading once the session is created
    });
  };

  const loadCanvas = (sessionId) => {
    setActiveSession(sessionId);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar
        canvases={canvases}
        sessions={sessions}
        loadCanvas={loadCanvas}
        handleNewCanvas={handleNewCanvas}
      />

      <div className="flex-1 p-8 bg-gray-900">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Current Session: {activeSession ? activeSession : 'None'}
          </h2>
          <DrawingTools socket={socket} isDrawing={isDrawing} setIsDrawing={setIsDrawing} />
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-white text-center py-8">Loading...</div>
        ) : (
          <>
            {/* Canvas Section */}
            <Canvas socket={socket} sessionId={activeSession} isDrawing={isDrawing} />
            
            {/* Chatbox Section */}
            <ChatBox socket={socket} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
