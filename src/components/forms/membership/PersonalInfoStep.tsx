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

  const generateProposalNo = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const proposalNo = `BLBD-${timestamp}-${random}`;
    updateFormData({ proposalNo });
  };

  return (
    <div className="space-y-8">
      {/* Proposal Information Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <label htmlFor="proposalNo" className="block text-sm font-medium text-gray-700 mb-2">
              Proposal No
            </label>
            <input
              id="proposalNo"
              name="proposalNo"
              type="text"
              value={formData.proposalNo}
              onChange={(e) => updateFormData({ proposalNo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              placeholder="Click generate button"
              readOnly
            />
            <button
              type="button"
              onClick={generateProposalNo}
              className="mt-2 w-full px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Generate
            </button>
          </div>
          <div>
            <label htmlFor="foCode" className="block text-sm font-medium text-gray-700 mb-2">
              FO Code
            </label>
            <input
              id="foCode"
              name="foCode"
              type="text"
              value={formData.foCode}
              onChange={(e) => updateFormData({ foCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              placeholder="Field Officer Code"
            />
          </div>
          <div>
            <label htmlFor="foName" className="block text-sm font-medium text-gray-700 mb-2">
              FO Name
            </label>
            <input
              id="foName"
              name="foName"
              type="text"
              value={formData.foName}
              onChange={(e) => updateFormData({ foName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              placeholder="Field Officer Name"
            />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Membership Information</h2>

      {/* Membership Type */}
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-3">
          Select Membership Type <span className="text-red-600">*</span>
        </div>
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
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-600">*</span>
        </div>
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
          <label htmlFor="nameBangla" className="block text-sm font-medium text-gray-700 mb-2">Name in Bangla</label>
          <input
            id="nameBangla"
            name="nameBangla"
            type="text"
            value={formData.nameBangla}
            onChange={(e) => updateFormData({ nameBangla: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="আপনার নাম বাংলায়"
          />
        </div>
        <div>
          <label htmlFor="nameEnglish" className="block text-sm font-medium text-gray-700 mb-2">
            Name in English <span className="text-red-600">*</span>
          </label>
          <input
            id="nameEnglish"
            name="nameEnglish"
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
          <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name <span className="text-red-600">*</span>
          </label>
          <input
            id="fatherName"
            name="fatherName"
            type="text"
            value={formData.fatherName}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.fatherName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Father's Name"
          />
          {errors?.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
        </div>
        <div>
          <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name <span className="text-red-600">*</span>
          </label>
          <input
            id="motherName"
            name="motherName"
            type="text"
            value={formData.motherName}
            onChange={(e) => updateFormData({ motherName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.motherName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Mother's Name"
          />
          {errors?.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
        </div>
        <div>
          <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700 mb-2">Spouse's Name</label>
          <input
            id="spouseName"
            name="spouseName"
            type="text"
            value={formData.spouseName}
            onChange={(e) => updateFormData({ spouseName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="Spouse's Name (if married)"
          />
        </div>
      </div>

      {/* Mobile, Email & Photo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
            Mobile/Bkash Number <span className="text-red-600">*</span>
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            autoComplete="tel"
            value={formData.mobile}
            onChange={(e) => updateFormData({ mobile: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.mobile ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="+880 1XXX-XXXXXX"
          />
          {errors?.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="example@email.com"
          />
          {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-600">*</span>
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            autoComplete="bday"
            value={formData.dob}
            onChange={(e) => handleDobChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.dob ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors?.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            value={formData.age || ''}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            placeholder="Auto-calculated"
            title="Age (auto-calculated)"
          />
        </div>
      </div>

      {/* Nationality */}
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
        <input
          id="nationality"
          name="nationality"
          type="text"
          autoComplete="country-name"
          value={formData.nationality}
          onChange={(e) => updateFormData({ nationality: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          placeholder="e.g., Bangladeshi"
        />
      </div>

      {/* Age Proof */}
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Age Proof Documents <span className="text-red-600">*</span>
        </div>
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
        <div className="block text-sm font-medium text-gray-700 mb-2">Do you have a driving license?</div>
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
        <div className="block text-sm font-medium text-gray-700 mb-2">Marital Status</div>
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
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">Education</label>
          <input
            id="education"
            name="education"
            type="text"
            value={formData.education}
            onChange={(e) => updateFormData({ education: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Bachelor's Degree"
          />
        </div>
        <div>
          <label htmlFor="professionalQualifications" className="block text-sm font-medium text-gray-700 mb-2">Professional Qualifications</label>
          <input
            id="professionalQualifications"
            name="professionalQualifications"
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
        <div className="block text-sm font-medium text-gray-700 mb-2">Occupation Type</div>
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
        <label htmlFor="organizationDetails" className="block text-sm font-medium text-gray-700 mb-2">Organization/Business Details</label>
        <textarea
          id="organizationDetails"
          name="organizationDetails"
          autoComplete="organization"
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
          <label htmlFor="dailyWork" className="block text-sm font-medium text-gray-700 mb-2">Daily Work Type</label>
          <input
            id="dailyWork"
            name="dailyWork"
            type="text"
            value={formData.dailyWork}
            onChange={(e) => updateFormData({ dailyWork: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Office work, Field work"
          />
        </div>
        <div>
          <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
          <input
            id="annualIncome"
            name="annualIncome"
            type="text"
            value={formData.annualIncome}
            onChange={(e) => updateFormData({ annualIncome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., 5,00,000 BDT"
          />
        </div>
        <div>
          <label htmlFor="incomeSource" className="block text-sm font-medium text-gray-700 mb-2">Income Source</label>
          <input
            id="incomeSource"
            name="incomeSource"
            type="text"
            value={formData.incomeSource}
            onChange={(e) => updateFormData({ incomeSource: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Salary, Business, Investment"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
