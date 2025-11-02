import React from 'react';
import PolicySection from './PolicySection.tsx';

const TermsAndConditions: React.FC = () => (
    <PolicySection id="termsandconditions" title="Terms and Conditions (শর্তাবলী)">
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4 font-heading">English Version</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-lg">Services Provided</h4>
                    <p>Bright Life-Bangladesh Ltd. provides health coverage, member discounts, and partner benefits via Bright Cards in collaboration with hospitals, pharmacies, and diagnostic centers.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Membership Rules</h4>
                    <p>Membership is personal, non-transferable, and valid only for the subscribed period. Benefits are available only at authorized partners.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Payment & SSLCommerz Compliance</h4>
                    <p>All payments made through SSLCommerz are secured. The company complies with Payment Card Industry Data Security Standards (PCI DSS).</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Liability Limitations</h4>
                    <p>Bright Life is not liable for the quality or outcome of services provided by partners.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Legal Compliance</h4>
                    <p>All operations comply with the Bangladesh Consumer Rights Protection Act, 2009 (Sections 38 & 41 – protection from false promises and unfair contracts).</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Dispute Resolution</h4>
                    <p>Any consumer complaint will first be addressed internally. If unresolved, disputes may be referred to the Directorate of National Consumer Rights Protection (DNCRP) under the 2009 Act.</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-heading">বাংলা সংস্করণ</h3>
            <div className="space-y-4 font-body">
                <p>১. প্রদত্ত সেবা – ব্রাইট লাইফ-বাংলাদেশ লিমিটেড ব্রাইট কার্ডের মাধ্যমে হাসপাতাল, ফার্মেসি ও ডায়াগনস্টিক সেন্টারের সাথে অংশীদারিত্বে স্বাস্থ্য সুরক্ষা, ডিসকাউন্ট ও অন্যান্য সুবিধা প্রদান করে।</p>
                <p>২. সদস্যপদ নীতি – সদস্যপদ ব্যক্তিগত, হস্তান্তরযোগ্য নয় এবং নির্ধারিত মেয়াদের জন্যই কার্যকর থাকবে। সুবিধা কেবল অনুমোদিত অংশীদারদের কাছেই প্রযোজ্য।</p>
                <p>৩. পেমেন্ট ও SSLCommerz কমপ্লায়েন্স – SSLCommerz এর মাধ্যমে প্রদত্ত সব পেমেন্ট নিরাপদ এবং কোম্পানি পেমেন্ট কার্ড ইন্ডাস্ট্রি ডাটা সিকিউরিটি স্ট্যান্ডার্ড (PCI DSS) অনুসরণ করে।</p>
                <p>৪. দায়বদ্ধতার সীমাবদ্ধতা – অংশীদার প্রতিষ্ঠানের প্রদত্ত সেবার মান বা ফলাফলের জন্য ব্রাইট লাইফ দায়ী থাকবে না।</p>
                <p>৫. আইনগত অনুসরণ – কোম্পানির সব কার্যক্রম ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ এর ধারা ৩৮ ও ৪১ অনুসরণ করে।</p>
                <p>৬. বিতর্ক নিষ্পত্তি – কোনো অভিযোগ প্রথমে কোম্পানির অভ্যন্তরে সমাধানের চেষ্টা করা হবে। সমাধান না হলে ২০০৯ সালের আইন অনুযায়ী জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে অভিযোগ দাখিল করা যাবে।</p>
            </div>
        </div>
    </PolicySection>
);

export default TermsAndConditions;
