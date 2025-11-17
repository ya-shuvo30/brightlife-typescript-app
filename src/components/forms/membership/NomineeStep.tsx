import React from 'react';
import type { FormStepProps, Nominee } from '@/types/membership';
import FileUpload from '../shared/FileUpload';

const NomineeStep: React.FC<FormStepProps> = ({ formData, updateFormData, errors }) => {
  const updateNominee = (index: number, field: keyof Nominee, value: string | number | File | null) => {
    const nominees = [...formData.nominees];
    nominees[index] = { ...nominees[index], [field]: value };
    updateFormData({ nominees });
  };

  const totalShare = formData.nominees.reduce((sum, n) => sum + (n.share || 0), 0);
  const isShareValid = totalShare === 100;

  return (
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
                    type="number"
                    value={nominee.share || ''}
                    onChange={(e) => updateNominee(index, 'share', parseInt(e.target.value) || 0)}
                    className={`w-20 px-2 py-1 border rounded
                      ${errors?.[`nominee_${index}_share`] ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                    max="100"
                  />
                  {errors?.[`nominee_${index}_share`] && (
                    <p className="text-xs text-red-600 mt-1">{errors[`nominee_${index}_share`]}</p>
                  )}
                </td>
                <td className="px-3 py-2 border">
                  <input
                    type="number"
                    value={nominee.age || ''}
                    onChange={(e) => updateNominee(index, 'age', parseInt(e.target.value) || 0)}
                    className={`w-16 px-2 py-1 border rounded
                      ${errors?.[`nominee_${index}_age`] ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                  />
                  {errors?.[`nominee_${index}_age`] && (
                    <p className="text-xs text-red-600 mt-1">{errors[`nominee_${index}_age`]}</p>
                  )}
                </td>
                <td className="px-3 py-2 border">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateNominee(index, 'photo', file);
                    }}
                    className="text-xs"
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

      {/* Info Note */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Important:</strong> At least one nominee is required. The total share percentage of all nominees must equal exactly 100%.
        </p>
      </div>
    </div>
  );
};

export default NomineeStep;
