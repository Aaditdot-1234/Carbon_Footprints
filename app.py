from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def calculate():
    sections = []
    total_emission_factor = None
    total_carbon_footprint = None

    if request.method == 'POST':
        # Gather the number of sections dynamically
        section_count = len([key for key in request.form.keys() if key.startswith('mode_')])
        total_emission_factor = 0
        total_carbon_footprint = 0

        for i in range(section_count):
            mode = request.form.get(f'mode_{i}')
            fuel_type = request.form.get(f'fuel_type_{i}')
            mileage = request.form.get(f'mileage_{i}')
            distance = float(request.form.get(f'distance_{i}'))

            # Check if mileage is a range (e.g., '5-10') and extract the lower value
            if mileage and '-' in mileage:
                mileage_value = float(mileage.split('-')[0])  # Take the lower bound of the range
            else:
                mileage_value = float(mileage) if mileage else 0.0  # Default to 0 if not provided

            # Calculate emission factor and carbon footprint
            emission_factor = calculate_emission_factor(mode, fuel_type, mileage_value)
            carbon_footprint = emission_factor * distance
            
            total_emission_factor += emission_factor
            total_carbon_footprint += carbon_footprint

            sections.append({
                'mode': mode,
                'fuel_type': fuel_type,
                'mileage': mileage,
                'distance': distance,
                'emission_factor': emission_factor,
                'carbon_footprint': carbon_footprint
            })

    return render_template('index.html', sections=sections, total_emission_factor=total_emission_factor, total_carbon_footprint=total_carbon_footprint)

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
        else:
            raise ValueError("Unsupported fuel type")
    elif mode == 'Bus':
        return 0.05  # kg CO₂/km for bus travel
    elif mode == 'Train':
        return 0.03  # kg CO₂/km for train travel
    elif mode == 'Airplane':
        return 0.15  # kg CO₂/km for air travel
    elif mode == 'Ferry':
        return 0.07  # kg CO₂/km for ferry travel
    elif mode == 'Bicycle':
        return 0.0  # kg CO₂/km for cycling (considered carbon neutral)
    elif mode == 'Walking':
        return 0.0  # kg CO₂/km for walking (considered carbon neutral)
    else:
        raise ValueError("Unsupported mode of transport")

if __name__ == '__main__':
    app.run(debug=True)
