import React, { useState } from 'react';
import { DesignSystemProvider } from '../../design-system/provider';
import Card from '../compound/Card';
import Button from '../ui/Button';
import Input from '../forms/Input';
import Select from '../forms/Select';
import { ToastProvider } from '../ui/Toast';
import { useToastHelpers } from '../ui/toastHooks';

/**
 * Comprehensive Form Example
 * Demonstrates form state management, validation, and UI components
 */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  healthPlan: string;
  medicalHistory: string;
  emergencyContact: string;
  insuranceProvider: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FormState {
  data: FormData;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
}

// Validation functions
const validators = {
  required: (value: string) => {
    return !value.trim() ? 'This field is required' : '';
  },
  
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
  },
  
  phone: (value: string) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return !phoneRegex.test(value) ? 'Please enter phone as (123) 456-7890' : '';
  },
  
  minLength: (min: number) => (value: string) => {
    return value.length < min ? `Must be at least ${min} characters` : '';
  },
};

// Health plan options
const healthPlanOptions = [
  { value: 'basic', label: 'Basic Health Plan - $99/month' },
  { value: 'premium', label: 'Premium Health Plan - $199/month' },
  { value: 'family', label: 'Family Health Plan - $299/month' },
  { value: 'senior', label: 'Senior Health Plan - $149/month' },
];

// Insurance provider options
const insuranceOptions = [
  { value: 'aetna', label: 'Aetna' },
  { value: 'bluecross', label: 'Blue Cross Blue Shield' },
  { value: 'cigna', label: 'Cigna' },
  { value: 'humana', label: 'Humana' },
  { value: 'united', label: 'United Healthcare' },
  { value: 'none', label: 'No Insurance' },
];

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  healthPlan: '',
  medicalHistory: '',
  emergencyContact: '',
  insuranceProvider: '',
};

const PatientRegistrationForm: React.FC = () => {
  const { showSuccess, showError, showWarning } = useToastHelpers();
  
  const [formState, setFormState] = useState<FormState>({
    data: initialFormData,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  // Validate a single field
  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return validators.required(value);
      
      case 'email':
        return validators.required(value) || validators.email(value);
      
      case 'phone':
        return validators.required(value) || validators.phone(value);
      
      case 'healthPlan':
      case 'insuranceProvider':
        return validators.required(value);
      
      case 'emergencyContact':
        return validators.required(value) || validators.minLength(10)(value);
      
      default:
        return '';
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formState.data).forEach((key) => {
      const error = validateField(key as keyof FormData, formState.data[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setFormState(prev => ({ ...prev, errors: newErrors }));
    return isValid;
  };

  // Handle input change
  const handleChange = (name: keyof FormData, value: string) => {
    // Format phone number
    const formattedValue = name === 'phone' ? formatPhoneNumber(value) : value;
    
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: formattedValue },
      errors: { ...prev.errors, [name]: '' }, // Clear error when user starts typing
    }));
  };

  // Handle input blur
  const handleBlur = (name: keyof FormData) => {
    const value = formState.data[name];
    const error = validateField(name, value);
    
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
      errors: { ...prev.errors, [name]: error },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showWarning('Please fix the errors before submitting');
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Registration completed successfully!');
      
      // Reset form
      setFormState({
        data: initialFormData,
        errors: {},
        touched: {},
        isSubmitting: false,
      });
      
    } catch {
      showError('Registration failed. Please try again.');
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Reset form
  const handleReset = () => {
    setFormState({
      data: initialFormData,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
    showSuccess('Form reset successfully');
  };

  const getFieldError = (name: keyof FormData): string | undefined => {
    return formState.touched[name] ? formState.errors[name] : undefined;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card variant="elevated" size="lg">
        <Card.Header>
          <div className="text-center">
            <Card.Title as="h1">Patient Registration</Card.Title>
            <Card.Subtitle>
              Please fill out your information to register for our healthcare services
            </Card.Subtitle>
          </div>
        </Card.Header>

        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formState.data.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  error={getFieldError('firstName')}
                  required
                  fullWidth
                  placeholder="Enter your first name"
                />
                
                <Input
                  label="Last Name"
                  value={formState.data.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  error={getFieldError('lastName')}
                  required
                  fullWidth
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={formState.data.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={getFieldError('email')}
                  required
                  fullWidth
                  placeholder="your.email@example.com"
                  startIcon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formState.data.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={getFieldError('phone')}
                  required
                  fullWidth
                  placeholder="(123) 456-7890"
                  helperText="Format: (123) 456-7890"
                  startIcon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Healthcare Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Healthcare Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Health Plan"
                  value={formState.data.healthPlan}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('healthPlan', e.target.value)}
                  onBlur={() => handleBlur('healthPlan')}
                  error={getFieldError('healthPlan')}
                  required
                  fullWidth
                  placeholder="Select a health plan"
                  options={healthPlanOptions}
                />
                
                <Select
                  label="Current Insurance Provider"
                  value={formState.data.insuranceProvider}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('insuranceProvider', e.target.value)}
                  onBlur={() => handleBlur('insuranceProvider')}
                  error={getFieldError('insuranceProvider')}
                  required
                  fullWidth
                  placeholder="Select insurance provider"
                  options={insuranceOptions}
                />
              </div>
              
              <div className="mt-4">
                <Input
                  label="Emergency Contact"
                  value={formState.data.emergencyContact}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('emergencyContact', e.target.value)}
                  onBlur={() => handleBlur('emergencyContact')}
                  error={getFieldError('emergencyContact')}
                  required
                  fullWidth
                  placeholder="Name and phone number of emergency contact"
                  helperText="Include name and phone number"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <textarea
                  value={formState.data.medicalHistory}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('medicalHistory', e.target.value)}
                  onBlur={() => handleBlur('medicalHistory')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  rows={4}
                  placeholder="Please describe any relevant medical history, current medications, allergies, or conditions..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: This information helps us provide better care
                </p>
              </div>
            </div>
          </form>
        </Card.Content>

        <Card.Actions align="right">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={formState.isSubmitting}
          >
            Reset Form
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={formState.isSubmitting}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Registering...' : 'Complete Registration'}
          </Button>
        </Card.Actions>
      </Card>

      {/* Form State Debug Panel (for development) */}
      {import.meta.env.DEV && (
        <Card variant="outlined" size="sm" className="mt-8">
          <Card.Header>
            <Card.Title as="h4">Form State (Dev Only)</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Errors:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(formState.errors, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Touched:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(formState.touched, null, 2)}
                </pre>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

const FormExampleWrapper: React.FC = () => {
  return (
    <ToastProvider>
      <DesignSystemProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
          <PatientRegistrationForm />
        </div>
      </DesignSystemProvider>
    </ToastProvider>
  );
};

export default FormExampleWrapper;
