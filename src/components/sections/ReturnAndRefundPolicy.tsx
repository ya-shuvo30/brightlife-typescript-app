import React from 'react';
import PolicySection from './PolicySection.tsx';

const ReturnAndRefundPolicy: React.FC = () => (
    <PolicySection id="returnandrefundpolicy" title="Return & Refund Policy (ফেরত ও রিফান্ড নীতি)">
         <div>
            <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4 font-heading">English Version</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-lg">Eligibility</h4>
                    <p>Refunds are allowed within 7 days of payment if no benefits have been used.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Refund Process</h4>
                    <p>Requests must be made via email or in-person. Refunds are processed within 10–15 business days.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Legal Compliance</h4>
                    <p>In line with Section 41 of the Bangladesh Consumer Rights Protection Act, 2009, customers may seek legal remedy if refund policies are violated.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">No Refund Cases</h4>
                    <p>No refund after benefit usage or membership termination due to breach of terms.</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-heading">বাংলা সংস্করণ</h3>
            <div className="space-y-4 font-body">
                <p>১. যোগ্যতা – পেমেন্টের ৭ দিনের মধ্যে রিফান্ড পাওয়া যাবে যদি কোনো সুবিধা ব্যবহার না করা হয়।</p>
                <p>২. রিফান্ড প্রক্রিয়া – ইমেইল বা সরাসরি উপস্থিত হয়ে রিকোয়েস্ট করতে হবে। রিফান্ড ১০–১৫ কর্মদিবসের মধ্যে প্রক্রিয়া করা হবে।</p>
                <p>৩. আইনগত অনুসরণ – ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ এর ধারা ৪১ অনুযায়ী রিফান্ড নীতি লঙ্ঘন হলে গ্রাহক আইনগত প্রতিকার চাইতে পারবেন।</p>
                <p>৪. রিফান্ড প্রযোজ্য নয় এমন ক্ষেত্র – সুবিধা ব্যবহার বা শর্ত ভঙ্গজনিত কারণে সদস্যপদ বাতিল হলে রিফান্ড প্রযোজ্য হবে না।</p>
            </div>
        </div>
    </PolicySection>
);

export default ReturnAndRefundPolicy;
