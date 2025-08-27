import React from 'react';

const Registration: React.FC = () => {
    return (
        <section id="registration" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                 <div className="max-w-lg mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-2 font-heading tracking-tight">Become a Member</h2>
                    <p className="text-center text-gray-600 mb-8 font-body">Start your journey to a brighter future today.</p>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="font-medium text-gray-700 font-body">Full Name</label>
                            <input type="text" id="name" className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg form-input"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="font-medium text-gray-700 font-body">Email Address</label>
                            <input type="email" id="email" className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg form-input"/>
                        </div>
                        <div>
                            <label htmlFor="password"  className="font-medium text-gray-700 font-body">Password</label>
                            <input type="password" id="password" className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg form-input"/>
                        </div>
                        <button type="submit" className="w-full btn-gold-gradient text-green-900 font-bold py-3 px-6 rounded-lg text-lg">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Registration;
