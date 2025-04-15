'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import the Next.js router
import io from 'socket.io-client';
import Link from 'next/link'; // Import Link for navigation

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }

    socket.on('connect', () => {
      console.log('Connected to socket:', socket.id);
    });

    socket.on('draw', (data) => {
      console.log('Draw data received:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome to AirCanvas 🎨</h1>
      <Link href="/signin" className="mt-4 text-blue-400">Sign In</Link>
      <Link href="/signup" className="mt-2 text-blue-400">Sign Up</Link>
    </main>
  );
}
