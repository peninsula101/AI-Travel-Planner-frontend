"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-travel-planner-backend-ui01.onrender.com/api';
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/auth/register`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Create Account</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Sign Up
                </button>
              </form>
              
              <p className="text-center mt-3">
                Already have an account? <Link href="/login">Log in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}