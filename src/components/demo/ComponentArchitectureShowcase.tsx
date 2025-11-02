import React from 'react';
import { DesignSystemProvider } from '../../design-system/provider';
import { useDesignSystem } from '../../design-system/hooks';
import Card from '../compound/Card';
import Button from '../ui/Button';
import { useToastHelpers } from '../ui/toastHooks';
import { ToastProvider } from '../ui/Toast';

/**
 * Component Architecture Showcase
 * Demonstrates design system, compound components, and state management patterns
 */

// Example of a reusable business component with proper state management
interface HealthPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

interface HealthPlanCardProps {
  plan: HealthPlan;
  onSelect: (plan: HealthPlan) => void;
  selected: boolean;
  loading?: boolean;
}

const HealthPlanCard: React.FC<HealthPlanCardProps> = ({
  plan,
  onSelect,
  selected,
  loading = false,
}) => {
  const { showSuccess } = useToastHelpers();
  
  const handleSelect = () => {
    onSelect(plan);
    showSuccess(`${plan.name} plan selected!`);
  };

  return (
    <Card
      variant={selected ? 'elevated' : plan.recommended ? 'outlined' : 'default'}
      size="md"
      interactive
      className={`${selected ? 'ring-2 ring-primary-500' : ''} ${plan.recommended ? 'border-primary-300' : ''}`}
    >
      <Card.Header>
        <Card.Title>{plan.name}</Card.Title>
        {plan.recommended && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            Recommended
          </span>
        )}
      </Card.Header>
      
      <Card.Content>
        <div className="text-3xl font-bold text-gray-900 mb-4">
          ${plan.price}
          <span className="text-base font-normal text-gray-600">/month</span>
        </div>
        
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <span className="mr-2 text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </Card.Content>
      
      <Card.Actions>
        <Button
          variant={selected ? 'success' : 'primary'}
          size="md"
          loading={loading}
          onClick={handleSelect}
          fullWidth
        >
          {selected ? 'Selected' : 'Select Plan'}
        </Button>
      </Card.Actions>
    </Card>
  );
};

// Theme Control Component (demonstrates design system integration)
const ThemeControls: React.FC = () => {
  const { theme, setMode, setDensity } = useDesignSystem();
  
  return (
    <Card variant="outlined" size="sm">
      <Card.Header>
        <Card.Title as="h4">Theme Controls</Card.Title>
      </Card.Header>
      
      <Card.Content>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Mode
            </label>
            <div className="flex gap-2">
              {(['light', 'dark', 'auto'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={theme.mode === mode ? 'primary' : 'outline'}
                  size="xs"
                  onClick={() => setMode(mode)}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Density
            </label>
            <div className="flex gap-2">
              {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                <Button
                  key={density}
                  variant={theme.density === density ? 'primary' : 'outline'}
                  size="xs"
                  onClick={() => setDensity(density)}
                >
                  {density}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

// State Management Example
interface AppState {
  selectedPlan: HealthPlan | null;
  isLoading: boolean;
  plans: HealthPlan[];
}

const initialState: AppState = {
  selectedPlan: null,
  isLoading: false,
  plans: [
    {
      id: '1',
      name: 'Basic Health',
      price: 99,
      features: [
        'Basic health checkups',
        'Emergency coverage',
        'Prescription discounts',
        '24/7 phone support',
      ],
    },
    {
      id: '2',
      name: 'Premium Health',
      price: 199,
      recommended: true,
      features: [
        'Comprehensive health checkups',
        'Full emergency coverage',
        'Free prescriptions',
        'Specialist consultations',
        'Dental and vision care',
        'Mental health support',
      ],
    },
    {
      id: '3',
      name: 'Family Health',
      price: 299,
      features: [
        'Family coverage (up to 4 members)',
        'Pediatric care',
        'Maternity benefits',
        'Wellness programs',
        'Preventive care',
        'Home healthcare',
      ],
    },
  ],
};

// State management with useReducer pattern
type AppAction =
  | { type: 'SELECT_PLAN'; payload: HealthPlan }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_SELECTION' };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SELECT_PLAN':
      return { ...state, selectedPlan: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_SELECTION':
      return { ...state, selectedPlan: null };
    default:
      return state;
  }
};

const ComponentArchitectureShowcase: React.FC = () => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const { showInfo, showWarning } = useToastHelpers();

  const handlePlanSelect = React.useCallback((plan: HealthPlan) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'SELECT_PLAN', payload: plan });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  }, []);

  const handleReset = () => {
    dispatch({ type: 'RESET_SELECTION' });
    showInfo('Selection cleared');
  };

  const handleProceed = () => {
    if (!state.selectedPlan) {
      showWarning('Please select a plan first');
      return;
    }
    showInfo('Proceeding to checkout...');
  };

  return (
    <ToastProvider>
      <DesignSystemProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 slide-in">
                Component Architecture Showcase
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Demonstrating design system integration, compound components, 
                state management patterns, and reusable business components.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              {/* Theme Controls */}
              <div className="lg:col-span-1">
                <ThemeControls />
              </div>

              {/* Selected Plan Summary */}
              <div className="lg:col-span-3">
                <Card variant="filled" size="md">
                  <Card.Header>
                    <Card.Title>Selected Plan</Card.Title>
                    <Card.Actions align="right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={!state.selectedPlan}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleProceed}
                        disabled={!state.selectedPlan}
                      >
                        Proceed
                      </Button>
                    </Card.Actions>
                  </Card.Header>
                  
                  <Card.Content>
                    {state.selectedPlan ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {state.selectedPlan.name}
                          </h3>
                          <p className="text-gray-600">
                            ${state.selectedPlan.price}/month
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Selected
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No plan selected yet. Choose a plan below to get started.
                      </p>
                    )}
                  </Card.Content>
                </Card>
              </div>
            </div>

            {/* Health Plans Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choose Your Health Plan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.plans.map((plan) => (
                  <HealthPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={handlePlanSelect}
                    selected={state.selectedPlan?.id === plan.id}
                    loading={state.isLoading && state.selectedPlan?.id === plan.id}
                  />
                ))}
              </div>
            </div>

            {/* Architecture Features */}
            <Card variant="elevated" size="lg">
              <Card.Header>
                <Card.Title>Architecture Features Demonstrated</Card.Title>
              </Card.Header>
              
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      🎨
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Design System</h3>
                    <p className="text-sm text-gray-600">
                      Consistent design tokens, theme management, and component styling
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      🧩
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Compound Components</h3>
                    <p className="text-sm text-gray-600">
                      Flexible Card component with context sharing and composition patterns
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      ⚡
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">State Management</h3>
                    <p className="text-sm text-gray-600">
                      useReducer pattern with TypeScript for complex state logic
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      🔄
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reusable Components</h3>
                    <p className="text-sm text-gray-600">
                      Business logic separated into reusable, testable components
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      ♿
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
                    <p className="text-sm text-gray-600">
                      ARIA compliance, keyboard navigation, and screen reader support
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      🎯
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">TypeScript Safety</h3>
                    <p className="text-sm text-gray-600">
                      Strict typing with proper interfaces and type safety throughout
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </DesignSystemProvider>
    </ToastProvider>
  );
};

export default ComponentArchitectureShowcase;
