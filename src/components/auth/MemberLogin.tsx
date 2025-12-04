import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, ArrowLeft, Calendar, Info } from 'lucide-react';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.brightlifebd.com/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

interface LoginFormData {
  proposalNo: string;  // Membership ID = Proposal No
  birthYear: string;   // Password = Birth Year (4 digits)
  rememberMe: boolean;
}

interface FormErrors {
  proposalNo?: string;
  birthYear?: string;
  general?: string;
}

interface MemberData {
  proposalNo: string;
  name: string;
  membershipType: string;
  status: string;
  validUntil: string;
}

const MemberLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    proposalNo: '',
    birthYear: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    // For birthYear, only allow numeric input (4 digits max)
    if (field === 'birthYear' && typeof value === 'string') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Proposal No (Membership ID)
    if (!formData.proposalNo.trim()) {
      newErrors.proposalNo = 'Proposal No / Membership ID is required';
    } else if (
      !formData.proposalNo.match(/^BLBD-\d+$/i) &&      // BLBD-1234567890
      !formData.proposalNo.match(/^BL-\d{6}-\d{4}$/i) && // BL-202512-0010
      !formData.proposalNo.match(/^\d+$/)                // Pure numeric
    ) {
      // Accept formats: "BLBD-123456", "BL-202512-0010", or numeric ID
      newErrors.proposalNo = 'Invalid Membership ID format (e.g., BL-202512-0001)';
    }

    // Validate Birth Year (Password)
    if (!formData.birthYear) {
      newErrors.birthYear = 'Birth Year is required';
    } else if (formData.birthYear.length !== 4) {
      newErrors.birthYear = 'Birth Year must be 4 digits (e.g., 1990)';
    } else {
      const year = parseInt(formData.birthYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.birthYear = `Birth Year must be between 1900 and ${currentYear}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Mock login verification - validates against stored member data
   */
  const mockMemberLogin = async (proposalNo: string, birthYear: string): Promise<{ success: boolean; data?: MemberData; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo member data - In production, this comes from backend
    const demoMembers: Record<string, { birthYear: string; data: MemberData }> = {
      'BLBD-1234567890': {
        birthYear: '1990',
        data: {
          proposalNo: 'BLBD-1234567890',
          name: 'Demo Member',
          membershipType: 'Gold',
          status: 'Active',
          validUntil: '31/12/2028'
        }
      }
    };

    const member = demoMembers[proposalNo.toUpperCase()];
    
    if (member && member.birthYear === birthYear) {
      return { success: true, data: member.data };
    }
    
    return { 
      success: false, 
      message: 'Invalid Membership ID or Birth Year. Please check your credentials.' 
    };
  };

  /**
   * Real API login - connects to Django backend
   */
  const apiMemberLogin = async (proposalNo: string, birthYear: string): Promise<{ success: boolean; data?: MemberData; message?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/v1/membership/login/`, {
        proposalNo: proposalNo,
        birthYear: parseInt(birthYear)
      });

      if (response.data.success) {
        const member = response.data.data.member;
        return {
          success: true,
          data: {
            proposalNo: member.proposal_no || member.proposal_number || '',
            name: member.name_english || member.name || 'Member',
            membershipType: member.membership_type || 'Standard',
            status: member.status || 'pending',
            validUntil: member.valid_until || 'N/A'
          }
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.message || 'Invalid credentials' 
        };
      }
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Use mock or real API based on configuration
      const result = USE_MOCK_API 
        ? await mockMemberLogin(formData.proposalNo, formData.birthYear)
        : await apiMemberLogin(formData.proposalNo, formData.birthYear);

      if (result.success && result.data) {
        // Store member session
        const sessionData = {
          proposalNo: result.data.proposalNo,
          name: result.data.name,
          membershipType: result.data.membershipType,
          status: result.data.status,
          validUntil: result.data.validUntil,
          loggedInAt: new Date().toISOString()
        };

        if (formData.rememberMe) {
          localStorage.setItem('memberSession', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('memberSession', JSON.stringify(sessionData));
        }

        console.log('✅ Member login successful:', result.data);
        
        // Navigate to member dashboard (or home for now)
        navigate('/member-dashboard');
      } else {
        setErrors({ general: result.message || 'Invalid credentials. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img src={logo} alt="BrightLife Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
            <h2 className="text-2xl font-bold text-gray-900">Member Login</h2>
            <p className="text-gray-600 mt-2">Access your BrightLife membership portal</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Login Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Login Credentials:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li><strong>Membership ID:</strong> Your Proposal Number (e.g., BL-202512-0001)</li>
                  <li><strong>Password:</strong> Your Birth Year (4 digits, e.g., 1990)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Proposal No / Membership ID */}
            <div>
              <label htmlFor="proposalNo" className="block text-sm font-medium text-gray-700 mb-2">
                Membership ID (Proposal No)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="proposalNo"
                  type="text"
                  value={formData.proposalNo}
                  onChange={(e) => handleInputChange('proposalNo', e.target.value.toUpperCase())}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.proposalNo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., BL-202512-0001"
                />
              </div>
              {errors.proposalNo && (
                <p className="mt-1 text-sm text-red-600">{errors.proposalNo}</p>
              )}
            </div>

            {/* Birth Year (Password) */}
            <div>
              <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-2">
                Password (Birth Year)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="birthYear"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.birthYear}
                  onChange={(e) => handleInputChange('birthYear', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.birthYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1990"
                  maxLength={4}
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.birthYear && (
                <p className="mt-1 text-sm text-red-600">{errors.birthYear}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#contact" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Need Help?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">New member?</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            <a href="/membership-form" className="text-green-600 hover:text-green-700 font-medium">
              Apply for Membership →
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Bright Life Bangladesh Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MemberLogin;
