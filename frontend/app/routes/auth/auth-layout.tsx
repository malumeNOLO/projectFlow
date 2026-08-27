import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/provider/auth-context";
import React from "react";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }


  return (

    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-indigo-900 to-purple-900 p-6">
      <div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center mb-6">
             <p className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-purple-700 text-4xl font-bold text-white shadow">P</p>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-white text-center ">
            ProjectFlow
          </h1>

        {/* Authentication Pages */}
          <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;