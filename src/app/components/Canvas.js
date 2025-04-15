'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const Canvas = ({ socket, sessionId, isDrawing }) => {
  const canvasRef = useRef(null);
  const [isDrawingLocal, setIsDrawingLocal] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [lastEmitTime, setLastEmitTime] = useState(0);
  const [isClient, setIsClient] = useState(false); // Track if client-side

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  // Throttling function for the socket emissions
  const throttledEmit = useCallback((e) => {
    if (Date.now() - lastEmitTime > 50) { // Throttle to 50ms intervals
      if (socket) {
        socket.emit('draw', {
          sessionId,
          x: e.offsetX,
          y: e.offsetY,
          lastX: lastPosition.x,
          lastY: lastPosition.y,
        });
      }
      setLastEmitTime(Date.now());
    }
  }, [socket, lastPosition, lastEmitTime]);

  useEffect(() => {
    if (!isClient || !socket) return; // Ensure this only runs client-side

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (isDrawing) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDrawing, socket, isClient]);

  const handleMouseDown = (e) => {
    setIsDrawingLocal(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    setLastPosition({ x: e.offsetX, y: e.offsetY });
  };

  const handleMouseMove = (e) => {
    if (isDrawingLocal) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      throttledEmit(e);
      setLastPosition({ x: e.offsetX, y: e.offsetY });
    }
  };

  const handleMouseUp = () => {
    setIsDrawingLocal(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDrawingLocal(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(touch.clientX, touch.clientY);
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (isDrawingLocal) {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineTo(touch.clientX, touch.clientY);
      ctx.stroke();
      throttledEmit(e);
      setLastPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDrawingLocal(false);
  };

  useEffect(() => {
    if (!isClient || !socket) return; // Ensure this only runs client-side

    socket.on('draw', (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(data.lastX, data.lastY);
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    return () => {
      socket.off('draw');
    };
  }, [socket, isClient]);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    if (socket) {
      socket.emit('clearCanvas', sessionId); // Broadcast to other users to clear their canvas as well
    }
  };

  useEffect(() => {
    if (!isClient || !socket) return; // Ensure this only runs client-side

    socket.on('clearCanvas', () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('clearCanvas');
    };
  }, [socket, isClient]);

  if (!isClient) return null; // Don't render anything on the server-side

  return (
    <div>
      <div className="controls">
        <button onClick={clearCanvas}>Clear Canvas</button>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="color-picker"
        />
        <input
          type="range"
          min="1"
          max="10"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="size-picker"
        />
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gray-600 w-full h-full"
      />
    </div>
  );
};

export default Canvas;
