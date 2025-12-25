import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminForm from './AdminForm';
import AdminSummary from './AdminSummary';
import { ConfigResponse, coreApi } from '../../services/api/coreApi';

const AdminPage: React.FC = () => {
  const [session, setSession] = useState<string | null>(localStorage.getItem('adminSession'));
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem('adminSession', session);
      fetchConfig();
    } else {
      localStorage.removeItem('adminSession');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const latest = await coreApi.getActiveConfig();
      setConfig(latest);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setOtpError(null);
    try {
      await coreApi.requestAdminOtp(email);
      setOtpSent(true);
      setOtpMessage('OTP sent! Check your inbox.');
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || 'Unable to send OTP.');
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setOtpError(null);
    try {
      const { sessionToken } = await coreApi.verifyAdminOtp(email, otpCode);
      setSession(sessionToken);
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || 'Invalid OTP.');
    }
  };

  const handleSaved = (cfg: ConfigResponse) => {
    setConfig(cfg);
  };

  const handleReset = async () => {
    if (!window.confirm('Reset to default configuration?')) return;
    const defaults = await coreApi.resetConfig();
    setConfig(defaults);
  };

  if (!session) {
    return (
      <div className="admin-access">
        <div className="access-card">
          <div className="icon badge-blue">🔒</div>
          <h2>Admin Access</h2>
          <p>Please enter your email to receive a one-time passcode.</p>
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="access-form">
              <input
                type="email"
                placeholder="Enter work email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className="primary-btn" type="submit">
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="access-form">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                required
              />
              <button className="primary-btn" type="submit">
                Unlock Dashboard
              </button>
            </form>
          )}
          {otpMessage && <p className="text-success">{otpMessage}</p>}
          {otpError && <p className="form-error">{otpError}</p>}
          <Link to="/" className="ghost-link">
            ← Back to Calculator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <Link to="/" className="ghost-link">
            ← Back to Home
          </Link>
          <h1>Admin Dashboard</h1>
          <p>Update the base rates and percentages for the utility bill calculator.</p>
        </div>
        <button
          className="ghost-btn"
          onClick={() => {
            setSession(null);
            setOtpSent(false);
            setOtpCode('');
            setEmail('');
          }}
        >
          Logout
        </button>
      </header>

      <AdminSummary config={config} />

      {loadingConfig && <p>Loading configuration…</p>}

      <section className="admin-card">
        <AdminForm config={config} onSaved={handleSaved} />
        <button
          className="ghost-btn"
          type="button"
          onClick={handleReset}
          disabled={!config || config.isDefault}
          style={{ marginTop: '1rem' }}
        >
          Reset to Defaults
        </button>
      </section>
    </div>
  );
};

export default AdminPage;
