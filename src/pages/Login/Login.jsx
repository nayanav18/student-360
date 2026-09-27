/* ============================================================
   Login Page
   
   WHAT IT DOES:
   - Full-screen centered login experience
   - Roll number + password with show/hide
   - Validates against mock credentials
   - Animated error feedback
   
   REACT CONCEPTS:
   - useState: tracks form fields and UI states
   - Controlled inputs: React state controls the input value
     (value={rollNumber} + onChange={e => setRollNumber(e.target.value)})
   - Conditional rendering: error message only shows when needed
   - Form submission: onSubmit prevents default page reload
   ============================================================ */

import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { mockCredentials } from '../../data/mockData';
import './Login.css';

function Login({ onLoginSuccess }) {
  // ---- State ----
  const [rollNumber, setRollNumber]   = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [shake, setShake]             = useState(false);

  // ---- Handle form submit ----
  const handleSubmit = async (e) => {
    e.preventDefault(); // Don't reload the page
    setError('');

    // Basic validation
    if (!rollNumber.trim()) {
      triggerError('Please enter your roll number');
      return;
    }
    if (!password) {
      triggerError('Please enter your password');
      return;
    }

    setLoading(true);

    // Simulate a small network delay (makes it feel real)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check credentials
    if (
      rollNumber.trim().toUpperCase() === mockCredentials.rollNumber &&
      password === mockCredentials.password
    ) {
      // Success — tell the parent (App.jsx) the user logged in
      onLoginSuccess();
    } else {
      setLoading(false);
      triggerError('Incorrect roll number or password. Try STU36001 / student123');
    }
  };

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  return (
    <div className="login-page">
      {/* Soft background */}
      <div className="login-bg" />

      {/* Centered login card */}
      <div className={`login-card ${shake ? 'login-card-shake' : ''}`}>
        {/* Branding */}
        <div className="login-brand">
          <div className="login-brand-logo">
            <span className="login-brand-number">360</span>
          </div>
          <h1 className="login-brand-name">Student 360</h1>
          <p className="login-brand-tagline">Your academic command center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Roll Number field */}
          <div className="login-field">
            <label htmlFor="rollNumber" className="login-label">
              Roll Number
            </label>
            <input
              id="rollNumber"
              type="text"
              className="login-input"
              placeholder="e.g. STU36001"
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Password field */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <div className="login-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input-password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* Hint */}
          <div className="login-hint">
            Demo: STU36001 / student123
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <LogIn size={17} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>

      {/* Decorative floating shapes */}
      <div className="login-shape login-shape-1" />
      <div className="login-shape login-shape-2" />
      <div className="login-shape login-shape-3" />
    </div>
  );
}

export default Login;
