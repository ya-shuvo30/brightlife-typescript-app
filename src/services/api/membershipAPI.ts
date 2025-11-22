import axios from 'axios';
import type { MembershipFormData, ApiResponse, MembershipSubmissionResponse } from '@/types/membership';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// Enable mock mode when backend is not available (set to false when backend is ready)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Default to true

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Mock API submission - simulates backend without actual server
 * Remove or set USE_MOCK_API=false when real backend is ready
 */
const mockSubmitMembershipForm = async (formData: MembershipFormData): Promise<ApiResponse<MembershipSubmissionResponse>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock proposal number
  const proposalNo = `BLBD-${Date.now()}`;

  console.log('📝 Mock API: Form submitted successfully', {
    proposalNo,
    name: formData.nameEnglish,
    type: formData.membershipType,
    mobile: formData.mobile,
  });

  return {
    success: true,
    message: 'Application submitted successfully',
    data: {
      proposalNo,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    },
  };
};

// Submit membership form
export const submitMembershipForm = async (formData: MembershipFormData): Promise<ApiResponse> => {
  if (USE_MOCK_API) {
    return mockSubmitMembershipForm(formData);
  }

  try {
    const form = new FormData();

    const nameParts = formData.nameEnglish.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'User';

    // Map frontend membership types to backend values
    const membershipTypeMap: Record<string, string> = {
      'silver': 'individual',
      'bronze': 'individual', 
      'gold': 'family',
      'executive': 'corporate'
    };
    form.append('membership_type', membershipTypeMap[formData.membershipType] || 'individual');
    form.append('first_name', firstName);
    form.append('last_name', lastName);
    form.append('date_of_birth', formData.dob);
    form.append('gender', formData.gender);
    
    // Map marital status to backend values
    const maritalStatusMap: Record<string, string> = {
      'unmarried': 'single',
      'married': 'married',
      'divorced': 'divorced',
      'others': 'widowed'
    };
    form.append('marital_status', maritalStatusMap[formData.maritalStatus] || 'single');
    form.append('mobile_number', formData.mobile);
    form.append('father_name', formData.fatherName);
    form.append('mother_name', formData.motherName);
    form.append('occupation', formData.occupation);
    form.append('terms_accepted', 'true');

    // Generate required fields
    const email = `user${formData.mobile.replace(/[^0-9]/g, '')}@brightlife.com`;
    form.append('email', email);
    
    const nidNumber = `TMP${formData.mobile.replace(/[^0-9]/g, '')}${Date.now().toString().slice(-4)}`;
    form.append('nid_number', nidNumber);
    
    form.append('emergency_contact_name', formData.fatherName);
    form.append('emergency_contact_number', formData.mobile);

    if (formData.spouseName) {
      form.append('spouse_name', formData.spouseName);
    }
    if (formData.organizationDetails) {
      form.append('organization_name', formData.organizationDetails);
    }
    if (formData.annualIncome) {
      const annualIncomeNum = parseFloat(formData.annualIncome.replace(/[^0-9.]/g, ''));
      if (!isNaN(annualIncomeNum) && annualIncomeNum > 0) {
        const monthlyIncome = (annualIncomeNum / 12).toFixed(2);
        form.append('monthly_income', monthlyIncome);
      } else {
        form.append('monthly_income', '0.00');
      }
    } else {
      form.append('monthly_income', '0.00');
    }

    // Map frontend relationship values to backend expected choices
    const relationshipMap: Record<string, string> = {
      'father': 'father',
      'mother': 'mother',
      'spouse': 'spouse',
      'husband': 'spouse',
      'wife': 'spouse',
      'son': 'child',
      'daughter': 'child',
      'child': 'child',
      'brother': 'sibling',
      'sister': 'sibling',
      'sibling': 'sibling',
      'other': 'other'
    };

    // Helper function to normalize relationship string to backend choice
    const normalizeRelationship = (relation: string): string => {
      const normalized = relation.toLowerCase().trim();
      return relationshipMap[normalized] || 'other';
    };

    // NESTED NOMINEES - Send as nested data for Django REST Framework
    // Only send nominees that have a name (filter out empty nominees)
    const validNominees = formData.nominees.filter(n => n.name && n.name.trim());
    
    validNominees.forEach((nominee, index) => {
      form.append(`nominees[${index}]name`, nominee.name);
      form.append(`nominees[${index}]relationship`, normalizeRelationship(nominee.relation));
      form.append(`nominees[${index}]mobile_number`, formData.mobile);
      form.append(`nominees[${index}]nid_number`, `NOM${Date.now()}${index}`);
      // Calculate DOB from age
      const dob = new Date(new Date().getFullYear() - (nominee.age || 18), 0, 1)
        .toISOString()
        .split('T')[0];
      form.append(`nominees[${index}]date_of_birth`, dob);
      form.append(`nominees[${index}]share_percentage`, nominee.share.toString());
      
      // Add nominee ID proof if available
      if (formData.nomineeIdProof && formData.nomineeIdProof[index]) {
        form.append(`nominees[${index}]id_proof`, formData.nomineeIdProof[index]);
      } else if (nominee.photo) {
        // Use nominee photo as ID proof if available
        form.append(`nominees[${index}]id_proof`, nominee.photo);
      }
    });

    if (formData.photo) {
      form.append('photo', formData.photo);
    }
    if (formData.ageProofDoc) {
      form.append('age_proof', formData.ageProofDoc);
    }
    if (formData.licenseDoc) {
      form.append('driving_license', formData.licenseDoc);
    }

    const response = await apiClient.post('/membership/applications/', form);

    return {
      success: true,
      message: response.data.message || 'Application submitted successfully',
      data: {
        proposalNo: response.data.data?.proposal_number || response.data.proposal_number,
        id: response.data.data?.id || response.data.id,
        status: response.data.data?.status || response.data.status || 'pending',
        submittedAt: new Date().toISOString(),
      },
    };
  } catch (error: unknown) {
    console.error('❌ API Error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Full error response:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      
      if (error.response?.data) {
        // Extract detailed error messages
        const errorMessage = error.response.data.message || 'Failed to submit application';
        const errorDetails = error.response.data.errors || error.response.data;
        
        // Log specific field errors
        console.error('Field errors:', errorDetails);
        
        return {
          success: false,
          message: errorMessage,
          errors: errorDetails,
        };
      }
    }

    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
};

// Get membership types and pricing
export const getMembershipTypes = async (): Promise<ApiResponse> => {
  if (USE_MOCK_API) {
    return {
      success: true,
      message: 'Membership types fetched successfully',
      data: [
        { type: 'silver', name: 'Silver', price: 5000, benefits: ['Basic coverage', 'Network hospitals'] },
        { type: 'gold', name: 'Gold', price: 10000, benefits: ['Enhanced coverage', 'Priority support'] },
        { type: 'platinum', name: 'Platinum', price: 20000, benefits: ['Premium coverage', '24/7 support'] },
        { type: 'diamond', name: 'Diamond', price: 50000, benefits: ['Unlimited coverage', 'Concierge service'] },
      ],
    };
  }

  // Real API call
  try {
    const response = await apiClient.get('/membership/types');
    return {
      success: true,
      message: 'Membership types fetched successfully',
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: 'Failed to fetch membership types',
    };
  }
};
