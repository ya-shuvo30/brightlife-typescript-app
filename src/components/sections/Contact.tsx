import React, { useState } from 'react';
import Icon from '../shared/Icon.tsx';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 2000);
    };

    const handlePhoneClick = () => {
        window.open('tel:01806672338', '_self');
    };

    const handleEmailClick = () => {
        window.open('mailto:brightlifebdltd@gmail.com', '_self');
    };

    const handleAddressClick = () => {
        const address = 'Bijoy Nagar, Ramna, Dhaka-1000';
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    return (
        <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 to-emerald-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">Get in Touch</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed font-body">We're here to help. Reach out with any questions or inquiries.</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                            
                            {/* Phone */}
                            <div 
                                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-emerald-50 transition-colors duration-200 cursor-pointer group"
                                onClick={handlePhoneClick}
                            >
                                <div className="bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors duration-200">
                                    <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">Phone</h4>
                                    <p className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200">01806 672338</p>
                                    <p className="text-sm text-gray-500 mt-1">Click to call</p>
                                </div>
                            </div>
                            
                            {/* Email */}
                            <div 
                                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-emerald-50 transition-colors duration-200 cursor-pointer group"
                                onClick={handleEmailClick}
                            >
                                <div className="bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors duration-200">
                                    <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">Email</h4>
                                    <p className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200 break-all">brightlifebdltd@gmail.com</p>
                                    <p className="text-sm text-gray-500 mt-1">Click to send email</p>
                                </div>
                            </div>
                            
                            {/* Address */}
                            <div 
                                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-emerald-50 transition-colors duration-200 cursor-pointer group"
                                onClick={handleAddressClick}
                            >
                                <div className="bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors duration-200">
                                    <Icon path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">Address</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Bijoy Nagar, Ramna<br />
                                        Dhaka-1000
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Click to view on map</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                        
                        {isSubmitted && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-emerald-600" />
                                    <p className="text-emerald-700 font-medium">Thank you! Your message has been sent successfully.</p>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="contact-name" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg form-input transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-300'
                                    }`}
                                    placeholder="Your full name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                        <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-4 h-4" />
                                        <span>{errors.name}</span>
                                    </p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    id="contact-email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg form-input transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-300'
                                    }`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                        <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-4 h-4" />
                                        <span>{errors.email}</span>
                                    </p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="contact-subject" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg form-input transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-300'
                                    }`}
                                    placeholder="What is this regarding?"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                        <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-4 h-4" />
                                        <span>{errors.subject}</span>
                                    </p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    id="contact-message" 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={5} 
                                    className={`w-full p-3 border rounded-lg form-input transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                                        errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-300'
                                    }`}
                                    placeholder="Please describe your inquiry in detail..."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                        <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-4 h-4" />
                                        <span>{errors.message}</span>
                                    </p>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'btn-gold-gradient text-green-900 hover:shadow-lg transform hover:scale-105'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
