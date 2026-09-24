import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import RidgeClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

# Load Data
print("Loading dataset...")
df = pd.read_csv('ObesityDataSet_raw_and_data_sinthetic.csv')

X = df.drop(columns=['NObeyesdad'])
y = df['NObeyesdad']

# Encode Target
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

num_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
cat_cols = X.select_dtypes(include=['object']).columns.tolist()

# Preprocessing Pipelines
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer([
    ('num', num_pipeline, num_cols),
    ('cat', cat_pipeline, cat_cols)
])

# Stacking Ensemble Setup
print("Building Stacking Ensemble...")
base_models = [
    ('catboost', CatBoostClassifier(verbose=0, random_state=42)),
    ('lgbm', LGBMClassifier(random_state=42, verbose=-1)),
    ('rf', RandomForestClassifier(n_estimators=150, random_state=42))
]

meta_learner = RidgeClassifier(alpha=1.0)

stacking_model = StackingClassifier(
    estimators=base_models,
    final_estimator=meta_learner,
    cv=10,
    n_jobs=-1
)

full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', stacking_model)
])

# Split & Train
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.20, random_state=42, stratify=y_encoded
)

print("Training model... Please wait 1 to 2 minutes.")
full_pipeline.fit(X_train, y_train)

# Save Model File
joblib.dump({
    'pipeline': full_pipeline,
    'label_encoder': label_encoder,
    'X_test': X_test,
    'y_test': y_test
}, 'obesity_stacking_model.pkl')

print("\nSUCCESS! Model saved as 'obesity_stacking_model.pkl'.")