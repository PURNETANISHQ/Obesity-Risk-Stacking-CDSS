import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CarePage({ category, onReset }) {
  const [careData, setCareData] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/care_info/${category}`)
      .then((res) => setCareData(res.data))
      .catch((err) => console.error(err));
  }, [category]);

  if (!careData) return <div className="container"><p>Loading personal recovery plan...</p></div>;

  return (
    <div className="container">
      <div className="care-header">
        <h1>Transformation & Recovery Dashboard</h1>
        <p className="category-badge">Assessed Category: <strong>{careData.category}</strong></p>
      </div>

      <div className="section-card">
        <h2>🏋️ Strategy to Address & Cure {careData.category}</h2>
        <h3>Core Approach: {careData.cure_plan.strategy}</h3>
        <ul>
          {careData.cure_plan.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h2>🥗 Healthy Recipe Guidelines</h2>
        <div className="recipe-grid">
          {careData.recipes.map((recipe, idx) => (
            <div key={idx} className="recipe-card">
              <h4>{recipe.title}</h4>
              <p><strong>Calories:</strong> {recipe.calories} | <strong>Prep:</strong> {recipe.prep_time}</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p className="benefit"><em>{recipe.benefit}</em></p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h2>📍 Nearby Transformation & Wellness Centers</h2>
        <div className="center-grid">
          {careData.centers.map((center, idx) => (
            <div key={idx} className="center-card">
              <h4>{center.name}</h4>
              <p>📍 {center.address}</p>
              <p>📞 {center.contact}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onReset} className="submit-btn">Run Another Assessment</button>
    </div>
  );
}

export default CarePage;