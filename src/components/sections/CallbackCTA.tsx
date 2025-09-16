// CallbackCTA.tsx - Call-to-Action Section with callback request
import React, { useState } from 'react';

interface CallbackFormData {
  name: string;
  phone: string;
  email: string;
  preferredTime: string;
  message: string;
}

interface CallbackCTAProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  onCallbackRequest?: (data: CallbackFormData) => void;
}

const CallbackCTA: React.FC<CallbackCTAProps> = ({
  title = "Get Callback to understand more",
  subtitle = "Need Help? We're Here for You",
  description = "Our insurance experts are ready to help you find the perfect coverage for your needs. Request a callback and we'll reach out to you within 24 hours.",
  buttonText = "GET CALL",
  onCallbackRequest
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<CallbackFormData>({
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onCallbackRequest) {
        onCallbackRequest(formData);
      }
      
      setIsSubmitted(true);
      setShowForm(false);
      
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          preferredTime: '',
          message: ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting callback request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetCallClick = () => {
    if (!showForm) {
      setShowForm(true);
    }
  };

  return (
    <section className="py-8 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-pattern-dots"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-30">
              <div className="flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Thank You!</h3>
              <p className="text-sm">We've received your callback request. Our team will contact you within 24 hours.</p>
            </div>
          )}

          {/* Main Content */}
          {!isSubmitted && (
            <>
              <h2 className="text-lg font-medium mb-1 text-green-100">{subtitle}</h2>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
              <p className="text-sm md:text-base mb-4 text-green-100 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>

              {/* CTA Button */}
              {!showForm && (
                <button
                  onClick={handleGetCallClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {buttonText}
                </button>
              )}
            </>
          )}

          {/* Callback Form */}
          {showForm && !isSubmitted && (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="bg-white bg-opacity-10 p-6 rounded-xl border border-white border-opacity-20 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Request Your Callback</h3>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1 text-left">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1 text-left">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="+880-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-left">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium mb-1 text-left">
                        Preferred Call Time
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="" className="text-gray-900">Select preferred time</option>
                        <option value="morning" className="text-gray-900">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon" className="text-gray-900">Afternoon (12 PM - 5 PM)</option>
                        <option value="evening" className="text-gray-900">Evening (5 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-left">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Tell us about your insurance needs..."
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 px-4 rounded-lg border-2 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallbackCTA;