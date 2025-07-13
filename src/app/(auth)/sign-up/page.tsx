'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/firabase/config';
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const userSession = sessionStorage.getItem('user');

    if (user && userSession) {
      router.push('/todos');
    }
  }, [user, router]);

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-gray-700 p-10 rounded-lg shadow-xl w-96">
      <h1 className="text-white text-2xl mb-5">Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-400 rounded outline-none text-white placeholder-gray-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-400 rounded outline-none text-white placeholder-gray-500"
      />
      <button
        onClick={handleSignUp}
        className="w-full p-3 bg-indigo-700 rounded text-white hover:bg-indigo-600"
      >
        Sign Up
      </button>
      <p className='text-center mt-4'>
        Already have an account?
        <Link href="/sign-in">
          <span className="text-blue-500"> Sign In</span>
        </Link>
      </p>
    </div>
  );
};

export default SignUp;