import { useState, useCallback } from 'react';
import type { MembershipFormData, ValidationErrors, ApiResponse } from '@/types/membership';
import { submitMembershipForm } from '@/services/api/membershipAPI';
import { validateStep as validate } from '@/components/forms/membership/MembershipFormValidation';

// Initial form data
const initialFormData: MembershipFormData = {
  proposalNo: '',
  serialNo: '',
  foName: '',
  memberShip: '',
  foCode: '',
  membershipType: 'silver',
  gender: 'male',
  nameBangla: '',
  nameEnglish: '',
  fatherName: '',
  motherName: '',
  spouseName: '',
  mobile: '',
  photo: null,
  dob: '',
  age: 0,
  nationality: 'Bangladeshi',
  ageProof: [],
  ageProofDoc: null,
  drivingLicense: 'no',
  licenseDoc: null,
  maritalStatus: 'unmarried',
  education: '',
  professionalQualifications: '',
  occupation: 'service',
  organizationDetails: '',
  dailyWork: '',
  annualIncome: '',
  incomeSource: '',
  presentAddress: '',
  permanentAddress: '',
  nominees: [
    { name: '', relation: '', share: 0, age: 0, photo: null },
    { name: '', relation: '', share: 0, age: 0, photo: null },
    { name: '', relation: '', share: 0, age: 0, photo: null },
  ],
  nomineeIdProof: [],
  weight: '',
  height: '',
  bloodGroup: '',
  chest: '',
  surgeryDetails: '',
  medicalRecords: [],
  acceptTerms: false,
};

export const useMembershipForm = () => {
  const [formData, setFormData] = useState<MembershipFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data
  const updateFormData = useCallback((data: Partial<MembershipFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for updated fields
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  // Validate step
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const validationErrors = validate(formData, step);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Show first error in alert
      const firstError = Object.values(validationErrors)[0];
      alert(firstError);
      return false;
    }
    return true;
  }, [formData]);

  const submitForm = useCallback(async (): Promise<ApiResponse> => {
    setIsSubmitting(true);
    try {
      const response = await submitMembershipForm(formData);
      
      if (response.success) {
        setErrors({});
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Submission error:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateFormData,
    validateStep,
    submitForm,
    resetForm,
  };
};
