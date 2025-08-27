// Type validation and example usage
import type { Plan } from './business';
import type { AsyncState } from './api';
import type { ButtonProps } from './components';

// Example type usage - this validates our type definitions
export const examplePlan: Plan = {
  id: 'basic',
  name: 'Basic Health Plan',
  description: 'Essential healthcare coverage',
  price: 50,
  currency: 'USD',
  period: 'month',
  duration: '12 months',
  features: ['Doctor consultations', 'Basic health checkups', 'Emergency support'],
  featured: false,
  category: 'bronze',
  benefits: {
    teleConsultation: true,
    hospitalDiscount: 10,
    medicineDiscount: 15,
    shopDiscount: 5,
    cashback: 100,
    lifeCoverage: {
      accidental: 50000,
      natural: 25000
    }
  },
  popular: false,
  available: true
};

export const exampleAsyncState: AsyncState<Plan[]> = {
  data: null,
  loading: false,
  error: null
};

export const exampleButtonProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  children: 'Click me',
  onClick: () => console.log('Button clicked')
};

// This file serves as validation that our type system is working correctly
