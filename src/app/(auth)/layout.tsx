"use client";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="bg-neutral-200 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </main>
  )
}

export default AuthLayout;