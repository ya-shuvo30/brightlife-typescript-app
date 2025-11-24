import axios from 'axios';
import type { MembershipFormData, ApiResponse, MembershipSubmissionResponse } from '@/types/membership';

// VPS Backend Server URL - HTTP (SSL to be configured later)
// Using /api instead of /api/v1 to match backend routing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://162.0.233.161/api';
// Use real backend API by default (set VITE_USE_MOCK_API=true to enable mock mode)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'; // Default to false

console.log('🔗 API Configuration:', {
  baseURL: API_BASE_URL,
  mockMode: USE_MOCK_API,
  environment: import.meta.env.MODE,
});

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false, // Set to true if using cookies/sessions
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

    // Proposal Information
    if (formData.proposalNo) {
      form.append('proposalNo', formData.proposalNo);
    }
    if (formData.foCode) {
      form.append('foCode', formData.foCode);
    }
    if (formData.foName) {
      form.append('foName', formData.foName);
    }

    // Personal Information - use exact field names from backend spec
    form.append('membershipType', formData.membershipType); // Backend will map this
    form.append('gender', formData.gender);
    
    if (formData.nameBangla) {
      form.append('nameBangla', formData.nameBangla);
    }
    form.append('nameEnglish', formData.nameEnglish);
    form.append('fatherName', formData.fatherName);
    form.append('motherName', formData.motherName);
    
    if (formData.spouseName) {
      form.append('spouseName', formData.spouseName);
    }
    
    form.append('mobile', formData.mobile);
    
    if (formData.email) {
      form.append('email', formData.email);
    }
    
    form.append('dob', formData.dob);
    form.append('age', formData.age.toString());
    
    if (formData.nationality) {
      form.append('nationality', formData.nationality);
    }
    
    // Age proof as JSON string
    if (formData.ageProof && Array.isArray(formData.ageProof)) {
      form.append('ageProof', JSON.stringify(formData.ageProof));
    }
    
    if (formData.drivingLicense) {
      form.append('drivingLicense', formData.drivingLicense);
    }
    
    if (formData.maritalStatus) {
      form.append('maritalStatus', formData.maritalStatus); // Backend will map this
    }
    
    if (formData.education) {
      form.append('education', formData.education);
    }
    
    if (formData.professionalQualifications) {
      form.append('professionalQualifications', formData.professionalQualifications);
    }
    
    if (formData.occupation) {
      form.append('occupation', formData.occupation);
    }
    
    if (formData.organizationDetails) {
      form.append('organizationDetails', formData.organizationDetails);
    }
    
    if (formData.dailyWork) {
      form.append('dailyWork', formData.dailyWork);
    }
    
    if (formData.annualIncome) {
      form.append('annualIncome', formData.annualIncome);
    }
    
    if (formData.incomeSource) {
      form.append('incomeSource', formData.incomeSource);
    }

    // Address
    if (formData.presentAddress) {
      form.append('presentAddress', formData.presentAddress);
    }
    if (formData.permanentAddress) {
      form.append('permanentAddress', formData.permanentAddress);
    }

    // Nominees - Send as FormData array format
    const validNominees = formData.nominees.filter(n => n.name && n.name.trim());
    
    validNominees.forEach((nominee, index) => {
      form.append(`nominees[${index}]name`, nominee.name);
      form.append(`nominees[${index}]relation`, nominee.relation); // Backend will normalize
      form.append(`nominees[${index}]share`, nominee.share.toString());
      form.append(`nominees[${index}]age`, nominee.age.toString());
      
      // Add nominee photo if available
      if (nominee.photo) {
        form.append(`nominees[${index}]photo`, nominee.photo);
      }
    });
    
    // Nominee ID proofs (multiple files)
    if (formData.nomineeIdProof) {
      formData.nomineeIdProof.forEach((file, index) => {
        if (file) {
          form.append(`nomineeIdProof[${index}]`, file);
        }
      });
    }

    // Physical Measurements
    if (formData.weight) {
      form.append('weight', formData.weight);
    }
    if (formData.height) {
      form.append('height', formData.height);
    }
    if (formData.bloodGroup) {
      form.append('bloodGroup', formData.bloodGroup);
    }
    if (formData.chest) {
      form.append('chest', formData.chest);
    }
    if (formData.surgeryDetails) {
      form.append('surgeryDetails', formData.surgeryDetails);
    }
    
    // Medical records (multiple files)
    if (formData.medicalRecords) {
      formData.medicalRecords.forEach((file, index) => {
        form.append(`medicalRecords[${index}]`, file);
      });
    }

    // Files
    if (formData.photo) {
      form.append('photo', formData.photo);
    }
    if (formData.ageProofDoc) {
      form.append('ageProofDoc', formData.ageProofDoc);
    }
    if (formData.licenseDoc) {
      form.append('licenseDoc', formData.licenseDoc);
    }
    
    // Terms
    form.append('acceptTerms', formData.acceptTerms ? 'true' : 'false');

    const response = await apiClient.post('/v1/membership/applications/', form);

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
    const response = await apiClient.get('/v1/membership/types');
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
