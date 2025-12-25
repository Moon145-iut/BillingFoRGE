import React, { useEffect, useState } from 'react';
import CalculateForm from './CalculateForm';
import ResultCard from './ResultCard';
import { ConfigResponse, coreApi, CalculateResponse } from '../../services/api/coreApi';

const UserPage: React.FC = () => {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculateResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    coreApi
      .getActiveConfig()
      .then((data) => {
        if (mounted) {
          setConfig(data);
        }
      })
      .catch(() => setConfigError('Unable to load configuration.'))
      .finally(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="user-page">
      <header className="hero">
        <div className="hero-content">
          <p className="badge">BillCalc</p>
          <h1>Estimate Your Monthly Bill</h1>
          <p>Enter your consumption units below to get an instant breakdown of costs including VAT and service charges.</p>
        </div>
      </header>

      {configError && <div className="alert alert-error">{configError}</div>}
      {config?.isDefault && (
        <div className="alert">
          The admin has not customized rates yet. Showing default configuration.
        </div>
      )}

      <section className="stat-grid">
        <article className="stat-card">
          <div className="icon badge-blue">$</div>
          <div>
            <p>Base Rate</p>
            <h3>{config ? `$${config.baseRate.toFixed(2)}` : '—'}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="icon badge-purple">%</div>
          <div>
            <p>VAT Tax</p>
            <h3>{config ? `${config.taxRate.toFixed(2)}%` : '—'}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="icon badge-green">SC</div>
          <div>
            <p>Service Charge</p>
            <h3>{config ? `$${config.serviceCharge.toFixed(2)}` : '—'}</h3>
          </div>
        </article>
      </section>

      <section className="calculator-panel">
        <CalculateForm onResult={setResult} />
        <ResultCard result={result} />
      </section>
    </div>
  );
};

export default UserPage;
