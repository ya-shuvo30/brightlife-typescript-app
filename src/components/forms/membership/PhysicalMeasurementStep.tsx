import React from 'react';
import type { FormStepProps } from '@/types/membership';
import FileUpload from '../shared/FileUpload';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PhysicalMeasurementStep: React.FC<FormStepProps> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Physical Measurement</h2>

      {/* Weight, Height, Blood Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg) <span className="text-red-600">*</span>
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.weight ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., 70.5"
          />
          {errors?.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
            Height (ft) <span className="text-red-600">*</span>
          </label>
          <input
            id="height"
            name="height"
            type="text"
            value={formData.height}
            onChange={(e) => updateFormData({ height: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.height ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., 5'8&quot; or 5.8"
          />
          {errors?.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
        </div>

        <div>
          <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group <span className="text-red-600">*</span>
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) => updateFormData({ bloodGroup: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500
              ${errors?.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          {errors?.bloodGroup && <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>}
        </div>
      </div>

      {/* Chest Measurement */}
      <div>
        <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-2">Chest Measurement (inches)</label>
        <input
          id="chest"
          name="chest"
          type="text"
          value={formData.chest}
          onChange={(e) => updateFormData({ chest: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          placeholder="e.g., 38"
        />
      </div>

      {/* Surgery Details */}
      <div>
        <label htmlFor="surgeryDetails" className="block text-sm font-medium text-gray-700 mb-2">
          Surgery/Medical History Details
        </label>
        <textarea
          id="surgeryDetails"
          name="surgeryDetails"
          value={formData.surgeryDetails}
          onChange={(e) => updateFormData({ surgeryDetails: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
          placeholder="Describe any past surgeries, major illnesses, or ongoing medical conditions"
        />
      </div>

      {/* Medical Records Upload */}
      <div>
        <FileUpload
          label="Medical Records (if any)"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          maxSizeMB={5}
          value={formData.medicalRecords.length > 0 ? formData.medicalRecords : null}
          onChange={(files) => updateFormData({ medicalRecords: (Array.isArray(files) ? files : files ? [files] : []) })}
          helpText="Upload medical reports, prescriptions, or test results (Max 5MB each)"
        />
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Note:</strong> Accurate physical measurements help us provide better healthcare services. Medical records are optional but recommended for a complete profile.
        </p>
      </div>
    </div>
  );
};

export default PhysicalMeasurementStep;
