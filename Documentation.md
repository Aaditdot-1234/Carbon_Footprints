# Emission Factor and Carbon Footprint Calculation

## Definitions
- **Emission Factor**: The amount of carbon dioxide (CO₂) emitted per kilometer traveled, measured in kilograms (kg CO₂/km).
- **Carbon Footprint**: The total CO₂ emissions for a journey, calculated as:
  \[
  \text{Carbon Footprint} = \text{Emission Factor} \times \text{Distance}
  \]

## Modes of Transport and Emission Factors

| Mode          | Fuel Type       | Emission Factor (kg CO₂/km)   | Description                                            |
|---------------|------------------|--------------------------------|--------------------------------------------------------|
| **Car**       | Petrol           | \( \frac{2.31}{\text{Mileage}} \) | Emissions vary based on fuel efficiency.               |
|               | Diesel           | \( \frac{2.68}{\text{Mileage}} \) | Higher emissions compared to petrol.                   |
| **Motorbike** | Petrol           | \( \frac{2.0}{\text{Mileage}} \) | Generally lower emissions due to better mileage.       |
| **Bus**       | N/A              | 0.105                          | Assumed average for public transport efficiency.        |
| **Train**     | N/A              | 0.041                          | Lower emissions, highly efficient per passenger.       |
| **Airplane**  | N/A              | 0.257                          | Higher emissions due to altitude and distance.         |
| **Ferry**     | N/A              | 0.180                          | Varies based on fuel type and vessel efficiency.      |
| **Bicycle**   | N/A              | 0.0                            | Human-powered, no emissions.                           |
| **Walking**   | N/A              | 0.0                            | Zero emissions, human-powered transport.               |

## Calculation Example
For a petrol car with a mileage of 10 km/l (0.1 km/l), traveling a distance of 100 km:
- **Emission Factor**: 
  \[
  \frac{2.31}{10} = 0.231 \, \text{kg CO₂/km}
  \]
- **Carbon Footprint**: 
  \[
  0.231 \, \text{kg CO₂/km} \times 100 \, \text{km} = 23.1 \, \text{kg CO₂}
  \]

For a bus traveling 50 km:
- **Carbon Footprint**: 
  \[
  0.105 \, \text{kg CO₂/km} \times 50 \, \text{km} = 5.25 \, \text{kg CO₂}
  \]
