'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Form data being sent:", form); // Log form data
    try {
      const res = await axios.post('http://localhost:4000/api/auth/signup', form);
      console.log('Response:', res.data);  // Log response data
      localStorage.setItem('token', res.data.token);
      router.push("/signin");
    } catch (err) {
      console.error('Error during signup:', err);  // Log error details
      setError(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSignup} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-2xl mb-4 font-bold text-center">Create Account</h1>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 bg-gray-700 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
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
        <button className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700">Sign Up</button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <a href="/signin" className="text-blue-400">Sign In</a>
        </p>
      </form>
    </div>
  );
}
