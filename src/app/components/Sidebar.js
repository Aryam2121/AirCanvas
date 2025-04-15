'use client';

import { useState, useEffect } from 'react';

const Sidebar = ({ canvases = [], sessions = [], loadCanvas, handleNewCanvas }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set state to true when component is mounted on the client-side
  }, []);

  if (!isClient) {
    return null; // Avoid rendering on the server
  }

  return (
    <div className="w-64 bg-gray-800 p-4 text-white flex flex-col">
      {/* Section for Saved Canvases */}
      <h2 className="text-lg font-bold">Saved Canvases</h2>
      <ul className="space-y-2 mb-4">
        {canvases.length > 0 ? (
          canvases.map((canvas) => (
            <li
              key={canvas.id}
              onClick={() => loadCanvas(canvas.id)}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors duration-200"
              aria-label={`Load ${canvas.name} canvas`}
            >
              {canvas.name}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No canvases saved.</li>
        )}
      </ul>

      {/* Section for Active Sessions */}
      <h2 className="text-lg font-bold">Active Sessions</h2>
      <ul className="space-y-2 mb-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <li
              key={session.id}
              onClick={() => loadCanvas(session.id)}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors duration-200"
              aria-label={`Load session ${session.name}`}
            >
              {session.name}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No active sessions.</li>
        )}
      </ul>

      {/* Create New Canvas Button */}
      <button
        onClick={handleNewCanvas}
        className="mt-auto w-full bg-blue-600 p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        aria-label="Create a new canvas"
      >
        Create New Canvas
      </button>
    </div>
  );
};

export default Sidebar;
