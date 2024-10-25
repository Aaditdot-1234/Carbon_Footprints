from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    sections = data.get('sections', [])
    
    total_emission_factor = 0
    total_carbon_footprint = 0
    section_results = []

    for section in sections:
        mode = section.get('mode')
        fuel_type = section.get('fuelType')
        mileage = section.get('mileage')
        distance = float(section.get('distance', 0))

        if mileage and '-' in mileage:
            mileage_value = float(mileage.split('-')[0])  # Take the lower bound of the range
        else:
            mileage_value = float(mileage) if mileage else 0.0  # Default to 0 if not provided

        emission_factor = calculate_emission_factor(mode, fuel_type, mileage_value)
        carbon_footprint = emission_factor * distance
        
        total_emission_factor += emission_factor
        total_carbon_footprint += carbon_footprint

        section_results.append({
            'mode': mode,
            'fuelType': fuel_type,
            'mileage': mileage,
            'distance': distance,
            'emissionFactor': emission_factor,
            'carbonFootprint': carbon_footprint
        })

    return jsonify({
        'sections': section_results,
        'totalEmissionFactor': total_emission_factor,
        'totalCarbonFootprint': total_carbon_footprint
    })

def calculate_emission_factor(mode, fuel_type=None, mileage=None):
    if mode in ['Car', 'Motorbike']:
        if fuel_type == 'Petrol':
            return 2.3 / mileage  # kg CO₂/km
        elif fuel_type == 'Diesel':
            return 2.7 / mileage  # kg CO₂/km
        elif fuel_type == 'CNG':
            return 1.75 / mileage  # kg CO₂/km
        elif fuel_type == 'Electric':
            return 0.0  # kg CO₂/km for electric vehicles
    elif mode == 'Bus':
        return 0.05
    elif mode == 'Train':
        return 0.03
    elif mode == 'Airplane':
        return 0.15
    elif mode == 'Ferry':
        return 0.07
    elif mode in ['Bicycle', 'Walking']:
        return 0.0
    else:
        return 0.0  # default case if no valid mode is selected

if __name__ == '__main__':
    app.run(debug=True)
