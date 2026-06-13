"""ML pipeline for House Prices - Phase 1
Implements data cleaning, feature engineering, training and model selection
"""
import os
import json
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib
import mlflow

def find_dataset():
    preferred = Path(__file__).resolve().parents[0] / "data" / "house_prices.csv"
    if preferred.exists():
        return str(preferred)
    root = Path(__file__).resolve().parents[2]
    matches = list(root.glob("**/*house_prices*.csv"))
    if matches:
        return str(matches[0])
    raise FileNotFoundError("Could not find house_prices.csv.")

def prepare_features(df: pd.DataFrame, target_col: str):
    # PERMANENT FIX: Drop Property_ID so the model doesn't expect it
    cols_to_drop = [target_col]
    if 'Property_ID' in df.columns:
        cols_to_drop.append('Property_ID')
        
    X = df.drop(columns=cols_to_drop)
    y = df[target_col]
    
    numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_features = X.select_dtypes(include=[object, "category"]).columns.tolist()

    numeric_transformer = Pipeline(steps=[("scaler", StandardScaler())])
    categorical_transformer = Pipeline(steps=[("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ],
        remainder="drop",
    )
    return X, y, preprocessor

def train_and_select(df: pd.DataFrame, target_col: str = "SalePrice"):
    out_dir = Path(__file__).resolve().parents[0] / "tracking"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Basic cleaning
    df = df.drop_duplicates().reset_index(drop=True)
    df.columns = [c.strip() for c in df.columns]
    
    # 1. FIX: Auto-detect the target column if 'SalePrice' is missing
    if target_col not in df.columns:
        # Search for columns that sound like price
        candidates = [c for c in df.columns if "price" in c.lower() or "cost" in c.lower()]
        if candidates:
            target_col = candidates[0]
            print(f"Target column not found. Using '{target_col}' instead.")
        else:
            raise ValueError(f"Could not find a price column. Available columns: {list(df.columns)}")
    
    # Simple Fill
    df = df.fillna(df.median(numeric_only=True))

    X, y, preprocessor = prepare_features(df, target_col)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    candidates = {
        "GradientBoosting": Pipeline(steps=[("pre", preprocessor), ("model", GradientBoostingRegressor(n_estimators=100, random_state=42))])
    }

    for name, pipeline in candidates.items():
        print(f"Training {name}...")
        pipeline.fit(X_train, y_train)
        model_path = out_dir / f"{name}.joblib"
        joblib.dump(pipeline, model_path)
        print(f"Saved to {model_path}")

    return "Training Complete"
def main():
    df = pd.read_csv(find_dataset())
    train_and_select(df)

if __name__ == "__main__":
    main()