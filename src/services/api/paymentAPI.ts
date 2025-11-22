import axios, { AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// Use real backend API by default (set VITE_USE_MOCK_API=true to enable mock mode)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'; // Default to false

// TypeScript interfaces
export interface PaymentProofSubmission {
  transactionId: string;
  paymentMethod: 'touch-n-go' | 'bkash' | 'bank-transfer';
  amount: number;
  payerName: string;
  payerContact: string;
  screenshot: File | null;
  notes?: string;
}

export interface PaymentProofResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    transactionId: string;
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: string;
  };
  errors?: Record<string, string[]>;
}

/**
 * Submit payment proof to backend
 * Endpoint: POST /api/v1/payment/proof/
 */
export const submitPaymentProof = async (
  data: PaymentProofSubmission
): Promise<PaymentProofResponse> => {
  // Mock API for development
  if (USE_MOCK_API) {
    console.log('[MOCK API] Payment proof submission:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful response
    return {
      success: true,
      message: 'Payment proof submitted successfully. We will verify your payment within 24-48 hours.',
      data: {
        id: `PAY-${Date.now()}`,
        transactionId: data.transactionId,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
    };
  }

  // Real API implementation
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Append all fields
    formData.append('transaction_id', data.transactionId);
    formData.append('payment_method', data.paymentMethod);
    formData.append('amount', data.amount.toString());
    formData.append('payer_name', data.payerName);
    formData.append('payer_contact', data.payerContact);
    
    // Append screenshot if provided (optional)
    if (data.screenshot) {
      formData.append('screenshot', data.screenshot);
    }
    
    // Append notes if provided
    if (data.notes?.trim()) {
      formData.append('notes', data.notes.trim());
    }

    // Make API request
    const response = await axios.post<PaymentProofResponse>(
      `${API_BASE_URL}/v1/payment/proof/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout for file upload
      }
    );

    return response.data;

  } catch (error) {
    console.error('Payment proof submission error:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<PaymentProofResponse>;
      
      if (axiosError.response) {
        // Server responded with error
        return {
          success: false,
          message: axiosError.response.data.message || 'Failed to submit payment proof',
          errors: axiosError.response.data.errors
        };
      } else if (axiosError.request) {
        // Request made but no response
        return {
          success: false,
          message: 'Unable to connect to server. Please check your internet connection.'
        };
      }
    }

    // Generic error
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    };
  }
};

/**
 * Get payment proof status by transaction ID
 * Endpoint: GET /api/v1/payment/proof/{transactionId}/
 */
export const getPaymentProofStatus = async (
  transactionId: string
): Promise<PaymentProofResponse> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] Fetching payment proof status:', transactionId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Payment proof found',
      data: {
        id: `PAY-${Date.now()}`,
        transactionId,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
    };
  }

  try {
    const response = await axios.get<PaymentProofResponse>(
      `${API_BASE_URL}/v1/payment/proof/${transactionId}/`
    );

    return response.data;

  } catch (error) {
    console.error('Payment proof status fetch error:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<PaymentProofResponse>;
      
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          message: 'Payment proof not found'
        };
      }

      return {
        success: false,
        message: axiosError.response?.data.message || 'Failed to fetch payment status'
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
};

export default {
  submitPaymentProof,
  getPaymentProofStatus
};
