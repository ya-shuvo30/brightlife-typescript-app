import React from 'react';

// Define the types for the component's props
interface PolicySectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const PolicySection: React.FC<PolicySectionProps> = ({ id, title, children }) => (
    <section id={id} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{title}</h2>
                <div className="space-y-6 text-gray-600">{children}</div>
            </div>
        </div>
    </section>
);

export default PolicySection;
