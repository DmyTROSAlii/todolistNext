"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { signOut } from 'firebase/auth';
import { auth } from '@/firabase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Button } from '@/components/ui/button';

interface TodosLayoutProps {
  children: React.ReactNode;
};

const TodosLayout = ({ children }: TodosLayoutProps) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const userSession = sessionStorage.getItem('user');

    if (!user && !userSession) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const handleLogout = () => {
    router.push('/sign-in');
    signOut(auth);
    sessionStorage.removeItem('user');
  }

  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="max-w-screen-2xl h-full flex-1">
          <Button
            size="lg"
            className="m-4 bg-amber-700 hover:bg-amber-500 text-white absolute right-5 cursor-pointer"
            onClick={handleLogout}>
            Log out
          </Button>
          <main className="h-full py-8 px-6 mt-15">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TodosLayout;