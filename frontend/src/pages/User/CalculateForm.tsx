import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { coreApi, CalculateResponse } from '../../services/api/coreApi';

interface CalculateFormData {
  units: number;
}

interface CalculateFormProps {
  onResult: (result: CalculateResponse) => void;
}

const CalculateForm: React.FC<CalculateFormProps> = ({ onResult }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculateFormData>({ defaultValues: { units: 0 } });

  const onSubmit = async (data: CalculateFormData) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      const result = await coreApi.calculateBill({ units: Number(data.units) });
      onResult(result);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Unable to calculate bill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="calculate-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Calculate Now</h2>
      <label htmlFor="units">Electricity Units (kWh)</label>
      <input
        id="units"
        type="number"
        step="0.01"
        min="0"
        {...register('units', { required: 'Usage is required', min: { value: 0, message: 'Must be positive' } })}
      />
      {errors.units && <p className="form-error">{errors.units.message}</p>}
      {errorMessage && <p className="form-error">{errorMessage}</p>}
      <button type="submit" className="primary-btn" disabled={submitting}>
        {submitting ? 'Calculating…' : 'Calculate Bill →'}
      </button>
    </form>
  );
};

export default CalculateForm;
