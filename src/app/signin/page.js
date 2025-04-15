'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/signin`, form);
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSignin} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-2xl mb-4 font-bold text-center">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-gray-700 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 bg-gray-700 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="w-full bg-green-600 p-2 rounded hover:bg-green-700">Log In</button>
        <p className="mt-4 text-sm text-center">
          Don’t have an account? <a href="/signup" className="text-green-400">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
