# Carbon Footprint Calculator Documentation

## Emission Factor and Carbon Footprint Calculation

### Modes of Transport

The carbon footprint for various modes of transport is calculated using specific emission factors, which differ based on the mode of transport and the fuel type used. Below is a summary of the calculations:

| Mode of Transport | Emission Factor (kg CO₂/km) | Fuel Type Used              | Description                                           |
|--------------------|------------------------------|-----------------------------|-------------------------------------------------------|
| Car                | Fuel-specific                | Petrol: 2.31 kg CO₂/liter  | Calculated as fuel emission per liter divided by vehicle mileage. |
|                    |                              | Diesel: 2.68 kg CO₂/liter  |                                                       |
|                    |                              | CNG: 1.75 kg CO₂/liter     |                                                       |
|                    |                              | Electric: 0.0 kg CO₂/km     | Assuming renewable energy sources.                    |
| Motorbike          | Fuel-specific                | Petrol: 2.31 kg CO₂/liter  | Calculated as fuel emission per liter divided by vehicle mileage. |
|                    |                              | Diesel: 2.68 kg CO₂/liter  |                                                       |
|                    |                              | CNG: 1.75 kg CO₂/liter     |                                                       |
|                    |                              | Electric: 0.0 kg CO₂/km     | Assuming renewable energy sources.                    |
| Bus                | 0.105                        | N/A                         | Public transport mode, fixed emission factor.        |
| Train              | 0.041                        | N/A                         | Public transport mode, fixed emission factor.        |
| Airplane           | 0.257                        | N/A                         | Public transport mode, fixed emission factor.        |
| Ferry              | 0.180                        | N/A                         | Public transport mode, fixed emission factor.        |
| Bicycle            | 0                            | N/A                         | Human-powered transport, zero emissions.             |
| Walking            | 0                            | N/A                         | Zero emissions, human-powered transport.              |

### Calculation Details

1. **Car and Motorbike**:
   - **Emission Factor**: Calculated as:
     - **Emission Factor** = Fuel Emission (kg CO₂/liter) / Mileage (kmpl)
   - **Carbon Footprint**: 
     - **Carbon Footprint** = Emission Factor × Distance (km)

2. **Public Transport Modes (Bus, Train, Airplane, Ferry)**:
   - **Emission Factor**: Fixed value as provided in the table.
   - **Carbon Footprint**: 
     - **Carbon Footprint** = Emission Factor × Distance (km)

3. **Bicycle and Walking**:
   - **Emission Factor**: Zero emissions.
   - **Carbon Footprint**: Always zero.

This document provides a comprehensive understanding of how the emission factors and carbon footprints are calculated for various modes of transport in the Carbon Footprint Calculator application.
