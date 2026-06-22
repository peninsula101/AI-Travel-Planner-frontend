"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div className="container">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="navbar-brand fw-bold">
          ✈️ AI Travel Planner
        </Link>
        
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="btn btn-outline-light border-0 me-2">
                Dashboard
              </Link>
              <Link href="/generate" className="btn btn-outline-light border-0 me-2">
                + New Trip
              </Link>
              <button onClick={handleLogout} className="btn btn-light text-primary fw-bold ms-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-light border-0 me-2">
                Login
              </Link>
              <Link href="/register" className="btn btn-light text-primary fw-bold">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}