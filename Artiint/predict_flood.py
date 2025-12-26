import pickle
import sys
import os

def predict_flood(rainfall_24h, rainfall_48h, humidity, temperature):
    # Load the trained model
    # Load the trained model - Use absolute path relative to script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_filename = os.path.join(script_dir, 'model.pkl')
    
    if not os.path.exists(model_filename):
        return {"error": f"Model file {model_filename} not found. Run train_model.py first."}

    with open(model_filename, 'rb') as f:
        model = pickle.load(f)

    # Feature Mapping:
    # 1. Rain(mm) = rainfall_24h + rainfall_48h (approximate monthly intensity mapping)
    # 2. Temp = temperature
    # 3. Humidity = Not used in existing model (dataset limitation), but accepted for interface compatibility.
    
    rain_total = rainfall_24h + rainfall_48h
    features = [[temperature, rain_total]]

    # Prediction
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    # Confidence Score (probability of the predicted class)
    confidence = float(max(probabilities))

    # MANUAL OVERRIDE: 
    # The current trained model seems to underpredict risk for extreme rainfall.
    # We enforce a rule: If rain > 120mm, it MUST be a risk.
    if rain_total > 120:
        prediction = 1
        # If model gave low confidence for risk, boost it
        if confidence < 0.8:
            confidence = 0.95

    # Risk Category Mapping
    # 0 = No Risk (Low)
    # 1 = Risk (Medium/High depending on confidence and rain)
    if prediction == 0:
        risk_category = "Low"
    else:
        if rain_total > 150 or confidence > 0.98:
            risk_category = "High"
        else:
            risk_category = "Medium"

    return {
        "flood_risk": risk_category,
        "prediction_binary": int(prediction),
        "confidence": round(confidence, 4),
        "input_summary": {
            "mapped_rain_mm": rain_total,
            "temperature": temperature,
            "humidity_provided": humidity
        }
    }

if __name__ == "__main__":
    # Example usage: python predict_flood.py <rainfall_24h> <rainfall_48h> <humidity> <temperature>
    if len(sys.argv) < 5:
        print("Usage: python predict_flood.py <rainfall_24h> <rainfall_48h> <humidity> <temperature>")
        print("Example: python predict_flood.py 50 30 75 32")
    else:
        try:
            r24 = float(sys.argv[1])
            r48 = float(sys.argv[2])
            hum = float(sys.argv[3])
            temp = float(sys.argv[4])
            
            result = predict_flood(r24, r48, hum, temp)
            import json
            print(json.dumps(result, indent=4))
        except ValueError:
            print("Error: All inputs must be numeric.")
