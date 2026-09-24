import streamlit as st
import joblib
import pandas as pd

st.set_page_config(page_title="Obesity Risk Estimator", layout="centered")

st.title("Obesity Risk Level Estimator")
st.write("Enter your lifestyle and physical measurements to estimate obesity category.")

@st.cache_resource
def load_model():
    return joblib.load('obesity_stacking_model.pkl')

model_data = load_model()
pipeline = model_data['pipeline']
label_encoder = model_data['label_encoder']

with st.form("user_input_form"):
    col1, col2 = st.columns(2)
    
    with col1:
        gender = st.selectbox("Gender", ["Male", "Female"])
        age = st.number_input("Age", min_value=10.0, max_value=100.0, value=25.0)
        height = st.number_input("Height (meters)", min_value=1.0, max_value=2.5, value=1.75)
        weight = st.number_input("Weight (kg)", min_value=30.0, max_value=250.0, value=70.0)
        family_history = st.selectbox("Family History of Overweight?", ["yes", "no"])
        favc = st.selectbox("Frequent High Caloric Food?", ["yes", "no"])
        fcvc = st.slider("Frequency of Vegetable Consumption (1-3)", 1.0, 3.0, 2.0)
        ncp = st.slider("Number of Main Meals (1-4)", 1.0, 4.0, 3.0)

    with col2:
        caec = st.selectbox("Consumption between Meals", ["no", "Sometimes", "Frequently", "Always"])
        smoke = st.selectbox("Do you smoke?", ["no", "yes"])
        ch2o = st.slider("Daily Water Intake (Liters)", 1.0, 3.0, 2.0)
        scc = st.selectbox("Monitor Calorie Intake?", ["no", "yes"])
        faf = st.slider("Physical Activity Frequency (Days/Week)", 0.0, 3.0, 1.0)
        tue = st.slider("Technology Use Time (Hours/Day)", 0.0, 2.0, 1.0)
        calc = st.selectbox("Alcohol Consumption", ["no", "Sometimes", "Frequently", "Always"])
        mtrans = st.selectbox("Transportation Used", ["Public_Transportation", "Walking", "Automobile", "Motorbike", "Bike"])

    submit = st.form_submit_button("Predict Obesity Category")

if submit:
    input_df = pd.DataFrame([{
        'Gender': gender,
        'Age': age,
        'Height': height,
        'Weight': weight,
        'family_history_with_overweight': family_history,
        'FAVC': favc,
        'FCVC': fcvc,
        'NCP': ncp,
        'CAEC': caec,
        'SMOKE': smoke,
        'CH2O': ch2o,
        'SCC': scc,
        'FAF': faf,
        'TUE': tue,
        'CALC': calc,
        'MTRANS': mtrans
    }])
    
    pred_encoded = pipeline.predict(input_df)[0]
    prediction = label_encoder.inverse_transform([pred_encoded])[0]
    
    st.success(f"**Predicted Category:** {prediction.replace('_', ' ')}")