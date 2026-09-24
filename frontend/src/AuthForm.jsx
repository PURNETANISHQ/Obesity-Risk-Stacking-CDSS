import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    age: 25,
    gender: 'Male',
    height: 1.75,
    weight: 70,
    family_history: 'yes'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isSignup ? 'http://127.0.0.1:8000/api/signup' : 'http://127.0.0.1:8000/api/login';
    
    try {
      if (isSignup) {
        await axios.post(endpoint, formData);
        alert('Signup successful! Please log in now.');
        setIsSignup(false);
      } else {
        const response = await axios.post(endpoint, {
          email: formData.email,
          password: formData.password
        });
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <h2>{isSignup ? 'Create Patient Account' : 'Patient Login'}</h2>
      {error && <div className="error-banner">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email Address:</label>
        <input type="email" name="email" required value={formData.email} onChange={handleChange} />

        <label>Password:</label>
        <input type="password" name="password" required value={formData.password} onChange={handleChange} />

        {isSignup && (
          <>
            <label>Full Name:</label>
            <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} />

            <div className="grid-2">
              <div>
                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
              </div>
              <div>
                <label>Gender:</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label>Height (meters):</label>
                <input type="number" step="0.01" name="height" value={formData.height} onChange={handleChange} />
              </div>
              <div>
                <label>Weight (kg):</label>
                <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} />
              </div>
            </div>

            <label>Family History of Overweight:</label>
            <select name="family_history" value={formData.family_history} onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </>
        )}

        <button type="submit" className="submit-btn">
          {isSignup ? 'Complete Registration' : 'Log In'}
        </button>
      </form>

      <p className="toggle-auth" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </p>
    </div>
  );
}

export default AuthForm;