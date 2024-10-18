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

def calculate_emission_factor(mode, fuel_type, mileage):
    # Define your emission factors based on mode and fuel type
    # This is just a placeholder. Replace with actual values.
    if mode in ['Car', 'Motorbike']:
        if fuel_type == 'Petrol':
            return 2.3 / mileage  # kg CO₂/km
        elif fuel_type == 'Diesel':
            return 2.7 / mileage  # kg CO₂/km
        # Add more fuel types as needed
    elif mode in ['Bus', 'Train']:
        return 0.05  # kg CO₂/km for public transport
    elif mode == 'Airplane':
        return 0.15  # kg CO₂/km for air travel
    # Add more modes and their respective emission factors as needed
    return 0

if __name__ == '__main__':
    app.run(debug=True)
