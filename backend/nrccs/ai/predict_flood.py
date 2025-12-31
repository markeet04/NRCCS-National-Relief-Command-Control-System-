"""
NRCCS AI/ML Flood Prediction Module
Predicts flood risk based on weather parameters
Used by NestJS backend via subprocess
"""

import pickle
import sys
import os
import json

def predict_flood(rainfall_24h, rainfall_48h, humidity, temperature):
    """
    Predict flood risk based on weather parameters.
    
    Args:
        rainfall_24h: Rainfall in last 24 hours (mm)
        rainfall_48h: Rainfall in last 48 hours (mm)
        humidity: Current humidity (%)
        temperature: Current temperature (°C)
    
    Returns:
        dict: Prediction result with flood_risk, confidence, etc.
    """
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
    """
    CLI interface for the prediction module.
    Called by NestJS backend via subprocess.
    
    Usage: python predict_flood.py <rainfall_24h> <rainfall_48h> <humidity> <temperature>
    Output: JSON to stdout
    """
    if len(sys.argv) < 5:
        # Return JSON error for consistent parsing
        error_response = {
            "error": "Invalid arguments",
            "usage": "python predict_flood.py <rainfall_24h> <rainfall_48h> <humidity> <temperature>",
            "example": "python predict_flood.py 50 30 75 32"
        }
        print(json.dumps(error_response))
        sys.exit(1)
    else:
        try:
            r24 = float(sys.argv[1])
            r48 = float(sys.argv[2])
            hum = float(sys.argv[3])
            temp = float(sys.argv[4])
            
            result = predict_flood(r24, r48, hum, temp)
            # Output JSON only - no other prints (for subprocess parsing)
            print(json.dumps(result))
            sys.exit(0)
        except ValueError as e:
            error_response = {
                "error": "All inputs must be numeric",
                "details": str(e)
            }
            print(json.dumps(error_response))
            sys.exit(1)
        except Exception as e:
            error_response = {
                "error": "Prediction failed",
                "details": str(e)
            }
            print(json.dumps(error_response))
            sys.exit(1)
