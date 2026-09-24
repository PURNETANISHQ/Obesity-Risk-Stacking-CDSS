import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = "http://127.0.0.1:8000/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Patient / Consumer');
  const [chronic, setChronic] = useState('');
  const [meds, setMeds] = useState('');

  // Data Collections
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  // Risk Estimator State
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(1.65);
  const [weight, setWeight] = useState(70);
  const [riskResult, setRiskResult] = useState('');
  const [lastDiagnosis, setLastDiagnosis] = useState('None');

  // Vendor Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Supplements');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Healthy Recipes Collection Data
  const recipes = [
    { title: "High-Protein Quinoa Bowl", calories: "350 kcal", protein: "18g", prep: "15 min", desc: "Nutrient-dense quinoa with roasted vegetables, chickpea salad, and lemon dressing." },
    { title: "Grilled Salmon with Asparagus", calories: "420 kcal", protein: "34g", prep: "20 min", desc: "Omega-3 rich wild salmon served with steamed garlic asparagus." },
    { title: "Avocado & Egg Breakfast Toast", calories: "290 kcal", protein: "14g", prep: "10 min", desc: "Whole grain sourdough topped with smashed avocado and poached eggs." },
    { title: "Mediterranean Greek Salad", calories: "260 kcal", protein: "9g", prep: "10 min", desc: "Crisp cucumbers, cherry tomatoes, kalamata olives, and light feta cheese." },
    { title: "Keto Roasted Cauliflower Soup", calories: "210 kcal", protein: "7g", prep: "25 min", desc: "Creamy low-carb roasted cauliflower blended with herbs and olive oil." },
    { title: "Lentil & Spinach Protein Stew", calories: "310 kcal", protein: "20g", prep: "30 min", desc: "Heart-healthy brown lentils simmered with fresh spinach and garlic." }
  ];

  // Transformation Centers Data
  const transformationCenters = [
    { name: "Apex Metabolic & Transformation Center", location: "S.G. Highway, Ahmedabad", contact: "+91 98765 43210", specialty: "Clinical Bariatrics & Meal Customization" },
    { name: "HealthCore Wellness Hub", location: "Bodakdev, Ahmedabad", contact: "+91 98765 11223", specialty: "Personalized Fitness & Thyroid Management" },
    { name: "Revive Lifestyle Modification Clinic", location: "Navrangpura, Ahmedabad", contact: "+91 98765 44556", specialty: "Type 2 Diabetes & Obesity Control" }
  ];

  // API Fetchers
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/logs`);
      if (res.ok) setAuditLogs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsersList = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`);
      if (res.ok) setUsersList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) setReviews(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserOrders = async (userEmail) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${userEmail}`);
      if (res.ok) setUserOrders(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin') {
      fetchAuditLogs();
      fetchUsersList();
    }
    if (activeTab === 'medical' || activeTab === 'vendor') fetchProducts();
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'profile' && currentUser) fetchUserOrders(currentUser.email);
  }, [activeTab, currentUser]);

  // Auth Operations
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        if (data.user.role.includes('Admin')) setActiveTab('admin');
        else if (data.user.role.includes('Vendor')) setActiveTab('vendor');
        else setActiveTab('profile');
      } else {
        alert(data.detail || "Authentication failed");
      }
    } catch (err) {
      alert("Error connecting to server. Make sure FastAPI backend is active.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
          chronic_conditions: chronic,
          daily_medications: meds
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account registered successfully! Please log in.");
        setActiveTab('login');
      } else {
        alert(data.detail || "Registration failed");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
    setEmail('');
    setPassword('');
  };

  // Admin Actions
  const handleToggleUserStatus = async (userEmail, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    try {
      const res = await fetch(`${API_BASE}/admin/user-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, status: nextStatus })
      });
      if (res.ok) {
        alert(`User status updated to ${nextStatus}`);
        fetchUsersList();
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/product/${productId}?user_email=${currentUser.email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Product removed successfully!");
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  // Product Purchase
  const handlePurchaseItem = async (pName, price) => {
    try {
      const res = await fetch(`${API_BASE}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          prod_name: pName,
          price: parseFloat(price)
        })
      });
      if (res.ok) {
        alert(`Order confirmed for ${pName}! View details in your profile.`);
      }
    } catch (err) {
      alert("Failed to place order.");
    }
  };

  // Vendor Actions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_email: currentUser.email,
          prod_name: prodName,
          category: prodCategory,
          price: parseFloat(prodPrice),
          stock: parseInt(prodStock),
          description: prodDesc
        })
      });
      if (res.ok) {
        alert("Product published to store!");
        setProdName('');
        setProdPrice('');
        setProdStock('');
        setProdDesc('');
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to publish product.");
    }
  };

  // Connect Risk Estimator to Stacking Ensemble ML Endpoint
  const handleCalculateRisk = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/predict-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser ? currentUser.email : "guest@healthcore.com",
          gender: gender,
          age: parseInt(age),
          height: parseFloat(height),
          weight: parseFloat(weight)
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        const resultText = `${data.diagnosis} (BMI: ${data.bmi})`;
        setRiskResult(resultText);
        setLastDiagnosis(resultText);

        if (data.diagnosis.includes("Overweight") || data.diagnosis.includes("Obesity")) {
          alert(`Stacking Ensemble Algorithm Diagnosis: ${data.diagnosis}.\n\nRedirecting you to Transformation Centers & Diet Plans.`);
          setActiveTab('centers');
        }
      }
    } catch (err) {
      alert("Failed to process prediction via ML server.");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          rating: parseInt(reviewRating),
          comment: reviewComment
        })
      });
      if (res.ok) {
        alert("Feedback posted!");
        setReviewComment('');
        fetchReviews();
      }
    } catch (err) {
      alert("Failed to post review.");
    }
  };

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <header className="header-glass">
        <h2 className="brand-logo" onClick={() => setActiveTab(currentUser ? 'profile' : 'login')} style={{cursor: 'pointer'}}>
          HealthCore
        </h2>

        {currentUser && (
          <nav className="nav-links">
            <button 
              className={`user-profile-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 {currentUser.full_name}
            </button>

            {currentUser.role.includes('Admin') && (
              <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}>
                Admin Panel
              </button>
            )}

            {!currentUser.role.includes('Admin') && (
              <>
                <button className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>
                  News & Articles
                </button>
                <button className={activeTab === 'recipes' ? 'active' : ''} onClick={() => setActiveTab('recipes')}>
                  100 Healthy Recipes
                </button>
                <button className={activeTab === 'risk' ? 'active' : ''} onClick={() => setActiveTab('risk')}>
                  Risk Estimator
                </button>
                <button className={activeTab === 'centers' ? 'active' : ''} onClick={() => setActiveTab('centers')}>
                  Transformation Centers
                </button>
                <button className={activeTab === 'medical' ? 'active' : ''} onClick={() => setActiveTab('medical')}>
                  Pharmacy Store
                </button>
              </>
            )}

            {currentUser.role.includes('Vendor') && (
              <button className={activeTab === 'vendor' ? 'active' : ''} onClick={() => setActiveTab('vendor')}>
                Vendor Inventory
              </button>
            )}

            <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
              Reviews
            </button>
            <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>
              About Us
            </button>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </header>

      {/* Main Content Areas */}
      <main className="main-content">

        {/* LOGIN FORM */}
        {!currentUser && activeTab === 'login' && (
          <div className="glass-card">
            <h3>Sign In</h3>
            <p className="subtitle">Enter your account credentials to access HealthCore</p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@domain.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="primary-btn">Log In</button>
            </form>
            <p className="toggle-text">
              Don't have an account? <span onClick={() => setActiveTab('signup')}>Create Account</span>
            </p>
          </div>
        )}

        {/* SIGNUP FORM */}
        {!currentUser && activeTab === 'signup' && (
          <div className="glass-card">
            <h3>Create Account</h3>
            <p className="subtitle">Register to manage your personal health profile</p>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Account Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Patient / Consumer">Patient / Consumer</option>
                  <option value="Pharmacy Vendor">Pharmacy Vendor</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Chronic Conditions</label>
                <input type="text" value={chronic} onChange={(e) => setChronic(e.target.value)} placeholder="e.g. Hypertension, Diabetes" />
              </div>
              <div className="form-group">
                <label>Daily Medications</label>
                <input type="text" value={meds} onChange={(e) => setMeds(e.target.value)} placeholder="e.g. Metformin 500mg" />
              </div>
              <button type="submit" className="primary-btn">Register Account</button>
            </form>
            <p className="toggle-text">
              Already have an account? <span onClick={() => setActiveTab('login')}>Sign In</span>
            </p>
          </div>
        )}

        {/* USER PROFILE PAGE */}
        {currentUser && activeTab === 'profile' && (
          <div className="glass-card full-width">
            <h3>User Health Profile Dashboard</h3>
            <p className="subtitle">Personal details, health records, and order history</p>

            <div className="profile-grid">
              <div className="profile-card">
                <h4>Account Details</h4>
                <p><strong>Name:</strong> {currentUser.full_name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
                <p><strong>Age:</strong> {age} years</p>
                <p><strong>Account Status:</strong> <span className="badge">{currentUser.status || 'Active'}</span></p>
              </div>

              <div className="profile-card">
                <h4>Medical Profile</h4>
                <p><strong>Chronic Conditions:</strong> {currentUser.chronic_conditions || 'None reported'}</p>
                <p><strong>Daily Medications:</strong> {currentUser.daily_medications || 'None reported'}</p>
                <p><strong>Last ML Diagnosis:</strong> <span className="highlight">{lastDiagnosis}</span></p>
              </div>
            </div>

            <h4 style={{marginTop: '30px', marginBottom: '12px'}}>Product Order History</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Title</th>
                  <th>Price</th>
                  <th>Ordered Date</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.length === 0 ? (
                  <tr><td colSpan="4">No order history found for this account.</td></tr>
                ) : (
                  userOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>#{ord.id}</td>
                      <td>{ord.prod_name}</td>
                      <td>${ord.price}</td>
                      <td>{ord.ordered_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ADMIN PANEL WITH USER BLOCKING & PRODUCT REMOVAL */}
        {currentUser && activeTab === 'admin' && currentUser.role.includes('Admin') && (
          <div className="glass-card full-width">
            <h3>System Administrator Control Dashboard</h3>
            
            <h4 style={{marginTop: '20px', marginBottom: '10px'}}>User Account Management (Block / Unblock)</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.email}>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td><span className={u.status === 'Blocked' ? 'badge-danger' : 'badge'}>{u.status}</span></td>
                    <td>
                      <button 
                        className="secondary-btn" 
                        onClick={() => handleToggleUserStatus(u.email, u.status)}
                      >
                        {u.status === 'Active' ? 'Block User' : 'Unblock User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{marginTop: '40px', marginBottom: '10px'}}>Product Inventory Management (Remove Products)</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="5">No products currently in store.</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.prod_name}</td>
                      <td>{p.category}</td>
                      <td>${p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete Item</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <h4 style={{marginTop: '40px', marginBottom: '10px'}}>Live System Audit Trail</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>User Email</th>
                  <th>Action Executed</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>#{log.id}</td>
                    <td>{log.user_email}</td>
                    <td><span className="badge">{log.action}</span></td>
                    <td>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NEWS & ARTICLES TAB */}
        {currentUser && activeTab === 'news' && (
          <div className="glass-card full-width">
            <h3>Health & Nutrition Articles</h3>
            <p className="subtitle">Latest insights in obesity management, gut health, and clinical nutrition</p>
            
            <div className="news-grid">
              <div className="news-card">
                <h4>Understanding Insulin Resistance & Weight Control</h4>
                <p>Insulin plays a central role in regulating body fat storage. Learn how switching to low-glycemic meal structures stabilizes blood sugar levels and prevents fat accumulation.</p>
              </div>
              <div className="news-card">
                <h4>The Science of Caloric Deficits and Metabolic Adaptation</h4>
                <p>Sustainable weight loss relies on balanced caloric intake rather than severe starvation diets. Discover how metabolic adaptation works and how to preserve lean muscle mass.</p>
              </div>
              <div className="news-card">
                <h4>Microbiome & Obesity: Gut Bacteria's Metabolic Impact</h4>
                <p>Recent clinical studies reveal that gut flora diversity directly affects nutrient absorption, hunger hormones (ghrelin/leptin), and systemic inflammation.</p>
              </div>
            </div>
          </div>
        )}

        {/* 100 HEALTHY RECIPES TAB */}
        {currentUser && activeTab === 'recipes' && (
          <div className="glass-card full-width">
            <h3>100 Healthy Food Recipes Collection</h3>
            <p className="subtitle">Nutritious, high-protein, low-carb recipes designed for healthy weight management</p>

            <div className="product-grid">
              {recipes.map((rec, idx) => (
                <div key={idx} className="product-card">
                  <div>
                    <h4>{rec.title}</h4>
                    <p className="subtitle" style={{marginBottom: '8px'}}>Prep Time: {rec.prep} | Protein: {rec.protein}</p>
                    <p className="desc">{rec.desc}</p>
                  </div>
                  <div>
                    <div className="price-tag">{rec.calories}</div>
                    <button className="secondary-btn">View Meal Guide</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK ESTIMATOR TAB WITH STACKING META-LEARNER ENGINE */}
        {currentUser && activeTab === 'risk' && (
          <div className="glass-card">
            <h3>Clinical Obesity Risk Estimator</h3>
            <p className="subtitle">Powered by Stacking Meta-Learner (CatBoost + LightGBM + NODE + Ridge Metaclassifier)</p>
            <form onSubmit={handleCalculateRisk}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Height (meters)</label>
                  <input type="number" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="primary-btn">Analyze Risk Profile</button>
            </form>
            {riskResult && (
              <div className="result-box">
                <h4>Diagnosis Result: <span className="highlight">{riskResult}</span></h4>
              </div>
            )}
          </div>
        )}

        {/* TRANSFORMATION CENTERS & DIET PLANS PAGE */}
        {currentUser && activeTab === 'centers' && (
          <div className="glass-card full-width">
            <h3>Nearby Transformation Centers & Customized Diet Plans</h3>
            <p className="subtitle">Recommended specialized centers and clinical dietary guides</p>

            <h4 style={{marginBottom: '14px'}}>Nearby Accredited Weight Loss Centers</h4>
            <div className="news-grid" style={{marginBottom: '30px'}}>
              {transformationCenters.map((center, idx) => (
                <div key={idx} className="news-card">
                  <h4>{center.name}</h4>
                  <p><strong>Location:</strong> {center.location}</p>
                  <p><strong>Specialty:</strong> {center.specialty}</p>
                  <p><strong>Contact:</strong> {center.contact}</p>
                  <button className="secondary-btn" style={{marginTop: '10px'}}>Book Consultation</button>
                </div>
              ))}
            </div>

            <h4>Clinical Dietary Blueprint</h4>
            <div className="profile-grid" style={{marginTop: '12px'}}>
              <div className="profile-card">
                <h4>High-Protein Low-Carb Meal Structure</h4>
                <p>&bull; <strong>Breakfast:</strong> Egg white omelet with spinach and flaxseeds.</p>
                <p>&bull; <strong>Lunch:</strong> Grilled chicken or tofu bowl with quinoa and steamed greens.</p>
                <p>&bull; <strong>Dinner:</strong> Roasted salmon with roasted zucchini and bell peppers.</p>
              </div>
              <div className="profile-card">
                <h4>Lifestyle & Activity Protocol</h4>
                <p>&bull; <strong>Hydration:</strong> Minimum 3.5 Liters of water daily.</p>
                <p>&bull; <strong>Physical Activity:</strong> 45 minutes of moderate aerobic resistance training.</p>
                <p>&bull; <strong>Sleep Optimization:</strong> 7 to 8 hours of uninterrupted rest.</p>
              </div>
            </div>
          </div>
        )}

        {/* PHARMACY STORE */}
        {currentUser && activeTab === 'medical' && (
          <div className="glass-card full-width">
            <h3>Medical Inventory & Pharmacy Store</h3>
            <p className="subtitle">Browse verified wellness products and medical supplies</p>
            <div className="product-grid">
              {products.length === 0 ? (
                <p>No products currently available in inventory.</p>
              ) : (
                products.map((prod) => (
                  <div key={prod.id} className="product-card">
                    <div>
                      <h4>{prod.prod_name}</h4>
                      <p className="subtitle" style={{marginBottom: '8px'}}>{prod.category}</p>
                      <p className="desc">{prod.description}</p>
                    </div>
                    <div>
                      <div className="price-tag">${prod.price}</div>
                      <button className="secondary-btn" onClick={() => handlePurchaseItem(prod.prod_name, prod.price)}>
                        Purchase Item
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VENDOR MANAGEMENT */}
        {currentUser && activeTab === 'vendor' && currentUser.role.includes('Vendor') && (
          <div className="glass-card">
            <h3>Add New Inventory Item</h3>
            <p className="subtitle">Publish new products to the HealthCore inventory</p>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Title</label>
                <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                  <option value="Supplements">Supplements</option>
                  <option value="Medication">Medication</option>
                  <option value="Fitness Gear">Fitness Gear</option>
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Stock Count</label>
                  <input type="number" required value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}></textarea>
              </div>
              <button type="submit" className="primary-btn">Publish Product</button>
            </form>
          </div>
        )}

        {/* REVIEWS TAB */}
        {currentUser && activeTab === 'reviews' && (
          <div className="glass-card full-width">
            <h3>Patient Reviews & Platform Feedback</h3>
            
            <div className="review-form-container">
              <form onSubmit={handleAddReview}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Rating (1-5 Stars)</label>
                    <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Feedback Comment</label>
                    <input type="text" required value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience..." />
                  </div>
                </div>
                <button type="submit" className="secondary-btn">Submit Feedback</button>
              </form>
            </div>

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p>No user reviews submitted yet.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="review-item">
                    <strong>{rev.user_email}</strong> &bull; <span className="highlight">Rating: {rev.rating}/5</span>
                    <p style={{marginTop: '6px'}}>{rev.comment}</p>
                    <small style={{color: '#94a3b8'}}>{rev.created_at}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ABOUT US TAB */}
        {currentUser && activeTab === 'about' && (
          <div className="glass-card full-width">
            <h3>About HealthCore Platform</h3>
            <p className="subtitle">Empowering patients, clinical practitioners, and wellness vendors</p>
            
            <div className="profile-grid">
              <div className="profile-card">
                <h4>Our Mission</h4>
                <p>HealthCore bridges the gap between patient health monitoring, clinical risk diagnostics powered by Stacking Machine Learning Ensembles, and direct access to medical supplies. Our glassmorphic web architecture delivers real-time data tracking backed by secure SQLite storage.</p>
              </div>
              <div className="profile-card">
                <h4>Platform Capabilities</h4>
                <p>&bull; Multi-role Authentication (Patient, Vendor, System Administrator)</p>
                <p>&bull; Stacking Ensemble ML Engine (CatBoost + LightGBM + NODE -&gt; Ridge)</p>
                <p>&bull; Live Audit Logs with Login/Logout event tracking</p>
                <p>&bull; Real-time pharmacy store inventory management</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}