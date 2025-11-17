// Membership Types
export type MembershipType = 'silver' | 'bronze' | 'gold' | 'executive';
export type Gender = 'male' | 'female';
export type MaritalStatus = 'married' | 'unmarried' | 'divorced' | 'others';
export type OccupationType = 'service' | 'business' | 'farmer' | 'others';
export type DrivingLicense = 'yes' | 'no';

// Nominee Interface
export interface Nominee {
  name: string;
  relation: string;
  share: number;
  age: number;
  photo: File | null;
}

// Main Form Data Interface
export interface MembershipFormData {
  // Proposal Information
  proposalNo: string;
  serialNo: string;
  foName: string;
  memberShip: string;
  foCode: string;
  membershipType: MembershipType;

  // Personal Information
  gender: Gender;
  nameBangla: string;
  nameEnglish: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  mobile: string;
  photo: File | null;
  
  // Additional Personal Info
  dob: string;
  age: number;
  nationality: string;
  ageProof: string[];
  ageProofDoc: File | null;
  drivingLicense: DrivingLicense;
  licenseDoc: File | null;
  maritalStatus: MaritalStatus;
  education: string;
  professionalQualifications: string;
  occupation: OccupationType;
  organizationDetails: string;
  dailyWork: string;
  annualIncome: string;
  incomeSource: string;

  // Address
  presentAddress: string;
  permanentAddress: string;

  // Nominees (Array of 3)
  nominees: Nominee[];
  nomineeIdProof: File[];

  // Physical Measurement
  weight: string;
  height: string;
  bloodGroup: string;
  chest: string;
  surgeryDetails: string;
  medicalRecords: File[];

  // Terms
  acceptTerms: boolean;
}

// Validation Errors
export interface ValidationErrors {
  [key: string]: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationErrors;
}

// Form Step Props
export interface FormStepProps {
  formData: MembershipFormData;
  updateFormData: (data: Partial<MembershipFormData>) => void;
  errors?: ValidationErrors;
}

// Step Configuration
export interface FormStep {
  id: number;
  title: string;
  component: React.ComponentType<FormStepProps>;
}
