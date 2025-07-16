"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth, db } from '@/firabase/config';
import { addDoc, collection, doc, setDoc } from '@firebase/firestore';
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader/loader';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/todos');
    }
  }, [user, router]);

  const handleSignUp = async () => {
    setError(null);

    try {
      if (!name || !email || !password) {
        setError("All fields are required");
        return;
      }

      const res = await createUserWithEmailAndPassword(email, password);
      const user = res?.user;

      if (!user) {
        setError("Failed to sign up. Please try another email.");
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
      });

      setName('');
      setEmail('');
      setPassword('');

      router.push('/todos');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Loader />

  return (
    <Card className="w-96 bg-blue-500 p-6 rounded-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl mb-5">Sign Up</CardTitle>
        {error && <p className="text-red-600 text-sm bg-gray-300 p-2 rounded-lg">{error}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-blue-200 text-gray-800 placeholder-gray-500"
        />
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
        <Button onClick={handleSignUp} className="bg-indigo-700 hover:bg-indigo-600 text-white">
          Sign Up
        </Button>
      </CardContent>
      <p className="text-center mt-4 text-white">
        Already have an account?{' '}
        <Link href="/sign-in">
          <span className="text-blue-950 hover:text-white cursor-pointer">Sign In</span>
        </Link>
      </p>
    </Card>
  );
};

export default SignUp;