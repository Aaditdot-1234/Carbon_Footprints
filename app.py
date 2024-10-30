from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    sections = data.get('sections', [])
    
    section_results = []

    for section in sections:
        mode = section.get('mode')
        fuel_type = section.get('fuelType')
        mileage = section.get('mileage')
        distance = float(section.get('distance', 0))

        if mileage and '-' in mileage:
            mileage_value = float(mileage.split('-')[0]) 
        else:
            mileage_value = float(mileage) if mileage else 0.0  

        emission_factor = calculate_emission_factor(mode, fuel_type, mileage_value)
        carbon_footprint = emission_factor * distance

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
    })

def calculate_emission_factor(mode, fuel_type=None, mileage=None):
    if mode in ['Car', 'Motorbike']:
        if fuel_type == 'Petrol':
            return 2.3 / mileage  
        elif fuel_type == 'Diesel':
            return 2.7 / mileage  
        elif fuel_type == 'CNG':
            return 1.75 / mileage  
        elif fuel_type == 'Electric':
            return 0.0 
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
        return 0.0  

if __name__ == '__main__':
    app.run(debug=True)