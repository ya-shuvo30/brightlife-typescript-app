import React from 'react';
import type { FormStepProps } from '@/types/membership';

const AddressStep: React.FC<FormStepProps> = ({ formData, updateFormData, errors }) => {
  const copyToPermament = () => {
    updateFormData({ permanentAddress: formData.presentAddress });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        2. Address Information
      </h2>

      {/* Present Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Present/Mailing Address <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.presentAddress}
          onChange={(e) => updateFormData({ presentAddress: e.target.value })}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                   focus:ring-red-500 focus:border-transparent resize-none
                   ${errors?.presentAddress ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="House/Flat No, Road, Area, City, District"
        />
        {errors?.presentAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.presentAddress}</p>
        )}
      </div>

      {/* Copy Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={copyToPermament}
          className="text-sm text-red-600 hover:text-red-700 hover:underline 
                   font-medium transition"
        >
          📋 Same as present address
        </button>
      </div>

      {/* Permanent Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permanent Address <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.permanentAddress}
          onChange={(e) => updateFormData({ permanentAddress: e.target.value })}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                   focus:ring-red-500 focus:border-transparent resize-none
                   ${errors?.permanentAddress ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Village/House, Post Office, Upazila, District"
        />
        {errors?.permanentAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.permanentAddress}</p>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Make sure your address is complete and accurate 
          for correspondence and document delivery.
        </p>
      </div>
    </div>
  );
};

export default AddressStep;
