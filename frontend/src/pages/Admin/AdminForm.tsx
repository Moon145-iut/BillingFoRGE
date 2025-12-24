import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ConfigResponse, coreApi } from '../../services/api/coreApi';

interface AdminFormProps {
  config: ConfigResponse | null;
  onSaved: (config: ConfigResponse) => void;
}

type FormValues = {
  baseRate: number;
  taxRate: number;
  serviceCharge: number;
};

const AdminForm: React.FC<AdminFormProps> = ({ config, onSaved }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (config) {
      reset({
        baseRate: config.baseRate,
        taxRate: config.taxRate,
        serviceCharge: config.serviceCharge,
      });
    }
  }, [config, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      baseRate: Number(values.baseRate),
      taxRate: Number(values.taxRate),
      serviceCharge: Number(values.serviceCharge),
    };
    const updated = await coreApi.createConfig(payload);
    onSaved(updated);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <label>
          <span>$ Base Rate per Unit</span>
          <input type="number" step="0.01" {...register('baseRate', { required: 'Required', min: 0 })} />
          {errors.baseRate && <p className="form-error">{errors.baseRate.message}</p>}
        </label>
        <label>
          <span>% VAT Percentage</span>
          <input type="number" step="0.01" {...register('taxRate', { required: 'Required', min: 0 })} />
          {errors.taxRate && <p className="form-error">{errors.taxRate.message}</p>}
        </label>
        <label>
          <span>Service Charge ($)</span>
          <input type="number" step="0.01" {...register('serviceCharge', { required: 'Required', min: 0 })} />
          {errors.serviceCharge && <p className="form-error">{errors.serviceCharge.message}</p>}
        </label>
      </div>
      <button className="primary-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Configuration'}
      </button>
    </form>
  );
};

export default AdminForm;
