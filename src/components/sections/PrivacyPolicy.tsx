import React from 'react';
import PolicySection from './PolicySection.tsx';

const PrivacyPolicy: React.FC = () => (
    <PolicySection id="privacypolicy" title="Privacy Policy (গোপনীয়তা নীতি)">
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4 font-heading">English Version</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-lg">Information Collection</h4>
                    <p>We collect personal details, membership information, and usage data for service delivery.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Use of Data</h4>
                    <p>To provide membership benefits, verify partner discounts, and improve services.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Data Sharing</h4>
                    <p>Shared only with authorized partners for benefit verification, per Section 75 of the Bangladesh Consumer Rights Protection Act, 2009.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Data Security</h4>
                    <p>SSL encryption is used for all online transactions via SSLCommerz.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Your Rights</h4>
                    <p>You may request correction/deletion of your data and opt out of promotional communications.</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-heading">বাংলা সংস্করণ</h3>
            <div className="space-y-4 font-body">
                <p>১. তথ্য সংগ্রহ – আমরা সেবা প্রদানের জন্য ব্যক্তিগত তথ্য, সদস্যপদ সংক্রান্ত তথ্য ও ব্যবহারের ডাটা সংগ্রহ করি।</p>
                <p>২. তথ্যের ব্যবহার – সদস্যপদ সুবিধা প্রদান, পার্টনার ডিসকাউন্ট যাচাই এবং সেবা উন্নত করার জন্য ব্যবহৃত হয়।</p>
                <p>৩. তথ্য শেয়ারিং – শুধুমাত্র অনুমোদিত অংশীদারদের সাথে সুবিধা যাচাইয়ের জন্য শেয়ার করা হয় এবং ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ এর ধারা ৭৫ মেনে চলা হয়।</p>
                <p>৪. তথ্য নিরাপত্তা – SSLCommerz এর মাধ্যমে সকল অনলাইন লেনদেন SSL এনক্রিপশনের মাধ্যমে সুরক্ষিত থাকে।</p>
                <p>৫. আপনার অধিকার – আপনি আপনার তথ্য সংশোধন/মুছে ফেলার অনুরোধ করতে পারেন এবং প্রচারমূলক বার্তা বন্ধ করতে পারেন।</p>
            </div>
        </div>
    </PolicySection>
);

export default PrivacyPolicy;
