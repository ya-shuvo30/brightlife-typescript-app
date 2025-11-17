import React from 'react';
import type { FormStepProps, MembershipType, Gender, MaritalStatus, OccupationType } from '@/types/membership';
import FileUpload from '../shared/FileUpload';

const membershipTypes: { value: MembershipType; label: string; color: string }[] = [
  { value: 'silver', label: 'Silver', color: 'bg-gray-100 border-gray-300 hover:border-gray-500' },
  { value: 'bronze', label: 'Bronze', color: 'bg-amber-50 border-amber-300 hover:border-amber-500' },
  { value: 'gold', label: 'Gold', color: 'bg-yellow-50 border-yellow-400 hover:border-yellow-600' },
  { value: 'executive', label: 'Executive', color: 'bg-purple-50 border-purple-300 hover:border-purple-500' },
];

const ageProofOptions = ['NID (National ID)', 'SSC Certificate', 'Birth Certificate'];

const PersonalInfoStep: React.FC<FormStepProps> = ({ formData, updateFormData, errors }) => {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (dob: string) => {
    const age = calculateAge(dob);
    updateFormData({ dob, age });
  };

  const handleAgeProofToggle = (proof: string) => {
    const current = formData.ageProof || [];
    if (current.includes(proof)) {
      updateFormData({ ageProof: current.filter(p => p !== proof) });
    } else {
      updateFormData({ ageProof: [...current, proof] });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Personal Information</h2>

      {/* Membership Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Membership Type <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {membershipTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateFormData({ membershipType: type.value })}
              className={`p-4 border-2 rounded-lg text-center font-semibold transition-all
                ${formData.membershipType === type.value ? 'ring-2 ring-red-500' : ''}
                ${type.color}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {(['male', 'female'] as Gender[]).map((gender) => (
            <label key={gender} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={(e) => updateFormData({ gender: e.target.value as Gender })}
                className="w-4 h-4 text-red-600"
              />
              <span className="capitalize">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name in Bangla</label>
          <input
            type="text"
            value={formData.nameBangla}
            onChange={(e) => updateFormData({ nameBangla: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="আপনার নাম বাংলায়"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name in English <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.nameEnglish}
            onChange={(e) => updateFormData({ nameEnglish: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.nameEnglish ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your Name in English"
          />
          {errors?.nameEnglish && <p className="mt-1 text-sm text-red-600">{errors.nameEnglish}</p>}
        </div>
      </div>

      {/* Family Names */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.fatherName}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.fatherName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors?.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.motherName}
            onChange={(e) => updateFormData({ motherName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.motherName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors?.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spouse's Name</label>
          <input
            type="text"
            value={formData.spouseName}
            onChange={(e) => updateFormData({ spouseName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Mobile & Photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile/Bkash Number <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => updateFormData({ mobile: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.mobile ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="+880 1XXX-XXXXXX"
          />
          {errors?.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
        </div>
        <div>
          <FileUpload
            label="Passport Size Photo"
            accept="image/*"
            maxSizeMB={2}
            required
            value={formData.photo}
            onChange={(file) => updateFormData({ photo: file as File | null })}
            error={errors?.photo}
            helpText="Max 2MB, JPG/PNG"
          />
        </div>
      </div>

      {/* DOB & Age */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => handleDobChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.dob ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors?.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={formData.age || ''}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      {/* Nationality */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
        <input
          type="text"
          value={formData.nationality}
          onChange={(e) => updateFormData({ nationality: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Age Proof */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Proof Documents <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          {ageProofOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ageProof.includes(option)}
                onChange={() => handleAgeProofToggle(option)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors?.ageProof && <p className="mt-1 text-sm text-red-600">{errors.ageProof}</p>}
      </div>

      {/* Age Proof Upload */}
      <div>
        <FileUpload
          label="Upload Age Proof Document"
          accept=".pdf,.jpg,.jpeg,.png"
          required
          value={formData.ageProofDoc}
          onChange={(file) => updateFormData({ ageProofDoc: file as File | null })}
          error={errors?.ageProofDoc}
          helpText="PDF or Image, Max 5MB"
        />
      </div>

      {/* Driving License */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a driving license?</label>
        <div className="flex gap-4 mb-3">
          {['yes', 'no'].map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="drivingLicense"
                value={option}
                checked={formData.drivingLicense === option}
                onChange={(e) => updateFormData({ drivingLicense: e.target.value as 'yes' | 'no' })}
                className="w-4 h-4 text-red-600"
              />
              <span className="capitalize">{option}</span>
            </label>
          ))}
        </div>
        {formData.drivingLicense === 'yes' && (
          <FileUpload
            label="Upload Driving License"
            accept=".pdf,.jpg,.jpeg,.png"
            value={formData.licenseDoc}
            onChange={(file) => updateFormData({ licenseDoc: file as File | null })}
            helpText="PDF or Image, Max 2MB"
          />
        )}
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
        <div className="flex flex-wrap gap-4">
          {(['married', 'unmarried', 'divorced', 'others'] as MaritalStatus[]).map((status) => (
            <label key={status} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="maritalStatus"
                value={status}
                checked={formData.maritalStatus === status}
                onChange={(e) => updateFormData({ maritalStatus: e.target.value as MaritalStatus })}
                className="w-4 h-4 text-red-600"
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
          <input
            type="text"
            value={formData.education}
            onChange={(e) => updateFormData({ education: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Bachelor's Degree"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Qualifications</label>
          <input
            type="text"
            value={formData.professionalQualifications}
            onChange={(e) => updateFormData({ professionalQualifications: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., MBA, CA, Engineer"
          />
        </div>
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation Type</label>
        <div className="flex flex-wrap gap-4">
          {(['service', 'business', 'farmer', 'others'] as OccupationType[]).map((occupation) => (
            <label key={occupation} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="occupation"
                value={occupation}
                checked={formData.occupation === occupation}
                onChange={(e) => updateFormData({ occupation: e.target.value as OccupationType })}
                className="w-4 h-4 text-red-600"
              />
              <span className="capitalize">{occupation}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Organization Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Organization/Business Details</label>
        <textarea
          value={formData.organizationDetails}
          onChange={(e) => updateFormData({ organizationDetails: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
          placeholder="Company name, position, or business description"
        />
      </div>

      {/* Daily Work, Income */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Work Type</label>
          <input
            type="text"
            value={formData.dailyWork}
            onChange={(e) => updateFormData({ dailyWork: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
          <input
            type="text"
            value={formData.annualIncome}
            onChange={(e) => updateFormData({ annualIncome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., 5,00,000 BDT"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Income Source</label>
          <input
            type="text"
            value={formData.incomeSource}
            onChange={(e) => updateFormData({ incomeSource: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
