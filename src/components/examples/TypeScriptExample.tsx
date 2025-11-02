import React from 'react';
import { useAsync, useToggle } from '../../hooks';
import { formatCurrency, generateId } from '../../utils/helpers';
import type { Plan } from '../../types/business';
import type { ButtonProps } from '../../types/components';

/**
 * Example component demonstrating modern TypeScript patterns
 * Shows usage of custom hooks, type guards, and utility functions
 */

interface ExampleComponentProps {
  readonly title: string;
  readonly onPlanSelect?: (plan: Plan) => void;
}

// Mock async function for demonstration
const fetchPlans = async (): Promise<Plan[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: generateId('plan'),
      name: 'Basic Health Plan',
      price: 50,
      currency: 'USD',
      period: 'month',
      description: 'Essential healthcare coverage',
      duration: '12 months',
      features: ['Doctor consultations', 'Basic health checkups'],
      featured: false,
      category: 'bronze' as const,
      benefits: {
        teleConsultation: true,
        hospitalDiscount: 10,
        medicineDiscount: 5,
        shopDiscount: 3,
        cashback: 0,
        lifeCoverage: {
          accidental: 5000,
          natural: 3000
        }
      },
      popular: true,
      available: true
    }
  ];
};

// Type-safe button component using our prop interfaces
const TypedButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 underline focus:ring-blue-500'
  };
  
  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'text-sm px-2 py-1 rounded',
    md: 'text-base px-4 py-2 rounded-md',
    lg: 'text-lg px-6 py-3 rounded-lg',
    xl: 'text-xl px-8 py-4 rounded-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export const TypeScriptExample: React.FC<ExampleComponentProps> = ({ 
  title, 
  onPlanSelect 
}) => {
  // Custom hooks with full TypeScript support
  const { data: plans, loading, error, execute: loadPlans } = useAsync(fetchPlans);
  const { value: showDetails, toggle: toggleDetails } = useToggle(false);

  // Effect to load plans on mount
  React.useEffect(() => {
    loadPlans().catch(console.error);
  }, [loadPlans]);

  // Type-safe plan selection handler
  const handlePlanSelect = (plan: Plan) => {
    console.log(`Selected plan: ${plan.name} - ${formatCurrency(plan.price, plan.currency)}`);
    onPlanSelect?.(plan);
  };

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Error Loading Plans</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
        <TypedButton 
          variant="outline" 
          size="sm" 
          onClick={() => loadPlans()}
          className="mt-2"
        >
          Retry
        </TypedButton>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <TypedButton 
          variant="outline" 
          size="sm"
          onClick={toggleDetails}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </TypedButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading plans...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {plans?.map((plan) => (
            <div
              key={plan.id}
              className="p-4 border border-gray-200 rounded-md hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                  
                  {showDetails && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Duration: {plan.duration}</p>
                      <p>Features: {plan.features.join(', ')}</p>
                      <p>Category: {plan.category}</p>
                      {plan.popular && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                          Popular
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(plan.price, plan.currency)}
                    <span className="text-sm font-normal text-gray-500">
                      /{plan.period}
                    </span>
                  </div>
                  <TypedButton
                    size="sm"
                    onClick={() => handlePlanSelect(plan)}
                    className="mt-2"
                  >
                    Select Plan
                  </TypedButton>
                </div>
              </div>
            </div>
          ))}
          
          {plans?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No plans available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypeScriptExample;
