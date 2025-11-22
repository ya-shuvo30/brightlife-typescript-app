import React from 'react';
import type { FormStepProps, Nominee } from '@/types/membership';
import FileUpload from '../shared/FileUpload';

const AddressNomineeStep: React.FC<FormStepProps> = ({ formData, updateFormData, errors }) => {
  const copyToPermament = () => {
    updateFormData({ permanentAddress: formData.presentAddress });
  };

  const updateNominee = (index: number, field: keyof Nominee, value: string | number | File | null) => {
    const nominees = [...formData.nominees];
    nominees[index] = { ...nominees[index], [field]: value };
    updateFormData({ nominees });
  };

  const totalShare = formData.nominees.reduce((sum, n) => sum + (n.share || 0), 0);
  const isShareValid = totalShare === 100;

  return (
    <div className="space-y-8">
      {/* Address Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          2. Address Information
        </h2>

        {/* Present Address */}
        <div>
          <label htmlFor="presentAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Present/Mailing Address <span className="text-red-600">*</span>
          </label>
          <textarea
            id="presentAddress"
            name="presentAddress"
            autoComplete="street-address"
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
          <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Permanent Address <span className="text-red-600">*</span>
          </label>
          <textarea
            id="permanentAddress"
            name="permanentAddress"
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
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-200 my-8"></div>

      {/* Nominee Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Nominee Information</h2>

        {/* Warning Banner */}
        <div className={`p-4 rounded-lg border-2 ${isShareValid ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'}`}>
          <p className={`text-sm font-medium ${isShareValid ? 'text-green-800' : 'text-yellow-800'}`}>
            {isShareValid ? '✓' : '⚠️'} Total share must equal 100%. Current total: <span className="font-bold">{totalShare}%</span>
          </p>
        </div>

        {/* Nominees Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left text-sm font-semibold border">#</th>
                <th className="px-3 py-2 text-left text-sm font-semibold border">Name <span className="text-red-600">*</span></th>
                <th className="px-3 py-2 text-left text-sm font-semibold border">Relation <span className="text-red-600">*</span></th>
                <th className="px-3 py-2 text-left text-sm font-semibold border">Share (%) <span className="text-red-600">*</span></th>
                <th className="px-3 py-2 text-left text-sm font-semibold border">Age <span className="text-red-600">*</span></th>
                <th className="px-3 py-2 text-left text-sm font-semibold border">Photo</th>
              </tr>
            </thead>
            <tbody>
              {formData.nominees.map((nominee, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 border text-center font-semibold">{index + 1}</td>
                  <td className="px-3 py-2 border">
                    <input
                      id={`nominee_${index}_name`}
                      name={`nominee_${index}_name`}
                      type="text"
                      value={nominee.name}
                      onChange={(e) => updateNominee(index, 'name', e.target.value)}
                      className={`w-full px-2 py-1 border rounded
                        ${errors?.[`nominee_${index}_name`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Full name"
                    />
                    {errors?.[`nominee_${index}_name`] && (
                      <p className="text-xs text-red-600 mt-1">{errors[`nominee_${index}_name`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    <input
                      id={`nominee_${index}_relation`}
                      name={`nominee_${index}_relation`}
                      type="text"
                      value={nominee.relation}
                      onChange={(e) => updateNominee(index, 'relation', e.target.value)}
                      className={`w-full px-2 py-1 border rounded
                        ${errors?.[`nominee_${index}_relation`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Son, Wife"
                    />
                    {errors?.[`nominee_${index}_relation`] && (
                      <p className="text-xs text-red-600 mt-1">{errors[`nominee_${index}_relation`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    <input
                      id={`nominee_${index}_share`}
                      name={`nominee_${index}_share`}
                      type="number"
                      value={nominee.share || ''}
                      onChange={(e) => updateNominee(index, 'share', parseInt(e.target.value) || 0)}
                      className={`w-20 px-2 py-1 border rounded
                        ${errors?.[`nominee_${index}_share`] ? 'border-red-500' : 'border-gray-300'}`}
                      min="0"
                      max="100"
                      placeholder="%"
                      title={`Share percentage for nominee ${index + 1}`}
                    />
                    {errors?.[`nominee_${index}_share`] && (
                      <p className="text-xs text-red-600 mt-1">{errors[`nominee_${index}_share`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    <input
                      id={`nominee_${index}_age`}
                      name={`nominee_${index}_age`}
                      type="number"
                      value={nominee.age || ''}
                      onChange={(e) => updateNominee(index, 'age', parseInt(e.target.value) || 0)}
                      className={`w-16 px-2 py-1 border rounded
                        ${errors?.[`nominee_${index}_age`] ? 'border-red-500' : 'border-gray-300'}`}
                      min="0"
                      placeholder="Age"
                      title={`Age of nominee ${index + 1}`}
                    />
                    {errors?.[`nominee_${index}_age`] && (
                      <p className="text-xs text-red-600 mt-1">{errors[`nominee_${index}_age`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    <input
                      id={`nominee_${index}_photo`}
                      name={`nominee_${index}_photo`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateNominee(index, 'photo', file);
                      }}
                      className="text-xs"
                      title={`Photo for nominee ${index + 1}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Share Error */}
        {errors?.nomineeShare && (
          <p className="text-sm text-red-600">{errors.nomineeShare}</p>
        )}

        {/* Nominee ID Proofs */}
        <div className="mt-6">
          <FileUpload
            label="Nominee ID Proof (NID/Birth Certificate)"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            required
            value={formData.nomineeIdProof.length > 0 ? formData.nomineeIdProof : null}
            onChange={(files) => updateFormData({ nomineeIdProof: (Array.isArray(files) ? files : files ? [files] : []) })}
            error={errors?.nomineeIdProof}
            helpText="Upload ID proofs for all nominees (multiple files allowed)"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressNomineeStep;
