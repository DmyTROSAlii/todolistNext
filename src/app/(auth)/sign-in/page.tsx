"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/firabase/config';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const userSession = sessionStorage.getItem('user');

    if (user && userSession) {
      router.push('/todos');
    }
  }, [user, router]);

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="w-96 bg-gray-700 p-6 rounded-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl mb-5">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-400 text-white placeholder-gray-500"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-400 text-white placeholder-gray-500"
        />
        <Button onClick={handleSignIn} className="bg-indigo-700 hover:bg-indigo-600 text-white">
          Sign In
        </Button>
      </CardContent>
      <p className="text-center mt-4 text-white">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up">
          <span className="text-blue-500 cursor-pointer">Sign Up</span>
        </Link>
      </p>
    </Card>
  );
};

export default SignUp;