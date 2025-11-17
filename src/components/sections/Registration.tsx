import React from 'react';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
    const navigate = useNavigate();

    const handleBecomeMember = () => {
        navigate('/membership-form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section id="registration" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="max-w-lg mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-2 font-heading tracking-tight">Become a Member</h2>
                    <p className="text-center text-gray-600 mb-8 font-body">Start your journey to a brighter future today.</p>
                    
                    <button 
                        onClick={handleBecomeMember}
                        className="w-full btn-gold-gradient text-green-900 font-bold py-4 px-6 rounded-lg text-lg
                                 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Apply Now →
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Complete our comprehensive membership application form
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Registration;
