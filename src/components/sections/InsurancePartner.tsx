import React from 'react';
import protectiveLogo from '../../assets/images/protective-life-logo.png';

// Hospital partners data
const hospitalPartners = [
    {
        name: 'Holy Family Hospital',
        image: '/holy-family-hospital.png',
        description: 'A leading healthcare institution providing quality medical services.'
    },
    {
        name: 'Islami Bank Hospital',
        image: '/Islamibank-hospital.png',
        description: 'Committed to delivering compassionate and comprehensive healthcare.'
    },
    {
        name: 'Labaid Hospital',
        image: '/Labaid-hospital.png',
        description: 'One of the largest healthcare networks in Bangladesh.'
    },
    {
        name: 'Square Hospital',
        image: '/square_hospital.png',
        description: 'A world-class multi-disciplinary tertiary care hospital.'
    }
];

const InsurancePartner: React.FC = () => (
    <section id="insurancepartner" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">Our Insurance Partner</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-16 leading-relaxed font-body">
                We are proud to partner with Protective Islami Life Insurance Ltd. to provide our members with the best possible coverage and security.
            </p>
            <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-xl">
                <img src={protectiveLogo} alt="Protective Islami Life Ins. Ltd. Logo" className="h-24 mx-auto mb-8"/>
                <h3 className="text-3xl font-bold text-gray-800 font-heading">Protective Islami Life Ins. Ltd.</h3>
                <p className="text-gray-600 mt-4 mb-8">
                    Protective Islami Life Insurance Limited (PILIL) is the fastest growing Life Insurance Company in Bangladesh. Being the leading group insurer, PILIL has been working towards financial inclusion; PILIL quite extensively with over 1 Million lives coming under the umbrella of PILIL.
                </p>
                <a href="https://www.protectivelife.com.bd/" target="_blank" rel="noopener noreferrer" className="btn-gold-gradient text-green-900 font-bold py-3 px-8 rounded-full inline-block">
                    Visit Their Website
                </a>
            </div>

            {/* Hospital Partners Section */}
            <div className="mt-20">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">Our Hospital Partners</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-12 leading-relaxed font-body">
                    We have partnered with leading hospitals across Bangladesh to ensure our members receive the best healthcare services.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hospitalPartners.map((hospital, index) => (
                        <div 
                            key={index} 
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 group"
                        >
                            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                <img 
                                    src={hospital.image} 
                                    alt={`${hospital.name} Logo`} 
                                    className="h-20 w-auto mx-auto object-contain"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 font-heading group-hover:text-blue-600 transition-colors duration-300">
                                {hospital.name}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {hospital.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default InsurancePartner;
