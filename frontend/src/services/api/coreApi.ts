import axiosInstance from './axios';

export interface ConfigResponse {
  id: number;
  baseRate: number;
  taxRate: number;
  serviceCharge: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface CalculateRequest {
  units: number;
}

export interface CalculateResponse {
  units: number;
  ratePerUnit: number;
  subtotal: number;
  vatAmount: number;
  serviceCharge: number;
  total: number;
  configId: number;
}

export interface RequestOtpResponse {
  message: string;
  otp: string;
}

export const coreApi = {
  getActiveConfig: async (): Promise<ConfigResponse> => {
    const { data } = await axiosInstance.get('/api/config');
    return data;
  },

  createConfig: async (
    config: Omit<ConfigResponse, 'id' | 'active' | 'createdAt' | 'updatedAt' | 'isDefault'>,
  ): Promise<ConfigResponse> => {
    const { data } = await axiosInstance.post('/api/config', config);
    return data;
  },

  calculateBill: async (request: CalculateRequest): Promise<CalculateResponse> => {
    const { data } = await axiosInstance.post('/api/calculate', request);
    return data;
  },

  requestAdminOtp: async (email: string): Promise<RequestOtpResponse> => {
    const { data } = await axiosInstance.post('/api/auth/request-otp', { email });
    return data;
  },

  verifyAdminOtp: async (email: string, code: string) => {
    const { data } = await axiosInstance.post('/api/auth/verify-otp', { email, code });
    return data as { sessionToken: string; expiresAt: string };
  },

  resetConfig: async (): Promise<ConfigResponse> => {
    const { data } = await axiosInstance.delete('/api/config');
    return data;
  },
};
