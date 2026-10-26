"""
CyberShield AI - Baseline Model Training Script
Dataset: CSE-CIC-IDS2017 (Unidirectional Ingress Probe Features)
Target: Multi-Class Network Threat Classification
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, f1_score, precision_score, recall_score
import joblib
import os

FEATURE_COLUMNS = [
    'Flow Duration',
    'Total Fwd Packets',
    'Total Length of Fwd Packets',
    'Fwd Packet Length Max',
    'Fwd Packet Length Min',
    'Fwd Packet Length Mean',
    'Fwd Packet Length Std',
    'Flow Bytes/s',
    'Flow Packets/s',
    'Flow IAT Mean',
    'Flow IAT Std',
    'Flow IAT Max',
    'Flow IAT Min',
    'Fwd PSH Flags',
    'Fwd URG Flags',
    'Fwd Header Length',
    'FIN Flag Count',
    'SYN Flag Count',
    'RST Flag Count',
    'PSH Flag Count',
    'ACK Flag Count',
    'URG Flag Count',
    'Down/Up Ratio',
    'Average Packet Size',
    'Destination Port',
    'Protocol'
]

TARGET_COLUMN = 'Label'

def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Removes infinite/NaN values and strips whitespace from headers."""
    df.columns = df.columns.str.strip()
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    return df

def train_baseline_pipeline(data_path: str, output_model_path: str = "artifacts/cybershield_rf_model.joblib"):
    print(f"[CyberShield AI] Loading unidirectional flow training data from: {data_path}")
    df = pd.read_csv(data_path)
    df = clean_dataset(df)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    print(f"[CyberShield AI] Total flow samples: {len(X)}")
    print(f"[CyberShield AI] Class breakdown:\n{y.value_counts()}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[CyberShield AI] Training Random Forest Classifier (n_estimators=100, max_depth=20)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        n_jobs=-1,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    print("\n=== Model Evaluation Report ===")
    print(classification_report(y_test, y_pred, digits=4))

    os.makedirs(os.path.dirname(output_model_path), exist_ok=True)
    joblib.dump({"model": clf, "features": FEATURE_COLUMNS}, output_model_path)
    print(f"[CyberShield AI] Trained model artifact saved to {output_model_path}")

if __name__ == "__main__":
    print("Run `python train_model.py --data <path-to-cicids2017.csv>` to train baseline model.")
