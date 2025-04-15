'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import DrawingTools from '../components/DrawingTools';
import CollaboratorsList from '../components/CollaboratorsList';

let socket;

const CanvasPage = () => {
  const { sessionId } = useParams();
  const [canvasData, setCanvasData] = useState([]);
  const [currentTool, setCurrentTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [collaborators, setCollaborators] = useState([]);
  const canvasRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    // Establish socket connection
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    socket.emit('joinSession', { sessionId });

    socket.on('sessionData', (data) => {
      setCanvasData(data);
    });

    socket.on('collaborators', (collabList) => {
      setCollaborators(collabList);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const handleDraw = (e) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      socket.emit('draw', { x: e.clientX, y: e.clientY, tool: currentTool, color, lineWidth });
    }
  };

  const handleMouseDown = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
    }
  };

  const handleSaveDrawing = () => {
    const dataURL = canvasRef.current.toDataURL();
    socket.emit('saveDrawing', { sessionId, dataURL });
    alert('Drawing saved!');
  };

  const handleInvite = () => {
    const inviteLink = `${window.location.href}`;
    socket.emit('invite', { sessionId, inviteLink });
    alert('Invite link copied!');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900">
      <div className="md:w-1/4 p-4 bg-gray-800 text-white">
        <h2 className="text-lg font-bold">Drawing Tools</h2>
        <DrawingTools
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          setColor={setColor}
          setLineWidth={setLineWidth}
        />
        <button onClick={handleSaveDrawing} className="mt-4 w-full bg-blue-600 p-2 rounded">
          Save Drawing
        </button>
        <button onClick={handleInvite} className="mt-4 w-full bg-green-600 p-2 rounded">
          Share Session
        </button>
        <h3 className="mt-6 text-lg font-semibold">Collaborators</h3>
        <CollaboratorsList collaborators={collaborators} />
      </div>

      <div className="flex-1 p-4 bg-gray-900 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleDraw}
          className="border-2 border-gray-700"
          width={800}
          height={600}
        />
      </div>
    </div>
  );
};

export default CanvasPage;
