import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">AI Travel Planner</h1>
      <p className="lead mb-5">Plan your perfect trip with Google Gemini AI.</p>
      
      <div className="d-flex justify-content-center gap-3">
        <Link href="/login" className="btn btn-outline-primary btn-lg">
          Login
        </Link>
        <Link href="/register" className="btn btn-primary btn-lg">
          Create Account
        </Link>
      </div>
    </div>
  );
}