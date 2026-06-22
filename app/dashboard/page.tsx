"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://ai-travel-planner-backend-ui01.onrender.com/trips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(response.data);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [router]);

  const handleDelete = async (tripId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this trip?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ai-travel-planner-backend-ui01.onrender.com/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTrips(trips.filter(trip => trip._id !== tripId));
    } catch (error) {
      alert('Failed to delete the trip. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading your adventures...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Travel Dashboard</h2>

      {trips.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light">
          <h4>You haven't planned any trips yet!</h4>
          <p className="text-muted">Click "+ New Trip" in the navigation bar to get started.</p>
        </div>
      ) : (
        <div className="row">
          {trips.map((trip: any) => (
            <div className="col-md-4 mb-4" key={trip._id}>
              <div className="card shadow-sm h-100 border-0 outline-secondary">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary fw-bold">{trip.destination}</h5>
                  <h6 className="card-subtitle mb-3 text-muted">
                    {trip.durationDays} Days • {trip.budgetTier} Budget
                  </h6>
                  <p className="card-text small text-muted">
                    <strong>Interests:</strong> {trip.interests.join(', ')}
                  </p>
                  <div className="mt-auto d-flex gap-2 pt-3 border-top">
                    <Link href={`/trip/${trip._id}`} className="btn btn-sm btn-outline-primary flex-grow-1">
                      View Itinerary
                    </Link>
                    <button onClick={() => handleDelete(trip._id)} className="btn btn-sm btn-outline-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}