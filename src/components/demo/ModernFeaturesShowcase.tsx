import React, { useState, useCallback } from 'react';
import CommandPalette from '../ui/CommandPalette';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { createDefaultCommands } from '../../utils/commandPaletteCommands';
import { useSwipeGesture, usePinchGesture, useLongPress } from '../../hooks/useGestures';
import type { Column } from '../ui/DataTable';

/**
 * Advanced Modern Features Demo
 * Comprehensive showcase of all new TypeScript UI features
 */

interface HealthPlan extends Record<string, unknown> {
  id: string;
  name: string;
  price: number;
  type: 'basic' | 'premium' | 'enterprise';
  features: string[];
  coverage: number;
  deductible: number;
  monthlyPremium: number;
  popular?: boolean;
  rating: number;
  provider: string;
}

interface DemoUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'pending' | 'expired';
  joinDate: string;
  lastActivity: string;
}

const ModernFeaturesShowcase: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<DemoUser[]>([]);
  const [gestureLog, setGestureLog] = useState<string[]>([]);

  // Command palette setup
  const toggleCommandPalette = useCallback(() => {
    setCommandPaletteOpen(prev => !prev);
  }, []);

  useCommandPalette(toggleCommandPalette);

  const navigateTo = useCallback((section: string) => {
    console.log(`Navigating to: ${section}`);
    setGestureLog(prev => [...prev.slice(-4), `Navigation: ${section}`]);
  }, []);

  const commands = createDefaultCommands(navigateTo);

  // Sample data for data table
  const healthPlans: HealthPlan[] = [
    {
      id: '1',
      name: 'Basic Care Plus',
      price: 99,
      type: 'basic',
      features: ['Emergency Coverage', '24/7 Support', 'Basic Consultations'],
      coverage: 80,
      deductible: 1000,
      monthlyPremium: 99,
      rating: 4.2,
      provider: 'HealthFirst',
    },
    {
      id: '2',
      name: 'Premium Wellness',
      price: 199,
      type: 'premium',
      features: ['All Basic Features', 'Specialist Access', 'Preventive Care', 'Mental Health'],
      coverage: 90,
      deductible: 500,
      monthlyPremium: 199,
      popular: true,
      rating: 4.7,
      provider: 'WellnessCorp',
    },
    {
      id: '3',
      name: 'Enterprise Complete',
      price: 299,
      type: 'enterprise',
      features: ['All Premium Features', 'Concierge Service', 'Global Coverage', 'Family Plans'],
      coverage: 95,
      deductible: 250,
      monthlyPremium: 299,
      rating: 4.9,
      provider: 'GlobalHealth',
    },
    {
      id: '4',
      name: 'Student Plan',
      price: 49,
      type: 'basic',
      features: ['Emergency Only', 'Campus Health', 'Basic Pharmacy'],
      coverage: 70,
      deductible: 2000,
      monthlyPremium: 49,
      rating: 3.8,
      provider: 'StudentCare',
    },
    {
      id: '5',
      name: 'Family Shield',
      price: 399,
      type: 'premium',
      features: ['Family Coverage', 'Pediatric Care', 'Maternity Benefits', 'Dental & Vision'],
      coverage: 92,
      deductible: 400,
      monthlyPremium: 399,
      rating: 4.6,
      provider: 'FamilyFirst',
    },
  ];

  const users: DemoUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Premium Wellness',
      status: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2024-03-20',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'Basic Care Plus',
      status: 'active',
      joinDate: '2024-02-01',
      lastActivity: '2024-03-22',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      plan: 'Enterprise Complete',
      status: 'pending',
      joinDate: '2024-03-10',
      lastActivity: '2024-03-21',
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      plan: 'Student Plan',
      status: 'expired',
      joinDate: '2023-09-01',
      lastActivity: '2024-02-15',
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      plan: 'Family Shield',
      status: 'active',
      joinDate: '2024-01-20',
      lastActivity: '2024-03-23',
    },
  ];

  // Data table columns
  const planColumns: Column<HealthPlan>[] = [
    {
      id: 'name',
      header: 'Plan Name',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{String(value)}</span>
          {row.popular && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Popular
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: 'type',
      cell: (value) => {
        const typeValue = String(value);
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            typeValue === 'enterprise' ? 'bg-purple-100 text-purple-800' :
            typeValue === 'premium' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {typeValue.charAt(0).toUpperCase() + typeValue.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'price',
      header: 'Monthly Premium',
      accessor: 'monthlyPremium',
      cell: (value) => `$${Number(value)}`,
      className: 'text-right',
    },
    {
      id: 'coverage',
      header: 'Coverage %',
      accessor: 'coverage',
      cell: (value) => {
        const coverageValue = Number(value);
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-sm">{coverageValue}%</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'rating',
      header: 'Rating',
      accessor: 'rating',
      cell: (value) => {
        const ratingValue = Number(value);
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-600 ml-1">{String(ratingValue)}</span>
          </div>
        );
      },
    },
    {
      id: 'provider',
      header: 'Provider',
      accessor: 'provider',
    },
  ];

  const userColumns: Column<DemoUser>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      cell: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{String(value)}</div>
          <div className="text-sm text-gray-500">{String(row.email)}</div>
        </div>
      ),
    },
    {
      id: 'plan',
      header: 'Plan',
      accessor: 'plan',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const statusValue = String(value);
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            statusValue === 'active' ? 'bg-green-100 text-green-800' :
            statusValue === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      cell: (value) => new Date(String(value)).toLocaleDateString(),
    },
    {
      id: 'lastActivity',
      header: 'Last Activity',
      accessor: 'lastActivity',
      cell: (value) => {
        const date = new Date(String(value));
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
      },
    },
  ];

  // Gesture handling
  const addToGestureLog = useCallback((message: string) => {
    setGestureLog(prev => [...prev.slice(-4), message]);
  }, []);

  const swipeGesture = useSwipeGesture({
    threshold: 50,
    onSwipe: (direction) => {
      addToGestureLog(`Swipe ${direction} detected`);
    },
  });

  const pinchGesture = usePinchGesture({
    onPinchStart: () => addToGestureLog('Pinch gesture started'),
    onPinchEnd: (scale) => addToGestureLog(`Pinch ended at ${scale.toFixed(2)}x`),
  });

  const longPressGesture = useLongPress({
    threshold: 1000,
    onLongPress: () => addToGestureLog('Long press detected'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 Modern TypeScript UI Features
              </h1>
              <p className="mt-2 text-gray-600">
                Advanced command palette, data tables, gestures, and real-time features
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleCommandPalette}
                variant="outline"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              >
                Command Palette
              </Button>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Gesture Detection Area */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">🤚 Gesture Detection</h3>
              <div
                className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center cursor-pointer"
                {...swipeGesture.handlers}
                {...pinchGesture.handlers}
                {...longPressGesture.handlers}
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Try: Swipe, Pinch, Long Press
                  </p>
                  {pinchGesture.scale !== 1 && (
                    <p className="text-xs text-purple-600">
                      Scale: {pinchGesture.scale.toFixed(2)}x
                    </p>
                  )}
                  {longPressGesture.isLongPressing && (
                    <p className="text-xs text-red-600">Long pressing...</p>
                  )}
                </div>
              </div>
              
              {/* Gesture Log */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Gesture Log:</h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {gestureLog.map((log, index) => (
                    <p key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-2xl font-bold text-blue-600">{healthPlans.length}</div>
                <div className="text-sm text-gray-600">Health Plans</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-2xl font-bold text-purple-600">{commands.length}</div>
                <div className="text-sm text-gray-600">Commands</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-2xl font-bold text-orange-600">{gestureLog.length}</div>
                <div className="text-sm text-gray-600">Gestures</div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Plans Table */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">💊 Health Plans Management</h3>
              <p className="text-sm text-gray-600">Advanced data table with sorting, filtering, and selection</p>
            </div>
            <DataTable<HealthPlan>
              data={healthPlans}
              columns={planColumns}
              onRowClick={(plan) => setSelectedPlan(plan)}
              selectable={false}
              pageSize={5}
              initialSortBy="rating"
              initialSortDirection="desc"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">👥 User Management</h3>
                  <p className="text-sm text-gray-600">User data with selection and advanced filtering</p>
                </div>
                {selectedUsers.length > 0 && (
                  <div className="text-sm text-blue-600">
                    {selectedUsers.length} user(s) selected
                  </div>
                )}
              </div>
            </div>
            <DataTable<DemoUser>
              data={users}
              columns={userColumns}
              selectable={true}
              onSelectionChange={setSelectedUsers}
              pageSize={10}
              emptyMessage="No users found"
            />
          </div>
        </div>

        {/* Selected Plan Details */}
        {selectedPlan && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">📋 Plan Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlan(null)}
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedPlan.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Premium:</span>
                    <span className="font-medium">${selectedPlan.monthlyPremium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-medium">{selectedPlan.coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductible:</span>
                    <span className="font-medium">${selectedPlan.deductible}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedPlan.provider}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                <ul className="space-y-1 text-sm">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
        placeholder="Search commands... (try 'home', 'services', 'contact')"
      />
    </div>
  );
};

export default ModernFeaturesShowcase;
