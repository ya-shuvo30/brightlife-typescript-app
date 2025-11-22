import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembershipForm } from '@/hooks/useMembershipForm';
import type { MembershipSubmissionResponse, FormStepProps } from '@/types/membership';
import PersonalInfoStep from './PersonalInfoStep';
import AddressNomineeStep from './AddressNomineeStep';
import PhysicalMeasurementStep from './PhysicalMeasurementStep';
import ReviewStep from './ReviewStep';
import FormProgress from '../shared/FormProgress';
import SuccessModal from '../shared/SuccessModal';

const STEPS = [
  { id: 1, title: 'Personal Information', component: PersonalInfoStep },
  { id: 2, title: 'Address & Nominee', component: AddressNomineeStep },
  { id: 3, title: 'Physical & Review', component: (props: FormStepProps) => (
    <div className="space-y-8">
      <PhysicalMeasurementStep {...props} />
      <div className="border-t-2 border-gray-200 my-8"></div>
      <ReviewStep {...props} />
    </div>
  )},
];

const MembershipFormSteps: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [proposalNumber, setProposalNumber] = useState('');
  
  const { 
    formData, 
    errors,
    updateFormData, 
    validateStep, 
    submitForm, 
    isSubmitting,
    resetForm
  } = useMembershipForm();

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Submit button clicked');
    console.log('📝 Form data:', formData);
    console.log('✅ Terms accepted:', formData.acceptTerms);
    
    const result = await submitForm();
    console.log('📡 API Response:', result);
    
    if (result.success) {
      const submissionData = result.data as MembershipSubmissionResponse | undefined;
      const proposalNo = submissionData?.proposalNo || 'BLBD-' + Date.now();
      console.log('✨ Setting proposal number:', proposalNo);
      setProposalNumber(proposalNo);
      console.log('🎉 Showing success modal');
      setShowSuccess(true);
      
      // Navigate to payment section after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/', { replace: true });
        // Wait for navigation then scroll to payment section
        setTimeout(() => {
          const paymentSection = document.getElementById('payment');
          if (paymentSection) {
            paymentSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }, 2000);
    } else {
      console.error('❌ Submission failed:', result.message);
      alert(`Submission failed: ${result.message || 'Please try again'}`);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Membership Application Form
            </h1>
            <p className="text-gray-600">
              Bright Life Bangladesh Ltd.
            </p>
            <p className="text-sm text-gray-500">
              Bikiran, Savar, Dhaka-1000
            </p>
          </div>

          {/* Progress Indicator */}
          <FormProgress steps={STEPS} currentStep={currentStep} />

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold
                         hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                ← Previous
              </button>

              {currentStep < STEPS.length ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold
                           hover:bg-red-700 transition-all duration-200 shadow-md
                           hover:shadow-lg"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.acceptTerms}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold
                           hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" 
                                stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application ✓'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Form Tips */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>All fields marked with <span className="text-red-600">*</span> are required</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          proposalNumber={proposalNumber}
          formData={formData}
          onClose={() => {
            setShowSuccess(false);
            resetForm();
            setCurrentStep(1);
          }}
        />
      )}
      
      {/* Debug: Show success state */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded z-50">
          Success Modal: {showSuccess ? 'VISIBLE' : 'HIDDEN'}
        </div>
      )}
    </>
  );
};

export default MembershipFormSteps;
