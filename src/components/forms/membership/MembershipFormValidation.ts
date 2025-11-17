import type { MembershipFormData, ValidationErrors } from '@/types/membership';

export const validateStep = (formData: MembershipFormData, step: number): ValidationErrors => {
  const errors: ValidationErrors = {};

  switch (step) {
    case 1: // Personal Information
      if (!formData.nameEnglish.trim()) {
        errors.nameEnglish = 'Name in English is required';
      } else if (formData.nameEnglish.length < 3) {
        errors.nameEnglish = 'Name must be at least 3 characters';
      }

      if (!formData.fatherName.trim()) {
        errors.fatherName = "Father's name is required";
      }

      if (!formData.motherName.trim()) {
        errors.motherName = "Mother's name is required";
      }

      if (!formData.mobile.trim()) {
        errors.mobile = 'Mobile number is required';
      } else if (!/^(\+880|880)?1[3-9]\d{8}$/.test(formData.mobile.replace(/\s/g, ''))) {
        errors.mobile = 'Invalid Bangladesh mobile number';
      }

      if (!formData.photo) {
        errors.photo = 'Photo is required';
      }

      if (!formData.dob) {
        errors.dob = 'Date of birth is required';
      } else if (formData.age < 18) {
        errors.dob = 'You must be at least 18 years old';
      }

      if (formData.ageProof.length === 0) {
        errors.ageProof = 'Please select at least one age proof document';
      }

      if (!formData.ageProofDoc) {
        errors.ageProofDoc = 'Please upload age proof document';
      }

      break;

    case 2: // Address
      if (!formData.presentAddress.trim()) {
        errors.presentAddress = 'Present address is required';
      } else if (formData.presentAddress.length < 10) {
        errors.presentAddress = 'Address must be at least 10 characters';
      }

      if (!formData.permanentAddress.trim()) {
        errors.permanentAddress = 'Permanent address is required';
      } else if (formData.permanentAddress.length < 10) {
        errors.permanentAddress = 'Address must be at least 10 characters';
      }

      break;

    case 3: // Nominees
      const filledNominees = formData.nominees.filter(n => 
        n.name.trim() || n.relation.trim() || n.share > 0 || n.age > 0
      );

      if (filledNominees.length === 0) {
        errors.nominees = 'At least one nominee is required';
      }

      // Validate each filled nominee
      filledNominees.forEach((nominee, index) => {
        if (!nominee.name.trim()) {
          errors[`nominee_${index}_name`] = 'Nominee name is required';
        }
        if (!nominee.relation.trim()) {
          errors[`nominee_${index}_relation`] = 'Relation is required';
        }
        if (nominee.share <= 0) {
          errors[`nominee_${index}_share`] = 'Share must be greater than 0';
        }
        if (nominee.age <= 0) {
          errors[`nominee_${index}_age`] = 'Age must be greater than 0';
        }
      });

      // Validate total share
      const totalShare = formData.nominees.reduce((sum, n) => sum + n.share, 0);
      if (totalShare !== 100) {
        errors.nomineeShare = 'Total share percentage must equal 100%';
      }

      if (formData.nomineeIdProof.length === 0) {
        errors.nomineeIdProof = 'Please upload nominee ID proof documents';
      }

      break;

    case 4: // Physical Measurement
      if (!formData.weight.trim()) {
        errors.weight = 'Weight is required';
      }

      if (!formData.height.trim()) {
        errors.height = 'Height is required';
      }

      if (!formData.bloodGroup) {
        errors.bloodGroup = 'Blood group is required';
      }

      break;

    case 5: // Review & Submit
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
      }

      break;
  }

  return errors;
};

// File validation helper
export const validateFile = (file: File, maxSizeMB: number, allowedTypes: string[]): string | null => {
  const maxSize = maxSizeMB * 1024 * 1024;

  if (file.size > maxSize) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
  }

  return null;
};
