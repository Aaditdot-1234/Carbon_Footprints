'use client'
import React, { useState } from 'react';
import { account } from '../appwrite';
import Navbar from '../Navbar/page';
import './Calculate.css';
import { footprintAction } from '../actions/footprintAction';

const Calculate = () => {
  const [mode, setMode] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [mileage, setMileage] = useState('');
  const [distance, setDistance] = useState('');
  const [results, setResults] = useState(null);
  const [totalEmissionFactor, setTotalEmissionFactor] = useState(null);
  const [totalCarbonFootprint, setTotalCarbonFootprint] = useState(null);
  const [totalDistanceTravelled, setTotalDistanceTravelled] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sectionData = [{ mode, fuelType, mileage, distance }];
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: sectionData })
      });
      const resultData = await response.json();
      setResults(resultData);

      const session = await account.get();
      const userId = session.$id;

      const totals = await footprintAction(userId, sectionData, resultData); 
      setTotalEmissionFactor(totals.totalEmissionFactor);
      setTotalCarbonFootprint(totals.totalCarbonFootprint);
      setTotalDistanceTravelled(totals.totalDistanceTravelled);

      setMode('');
      setFuelType('');
      setMileage('');
      setDistance('');
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
    }
  }; 


  return (
    <>
      <Navbar />
      <div className='calculate'>
        <div className="container">
          <h1>Daily Commute Carbon Footprint Calculator</h1>
          <form onSubmit={handleSubmit}>
            <div className="section">
              <h3>Commute Information</h3>
              
              <label htmlFor="mode">Mode of Transport:</label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                required
              >
                <option value="">Select Mode</option>
                <option value="Car">Car</option>
                <option value="Motorbike">Motorbike</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Airplane">Airplane</option>
                <option value="Ferry">Ferry</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Walking">Walking</option>
              </select>

              <label htmlFor="fuel_type">Fuel Type:</label>
              <select
                id="fuel_type"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                disabled={mode !== 'Car' && mode !== 'Motorbike'}
                required={mode === 'Car' || mode === 'Motorbike'}
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>

              <label htmlFor="mileage">Vehicle Mileage (Only for Personal):</label>
              <select
                id="mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                disabled={mode !== 'Car' && mode !== 'Motorbike'}
              >
                <option value="">Select Mileage</option>
                {[...Array(10)].map((_, i) => {
                  const start = (i + 1) * 5;
                  const end = start + 5;
                  return (
                    <option key={i} value={`${start}-${end}`}>
                      {start} - {end} kmpl
                    </option>
                  );
                })}
              </select>

              <label htmlFor="distance">Distance Travelled (in kms):</label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                step="0.1"
                required
              />
            </div>

            <div className='buttonSection'>
              <button type="submit">Calculate</button>
            </div>
          </form>

          {results && (
            <div className="result">
              <h2>Total Results</h2>
              <p><strong>Total Emission Factor:</strong> {totalEmissionFactor} kg CO₂ per km</p>
              <p><strong>Total Carbon Footprint:</strong> {totalCarbonFootprint} kg CO₂</p>
              <p><strong>Total Distance Travelled:</strong> {totalDistanceTravelled} km</p>

              <h3>Section-wise Results</h3>
              <ul>
                {results.sections.map((section, index) => (
                  <li key={index}>
                    <strong>Mode:</strong> {section.mode},
                    <strong> Distance:</strong> {section.distance} km,
                    <strong> Emission Factor:</strong> {section.emissionFactor} kg CO₂/km,
                    <strong> Carbon Footprint:</strong> {section.carbonFootprint} kg CO₂
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Calculate;
