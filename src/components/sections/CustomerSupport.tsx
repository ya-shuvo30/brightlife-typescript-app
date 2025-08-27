import React from 'react';
import Icon from '../shared/Icon.tsx';

const CustomerSupport: React.FC = () => {
    const handlePhoneClick = () => {
        window.open('tel:01806672338', '_self');
    };

    const handleEmailClick = () => {
        window.open('mailto:brightlifebdltd@gmail.com', '_self');
    };

    const supportChannels = [
        {
            title: 'Email Support',
            value: 'brightlifebdltd@gmail.com',
            description: 'Response within 24 hours',
            icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
            onClick: handleEmailClick,
            color: 'emerald'
        },
        {
            title: 'Phone Support',
            value: '01806 672338',
            description: 'Available 24/7',
            icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
            onClick: handlePhoneClick,
            color: 'blue'
        }
    ];

    const features = [
        {
            title: '24/7 Availability',
            description: 'Round-the-clock support for all your needs',
            icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            title: 'Expert Team',
            description: 'Trained professionals ready to assist you',
            icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
        },
        {
            title: 'Quick Response',
            description: 'Fast resolution to your queries and concerns',
            icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'
        }
    ];

    return (
        <section id="customersupport" className="py-24 bg-gradient-to-br from-blue-50 to-emerald-50">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">
                        Customer Support
                    </h2>
                    <p className="text-lg text-emerald-600 font-semibold mb-2">গ্রাহক সহায়তা</p>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed font-body">
                        Our dedicated customer support team is available 24/7 to assist you with any queries or concerns.
                    </p>
                </div>

                {/* Emergency Hotline */}
                <div className="mb-16">
                    <div className="max-w-4xl mx-auto">
                        <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                            onClick={handlePhoneClick}
                        >
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                                    <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">Emergency Hotline</h3>
                                <p className="text-3xl md:text-4xl font-extrabold mb-2">01806 672338</p>
                                <p className="text-white text-opacity-90">Click to call immediately</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 24/7 Support Features */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">24/7 Support</h3>
                        <p className="text-lg text-gray-600">We're here for you around the clock</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                                        <Icon path={feature.icon} className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h4>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Channels */}
                <div>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">Support Channels</h3>
                        <p className="text-lg text-gray-600">Choose the best way to reach us</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {supportChannels.map((channel, index) => (
                            <div 
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 ${
                                    channel.color === 'emerald' ? 'border-emerald-500 hover:bg-emerald-50' : 'border-blue-500 hover:bg-blue-50'
                                }`}
                                onClick={channel.onClick}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        channel.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        <Icon path={channel.icon} className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-gray-800 mb-2">{channel.title}</h4>
                                        <p className={`font-semibold mb-2 ${
                                            channel.color === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                                        }`}>
                                            {channel.value}
                                        </p>
                                        <p className="text-gray-600">{channel.description}</p>
                                        <p className="text-sm text-gray-500 mt-2">Click to contact</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerSupport;
