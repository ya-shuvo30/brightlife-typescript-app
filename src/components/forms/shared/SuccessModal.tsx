import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateReceiptPDF } from '@/utils/pdfGenerator';
import type { MembershipFormData } from '@/types/membership';

interface SuccessModalProps {
  proposalNumber: string;
  formData?: MembershipFormData;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ proposalNumber, formData, onClose }) => {
  const navigate = useNavigate();
  
  console.log('🎉 SuccessModal: Rendering with proposal:', proposalNumber);

  const handleGoHome = () => {
    console.log('🏠 SuccessModal: Going home');
    onClose();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadReceipt = () => {
    console.log('📄 SuccessModal: Downloading receipt');
    if (formData) {
      generateReceiptPDF(formData, proposalNumber);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          console.log('🖱️ SuccessModal: Backdrop clicked');
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fadeIn"
           onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div className="text-center pt-8 pb-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600">
            Your membership application has been successfully submitted.
          </p>
        </div>

        {/* Proposal Number */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 mx-6 rounded-lg p-6 border-2 border-red-200">
          <p className="text-sm text-gray-600 mb-1 text-center">Your Proposal Number</p>
          <p className="text-3xl font-bold text-red-600 text-center tracking-wide">
            {proposalNumber}
          </p>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Please save this number for future reference
          </p>
        </div>

        {/* Information */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">What's Next?</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>We'll review your application within 2-3 business days</li>
                  <li>You'll receive a confirmation email shortly</li>
                  <li>Our team will contact you for verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Need Help?</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>📞 Hotline: 09613-373737</p>
              <p>📧 Email: info@brightlifebd.com</p>
              <p>🕐 Hours: 9:00 AM - 6:00 PM (Sat-Thu)</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          {formData && (
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                       py-3 px-4 rounded-lg transition-all duration-200 shadow-md 
                       hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt PDF
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold 
                     py-3 px-4 rounded-lg transition-all duration-200 shadow-md 
                     hover:shadow-lg transform hover:scale-105"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold 
                     py-3 px-4 rounded-lg transition-all duration-200"
          >
            🖨️ Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
