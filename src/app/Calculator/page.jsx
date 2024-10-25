'use client'
import React, { useState } from 'react';
import Navbar from '../Navbar/page';
import './Calculate.css';

const Calculate = () => {
  const [sections, setSections] = useState([{ mode: '', fuelType: '', mileage: '', distance: '' }]);
  const [results, setResults] = useState(null);

  const addSection = () => {
    if (sections.length >= 8) {
      alert('You can only add up to 8 sections.');
      return;
    }
    setSections([...sections, { mode: '', fuelType: '', mileage: '', distance: '' }]);
  };

  const removeSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const handleChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    if (field === 'mode' && (value !== 'Car' && value !== 'Motorbike')) {
      updatedSections[index].fuelType = '';
      updatedSections[index].mileage = '';
    }
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections })
      });
      const resultData = await response.json();
      setResults(resultData);
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
            <div id="sectionsContainer">
              {sections.map((section, index) => (
                <div key={index} className="section">
                  <h3>Commute Section {index + 1}</h3>
                  <label htmlFor={`mode_${index}`}>Mode of Transport:</label>
                  <select
                    id={`mode_${index}`}
                    value={section.mode}
                    onChange={(e) => handleChange(index, 'mode', e.target.value)}
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

                  <label htmlFor={`fuel_type_${index}`}>Fuel Type:</label>
                  <select
                    id={`fuel_type_${index}`}
                    value={section.fuelType}
                    onChange={(e) => handleChange(index, 'fuelType', e.target.value)}
                    disabled={section.mode !== 'Car' && section.mode !== 'Motorbike'}
                    required={section.mode === 'Car' || section.mode === 'Motorbike'}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>

                  <label htmlFor={`mileage_${index}`}>Vehicle Mileage (Only for Personal):</label>
                  <select
                    id={`mileage_${index}`}
                    value={section.mileage}
                    onChange={(e) => handleChange(index, 'mileage', e.target.value)}
                    disabled={section.mode !== 'Car' && section.mode !== 'Motorbike'}
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

                  <label htmlFor={`distance_${index}`}>Distance Travelled (in kms):</label>
                  <input
                    type="number"
                    id={`distance_${index}`}
                    value={section.distance}
                    onChange={(e) => handleChange(index, 'distance', e.target.value)}
                    step="0.1"
                    required
                  />

                  <button type="button" onClick={() => removeSection(index)}>
                    Remove Section
                  </button>
                </div>
              ))}
            </div>
            <div className='buttonSection'>
              <button type="button" onClick={addSection}>Add Section</button>
              <button type="submit">Calculate</button>
            </div>
          </form>

          {results && (
            <div className="result">
              <h2>Total Results</h2>
              <p><strong>Total Emission Factor:</strong> {results.totalEmissionFactor} kg CO₂ per km</p>
              <p><strong>Total Carbon Footprint:</strong> {results.totalCarbonFootprint} kg CO₂</p>

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