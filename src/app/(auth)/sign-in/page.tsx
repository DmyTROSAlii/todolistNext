"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/firabase/config';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader/loader';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/todos');
    }

  }, [user, router]);

  const handleSignIn = async () => {
    setError(null);

    try {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      const res = await signInWithEmailAndPassword(email, password);

      if (!res?.user) {
        setError("Failed to sign in. Please check your email and password.");
        return;
      }

      setEmail('');
      setPassword('');
      router.push('/todos');
    } catch (e) {
      console.error('Sign In Error:', e);
    }
  };

  if (loading) return <Loader />

  return (
    <Card className="w-96 bg-blue-500 p-6 rounded-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl mb-5">Sign In</CardTitle>
        {error && <p className="text-red-600 text-sm bg-gray-300 p-2 rounded-lg">{error}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-blue-200 text-gray-800 placeholder-gray-500"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-blue-200 text-gray-800 placeholder-gray-500"
        />
        <Button onClick={handleSignIn} className="bg-indigo-700 hover:bg-indigo-600 text-white">
          Sign In
        </Button>
      </CardContent>
      <p className="text-center mt-4 text-white">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up">
          <span className="text-blue-950 hover:text-white cursor-pointer">Sign Up</span>
        </Link>
      </p>
    </Card>
  );
};

export default SignUp;