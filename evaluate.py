import joblib
import pandas as pd
from sklearn.metrics import classification_report, accuracy_score

print("Loading saved model...")
data = joblib.load('obesity_stacking_model.pkl')

pipeline = data['pipeline']
label_encoder = data['label_encoder']
X_test = data['X_test']
y_test = data['y_test']

print("Evaluating model...")
y_pred = pipeline.predict(X_test)

acc = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {acc * 100:.2f}%")
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))