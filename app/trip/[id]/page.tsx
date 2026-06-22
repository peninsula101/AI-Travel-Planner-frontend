"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TripDetailsPage() {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get(`https://ai-travel-planner-backend-ui01.onrender.com/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrip(response.data);
      } catch (err: any) {
        setError('Failed to load trip details. It might not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTripDetails();
  }, [id, router]);

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    const updatedPackingList = trip.packingList.map((item: any) => 
      item._id === itemId ? { ...item, isPacked: !currentStatus } : item
    );
    setTrip({ ...trip, packingList: updatedPackingList });

    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://ai-travel-planner-backend-ui01.onrender.com/trips/${id}/packing/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to save checkbox state to database");
      const revertedList = trip.packingList.map((item: any) => 
        item._id === itemId ? { ...item, isPacked: currentStatus } : item
      );
      setTrip({ ...trip, packingList: revertedList });
    }
  };

  if (loading) return <div className="container mt-5 text-center">Loading your itinerary...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!trip) return null;

  const tripCurrency = trip.currency || 'USD'; 

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(tripCurrency === 'INR' ? 'en-IN' : 'en-US', { 
      style: 'currency', 
      currency: tripCurrency, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const totalBudget = trip.estimatedBudget?.total || 0;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="text-primary fw-bold mb-0">{trip.destination}</h1>
          <p className="text-muted lead mb-0">
            {trip.durationDays} Days • {trip.budgetTier} Budget
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline-secondary">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="alert alert-success d-flex align-items-center mb-4 border-0 shadow-sm" role="alert">
        <span className="fs-3 me-3">💰</span>
        <div>
          <h5 className="alert-heading mb-1 fw-bold">Estimated Total Budget</h5>
          <p className="mb-0 fs-5">
            <strong>{formatMoney(totalBudget)}</strong> 
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <h3 className="mb-3 border-bottom pb-2">Daily Itinerary</h3>
          {trip.itinerary.map((day: any) => (
            <div key={day._id} className="card shadow-sm mb-4 border-0">
              <div className="card-header bg-primary text-white fw-bold">
                Day {day.dayNumber}
              </div>
              <ul className="list-group list-group-flush">
                {day.activities.map((activity: any) => (
                  <li key={activity._id} className="list-group-item p-3">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bold mb-1 text-dark">
                        {activity.title} <span className="badge bg-secondary ms-2">{activity.timeOfDay}</span>
                      </h6>
                      <span className="text-success fw-bold">
                        {formatMoney(activity.estimatedCostUSD)}
                      </span>
                    </div>
                    <p className="mb-0 text-muted small">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold border-bottom pb-2">Recommended Hotels</h5>
              {trip.hotels.map((hotel: any) => (
                <div key={hotel._id} className="mb-3">
                  <h6 className="mb-0 text-primary">{hotel.name}</h6>
                  <small className="text-muted">{hotel.tier} • {hotel.rating}</small>
                  <div className="text-success small fw-bold">
                    ~{formatMoney(hotel.estimatedCostNightUSD)} / night
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card shadow-sm bg-secondary text-white">
            <div className="card-body">
              <h5 className="card-title fw-bold border-bottom pb-2">Packing Checklist</h5>
              <ul className="list-group list-group-flush bg-transparent">
                {trip.packingList.map((item: any) => (
                  <li key={item._id} className="list-group-item bg-transparent px-0 d-flex justify-content-between align-items-center border-bottom-0 py-2 text-white">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`pack-${item._id}`}
                        checked={item.isPacked}
                        onChange={() => handleToggleItem(item._id, item.isPacked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label 
                        className={`form-check-label ${item.isPacked ? 'text-decoration-line-through text-muted' : 'fw-medium'}`} 
                        htmlFor={`pack-${item._id}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.item}
                      </label>
                    </div>
                    <span className="badge bg-info rounded-pill ms-2 text-dark">{item.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}