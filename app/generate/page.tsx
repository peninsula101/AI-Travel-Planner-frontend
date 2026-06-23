"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GenerateTripPage() {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState('Medium');
  const [currency, setCurrency] = useState('INR');
  const [interestsInput, setInterestsInput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-travel-planner-backend-ui01.onrender.com/api';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    const interestsArray = interestsInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    try {
      await axios.post(
        `${baseURL}/trips/generate`,
        {
          destination,
          durationDays: Number(durationDays),
          budgetTier,
          interests: interestsArray,
          currency
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate trip. The AI might be busy.');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary mb-0">Plan a New Trip</h2>
                <Link href="/dashboard" className="btn btn-outline-secondary btn-sm">
                  Cancel
                </Link>
              </div>
              
              <p className="text-muted mb-4">Tell us where you want to go, and our AI will build a complete, day-by-day itinerary with estimated budgets and a weather-aware packing list.</p>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleGenerate}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Destination</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="e.g., Tokyo, Japan or Paris, France"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Duration (Days)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="1" max="14"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Budget</label>
                    <select 
                      className="form-select" 
                      value={budgetTier}
                      onChange={(e) => setBudgetTier(e.target.value)}
                      disabled={loading}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Currency</label>
                    <select 
                      className="form-select" 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      disabled={loading}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Interests (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Food, Culture, Adventure, Shopping, Temples, Hiking, Museums"
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    disabled={loading}
                  />
                  <div className="form-text">What kind of activities do you enjoy?</div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      AI is building your itinerary (This takes 5-10s)...
                    </>
                  ) : (
                    'Generate My Itinerary ✨'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}