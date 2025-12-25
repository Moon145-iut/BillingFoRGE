import React from 'react';
import { ConfigResponse } from '../../services/api/coreApi';

interface AdminSummaryProps {
  config: ConfigResponse | null;
}

const AdminSummary: React.FC<AdminSummaryProps> = ({ config }) => {
  if (!config) {
    return null;
  }

  return (
    <div className="admin-summary">
      <div>
        <p>Status</p>
        <strong>{config.isDefault ? 'Default configuration' : 'Custom configuration'}</strong>
      </div>
      <div>
        <p>Base Rate</p>
        <strong>${config.baseRate.toFixed(2)}</strong>
      </div>
      <div>
        <p>VAT Percentage</p>
        <strong>{config.taxRate.toFixed(2)}%</strong>
      </div>
      <div>
        <p>Service Charge</p>
        <strong>${config.serviceCharge.toFixed(2)}</strong>
      </div>
      {!config.isDefault && (
        <div>
          <p>Last Updated</p>
          <strong>{new Date(config.updatedAt).toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
};

export default AdminSummary;
