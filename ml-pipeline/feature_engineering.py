"""Feature engineering helpers for ML pipeline"""
import pandas as pd
import numpy as np


def add_basic_features(df: pd.DataFrame) -> pd.DataFrame:
    # Example: create total rooms if columns exist
    df = df.copy()
    if "TotalBsmtSF" in df.columns and "GrLivArea" in df.columns:
        df["total_area"] = df["TotalBsmtSF"].fillna(0) + df["GrLivArea"].fillna(0)
    # Year related features
    if "YearBuilt" in df.columns:
        df["age"] = df["YearBuilt"].apply(lambda y: 0 if pd.isna(y) else 2020 - int(y))
    return df


def encode_rare_categories(df: pd.DataFrame, col: str, thresh: float = 0.01) -> pd.DataFrame:
    # Replace rare categories with 'Other'
    df = df.copy()
    freq = df[col].value_counts(normalize=True)
    rare = freq[freq < thresh].index
    df[col] = df[col].replace(rare, "Other")
    return df
