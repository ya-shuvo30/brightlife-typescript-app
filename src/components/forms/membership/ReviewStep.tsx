import React from 'react';
import type { FormStepProps } from '@/types/membership';
import { generateMembershipPDF } from '@/utils/pdfGenerator';

const ReviewStep: React.FC<FormStepProps> = ({ formData, updateFormData, errors }) => {
  const handleDownloadPDF = () => {
    generateMembershipPDF(formData);
  };

  const renderSection = (title: string, content: { label: string; value: string | number | boolean | null | undefined }[]) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.map((item, index) => (
          <div key={index}>
            <dt className="text-sm font-medium text-gray-600">{item.label}</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium">
              {item.value || <span className="text-gray-400 italic">Not provided</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">5. Review & Submit</h2>
        <button
          onClick={handleDownloadPDF}
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Form PDF
        </button>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Please review all information carefully before submitting.</strong> Once submitted, changes may require admin approval.
        </p>
      </div>

      {/* Personal Information */}
      {renderSection('Personal Information', [
        { label: 'Membership Type', value: formData.membershipType.toUpperCase() },
        { label: 'Gender', value: formData.gender },
        { label: 'Name (English)', value: formData.nameEnglish },
        { label: 'Name (Bangla)', value: formData.nameBangla },
        { label: "Father's Name", value: formData.fatherName },
        { label: "Mother's Name", value: formData.motherName },
        { label: "Spouse's Name", value: formData.spouseName },
        { label: 'Mobile', value: formData.mobile },
        { label: 'Date of Birth', value: formData.dob },
        { label: 'Age', value: formData.age },
        { label: 'Nationality', value: formData.nationality },
        { label: 'Marital Status', value: formData.maritalStatus },
        { label: 'Education', value: formData.education },
        { label: 'Professional Qualifications', value: formData.professionalQualifications },
        { label: 'Occupation', value: formData.occupation },
        { label: 'Annual Income', value: formData.annualIncome },
      ])}

      {/* Address Information */}
      {renderSection('Address Information', [
        { label: 'Present Address', value: formData.presentAddress },
        { label: 'Permanent Address', value: formData.permanentAddress },
      ])}

      {/* Nominee Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nominee Information</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Relation</th>
                <th className="px-4 py-2 text-left font-semibold">Share</th>
                <th className="px-4 py-2 text-left font-semibold">Age</th>
              </tr>
            </thead>
            <tbody>
              {formData.nominees
                .filter(n => n.name || n.relation)
                .map((nominee, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{nominee.name || '-'}</td>
                    <td className="px-4 py-2">{nominee.relation || '-'}</td>
                    <td className="px-4 py-2">{nominee.share}%</td>
                    <td className="px-4 py-2">{nominee.age || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Physical Measurement */}
      {renderSection('Physical Measurement', [
        { label: 'Weight', value: formData.weight ? `${formData.weight} kg` : undefined },
        { label: 'Height', value: formData.height },
        { label: 'Blood Group', value: formData.bloodGroup },
        { label: 'Chest', value: formData.chest ? `${formData.chest} inches` : undefined },
      ])}

      {/* Uploaded Documents */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
        <ul className="space-y-2">
          {formData.photo && (
            <li className="flex items-center text-sm">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Passport Photo: {formData.photo.name}
            </li>
          )}
          {formData.ageProofDoc && (
            <li className="flex items-center text-sm">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Age Proof: {formData.ageProofDoc.name}
            </li>
          )}
          {formData.licenseDoc && (
            <li className="flex items-center text-sm">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Driving License: {formData.licenseDoc.name}
            </li>
          )}
          {formData.nomineeIdProof.length > 0 && (
            <li className="flex items-center text-sm">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Nominee ID Proofs: {formData.nomineeIdProof.length} file(s)
            </li>
          )}
          {formData.medicalRecords.length > 0 && (
            <li className="flex items-center text-sm">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Medical Records: {formData.medicalRecords.length} file(s)
            </li>
          )}
        </ul>
      </div>

      {/* Declaration */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          I hereby declare that all the information provided in this application is true and correct to the best of my knowledge. 
          I understand that any false information may result in the rejection of my application or termination of membership. 
          I agree to abide by all terms, conditions, and rules of Bright Life Bangladesh Ltd.
        </p>
        
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => updateFormData({ acceptTerms: e.target.checked })}
            className={`mt-1 w-5 h-5 text-red-600 rounded ${errors?.acceptTerms ? 'border-red-500' : ''}`}
          />
          <span className="text-sm text-gray-700">
            I accept the <span className="font-semibold">terms and conditions</span> and confirm that all information provided is accurate. 
            <span className="text-red-600">*</span>
          </span>
        </label>
        {errors?.acceptTerms && (
          <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>
        )}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-sm text-blue-800">
          ✓ Once you submit, you'll receive a proposal number. Please save it for future reference.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
