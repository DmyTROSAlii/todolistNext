"use client";

import { useRouter } from 'next/navigation';

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firabase/config';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');

  if (!user && !userSession) {
    router.push('/sign-in')
  } else {
    router.push('/todos');
  }
}
