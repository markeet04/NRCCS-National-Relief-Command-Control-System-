import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

def train_model():
    # Path to the dataset (using Punjab.csv as a representative dataset from the repo)
    dataset_path = os.path.join('Notebooks', 'Model Selection', 'Punjab.csv')
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    # Load dataset
    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)

    # Preprocessing
    # Features: Temp, Rain(mm)
    # Target: Flood (Boolean in CSV, map to int)
    
    # Check for missing values
    df = df.dropna(subset=['Temp', 'Rain(mm)', 'Flood'])
    
    # Feature selection
    X = df[['Temp', 'Rain(mm)']]
    y = df['Flood'].astype(int)

    # Train-Dev-Test split (70% Train, 15% Dev, 15% Test)
    # First split into Train and Temp (30%)
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Then split Temp into Dev and Test (50% each of the 30% -> 15% / 15%)
    X_dev, X_test, y_dev, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

    # Initialize and train Random Forest Classifier with regularization to avoid overfitting
    # 100% training accuracy usually indicates the model is too complex for the data size.
    print(f"Training Regularized Random Forest Classifier on {len(X_train)} samples...")
    model = RandomForestClassifier(
        n_estimators=100, 
        max_depth=5,              # Limit depth to prevent memorization
        min_samples_leaf=5,       # Ensure each leaf has at least 5 samples
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluation
    train_acc = accuracy_score(y_train, model.predict(X_train))
    dev_acc = accuracy_score(y_dev, model.predict(X_dev))
    test_acc = accuracy_score(y_test, model.predict(X_test))

    print("-" * 30)
    print(f"Training Accuracy:   {train_acc:.4f}")
    print(f"Dev (Validation) Acc: {dev_acc:.4f}")
    print(f"Test Accuracy:       {test_acc:.4f}")
    print("-" * 30)
    
    print("\nTest Set Classification Report:")
    print(classification_report(y_test, model.predict(X_test), zero_division=0))

    # Save the model
    model_filename = 'model.pkl'
    with open(model_filename, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_filename}")

if __name__ == "__main__":
    train_model()
