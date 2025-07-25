"use client";

import { useRouter } from 'next/navigation';

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firabase/config';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();


  if (!user && !loading) {
    router.push('/sign-in')
  } else {
    router.push('/todos');
  }
}
