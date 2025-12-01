import React, { useState } from 'react';
import { CreditCard, Smartphone, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { submitPaymentProof } from '../../services/api/paymentAPI';
import type { PaymentProofSubmission } from '../../services/api/paymentAPI';
import PaymentReceiptModal from './PaymentReceiptModal';

interface PaymentProof {
  transactionId: string;
  paymentMethod: 'touch-n-go' | 'bkash' | 'bank-transfer';
  amount: string;
  payerName: string;
  payerContact: string;
  screenshot: File | null;
  notes: string;
}

interface PaymentProofErrors {
  transactionId?: string;
  paymentMethod?: string;
  amount?: string;
  payerName?: string;
  payerContact?: string;
  screenshot?: string;
}

interface ReceiptData {
  id: string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  payerName: string;
  payerContact: string;
  status: string;
  submittedAt: string;
  notes?: string;
}

const Payment: React.FC = () => {
  const [formData, setFormData] = useState<PaymentProof>({
    transactionId: '',
    paymentMethod: 'bkash',
    amount: '',
    payerName: '',
    payerContact: '',
    screenshot: null,
    notes: ''
  });

  const [errors, setErrors] = useState<PaymentProofErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  // Payment account details
  const paymentAccounts = {
    bankAccount: '112063615083',
    bankName: 'Touch \'n Go eWallet',
    bkash: '01871186297'
  };

  const paymentMethods = [
    {
      id: 'touch-n-go' as const,
      name: 'Touch \'n Go eWallet',
      icon: Smartphone,
      account: paymentAccounts.bankAccount,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bkash' as const,
      name: 'Bkash',
      icon: Smartphone,
      account: paymentAccounts.bkash,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const handleInputChange = (field: keyof PaymentProof, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof PaymentProofErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, screenshot: 'File size must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, screenshot: 'Please upload an image file' }));
        return;
      }

      setFormData(prev => ({ ...prev, screenshot: file }));
      setErrors(prev => ({ ...prev, screenshot: undefined }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PaymentProofErrors = {};

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.payerName.trim()) {
      newErrors.payerName = 'Payer name is required';
    }

    if (!formData.payerContact.trim()) {
      newErrors.payerContact = 'Contact number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.payerContact)) {
      newErrors.payerContact = 'Please enter a valid contact number';
    }

    // Screenshot is now optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare submission data
      const submissionData: PaymentProofSubmission = {
        transactionId: formData.transactionId,
        paymentMethod: formData.paymentMethod,
        amount: parseFloat(formData.amount),
        payerName: formData.payerName,
        payerContact: formData.payerContact,
        screenshot: formData.screenshot,
        notes: formData.notes
      };

      // Submit to backend API
      const response = await submitPaymentProof(submissionData);

      if (response.success) {
        // Capture receipt data from response
        if (response.data) {
          const receipt: ReceiptData = {
            id: response.data.id,
            transactionId: response.data.transactionId,
            paymentMethod: formData.paymentMethod,
            amount: parseFloat(formData.amount),
            payerName: formData.payerName,
            payerContact: formData.payerContact,
            status: response.data.status,
            submittedAt: response.data.submittedAt,
            notes: formData.notes
          };
          setReceiptData(receipt);
          setShowReceipt(true);
        }

        setSubmitSuccess(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            transactionId: '',
            paymentMethod: 'bkash',
            amount: '',
            payerName: '',
            payerContact: '',
            screenshot: null,
            notes: ''
          });
          setPreviewUrl(null);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        // Handle API errors
        if (response.errors) {
          // Map backend errors to form errors
          const formErrors: Record<string, string> = {};
          Object.keys(response.errors).forEach(key => {
            const fieldName = key === 'transaction_id' ? 'transactionId' :
                            key === 'payer_name' ? 'payerName' :
                            key === 'payer_contact' ? 'payerContact' :
                            key === 'payment_method' ? 'paymentMethod' : key;
            formErrors[fieldName] = response.errors![key][0];
          });
          setErrors(formErrors);
        } else {
          setErrors({ transactionId: response.message });
        }
      }

    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ transactionId: 'Failed to submit payment proof. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);

  return (
    <section id="payment" className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-3 sm:mb-4">
            <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Payment Information
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Complete your membership payment using any of our supported methods and submit your payment proof below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Payment Methods */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
                Payment Methods
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.paymentMethod === method.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mr-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600">Account: {method.account}</p>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          id={`paymentMethod-${method.id}`}
                          checked={formData.paymentMethod === method.id}
                          onChange={() => handleInputChange('paymentMethod', method.id)}
                          className="w-5 h-5 text-red-600"
                          title={`Select ${method.name}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Account Details */}
              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Account Details</h4>
                <div className="space-y-2 text-sm">
                  {selectedMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-semibold text-gray-900 font-mono">{selectedMethod.account}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Payment Instructions
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Transfer the membership fee to the selected account</li>
                  <li>• Take a screenshot of the successful transaction</li>
                  <li>• Fill in the form with transaction details</li>
                  <li>• Upload the payment screenshot</li>
                  <li>• Submit for verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Proof Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-red-500" />
              Submit Payment Proof
            </h3>

            {submitSuccess ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Payment Proof Submitted!</h4>
                <p className="text-gray-600">
                  Thank you! We'll verify your payment and contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction ID */}
                <div>
                  <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / Reference Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="transactionId"
                    name="transactionId"
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => handleInputChange('transactionId', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.transactionId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter transaction ID"
                  />
                  {errors.transactionId && (
                    <p className="mt-1 text-sm text-red-600">{errors.transactionId}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-gray-500">৳</span>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Payer Name */}
                <div>
                  <label htmlFor="payerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Payer Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="payerName"
                    name="payerName"
                    type="text"
                    value={formData.payerName}
                    onChange={(e) => handleInputChange('payerName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.payerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter payer name"
                    autoComplete="name"
                  />
                  {errors.payerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.payerName}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="payerContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="payerContact"
                    name="payerContact"
                    type="tel"
                    value={formData.payerContact}
                    onChange={(e) => handleInputChange('payerContact', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.payerContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact number"
                    autoComplete="tel"
                  />
                  {errors.payerContact && (
                    <p className="mt-1 text-sm text-red-600">{errors.payerContact}</p>
                  )}
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Screenshot <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="screenshot"
                      name="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="screenshot"
                      className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        errors.screenshot
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-500 bg-gray-50'
                      }`}
                      title="Upload payment screenshot (optional)"
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.screenshot ? formData.screenshot.name : 'Click to upload screenshot'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </label>
                  </div>
                  {errors.screenshot && (
                    <p className="mt-1 text-sm text-red-600">{errors.screenshot}</p>
                  )}
                  
                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="mt-3">
                      <img
                        src={previewUrl}
                        alt="Payment screenshot preview"
                        className="max-h-48 mx-auto rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Any additional information..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Payment Proof'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Important Notice</h4>
              <p className="text-sm text-gray-700">
                Your membership will be activated within 24-48 hours after payment verification. 
                Please ensure all information is accurate and the screenshot is clear and readable. 
                For urgent queries, contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal 
        show={showReceipt}
        receipt={receiptData}
        onClose={() => setShowReceipt(false)}
      />
    </section>
  );
};

export default Payment;
