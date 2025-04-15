'use client';

import { useEffect, useState } from 'react';

const DrawingTools = ({ socket, isDrawing, setIsDrawing, currentTool }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure component is mounted on client
  }, []);

  // Make sure socket and other props are available before usage
  if (!isClient || !socket) {
    return null; // Return nothing if the component is not mounted or socket is unavailable
  }

  const handleToolChange = (tool) => {
    // Emit event only if socket is available
    socket.emit('changeTool', tool);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
      <button
        onClick={() => handleToolChange('pen')}
        className={`p-2 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTool === 'pen' ? 'bg-blue-600' : 'bg-gray-600'}`}
        aria-label="Select Pen Tool"
      >
        Pen
      </button>
      <button
        onClick={() => handleToolChange('eraser')}
        className={`p-2 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTool === 'eraser' ? 'bg-red-600' : 'bg-gray-600'}`}
        aria-label="Select Eraser Tool"
      >
        Eraser
      </button>
      <button
        onClick={() => setIsDrawing(!isDrawing)}
        className={`p-2 rounded hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${isDrawing ? 'bg-green-600' : 'bg-gray-600'}`}
        aria-label={isDrawing ? "Stop Drawing" : "Start Drawing"}
      >
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
    </div>
  );
};

export default DrawingTools;
