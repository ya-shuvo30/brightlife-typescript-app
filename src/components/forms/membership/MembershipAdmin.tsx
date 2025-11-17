import React, { useState } from 'react';
import { generateMembershipPDF } from '@/utils/pdfGenerator';
import type { MembershipFormData } from '@/types/membership';

/**
 * Admin panel to view and download submitted membership applications
 * This is a frontend-only demo - in production, this would fetch from backend API
 */
const MembershipAdmin: React.FC = () => {
  // Demo data - in production, this would come from backend API
  const [applications] = useState<(MembershipFormData & { proposalNo: string; submittedAt: string; status: string })[]>([
    // This is just demo data structure - real data would be fetched from backend
  ]);

  const [selectedApp, setSelectedApp] = useState<(MembershipFormData & { proposalNo: string; submittedAt: string; status: string }) | null>(null);

  const handleDownload = (app: MembershipFormData) => {
    generateMembershipPDF(app);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Membership Applications
          </h1>
          <p className="text-gray-600">
            View and manage all submitted membership applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Applications Yet</h2>
            <p className="text-gray-500 mb-6">
              Membership applications will appear here once users submit them.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left max-w-2xl mx-auto rounded">
              <p className="text-sm text-blue-900 font-semibold mb-2">💡 Backend Integration Required</p>
              <p className="text-sm text-blue-800">
                This admin panel requires backend API integration to display real submissions.
                Currently showing demo interface. Integrate with your backend API endpoint to fetch applications:
              </p>
              <code className="block mt-2 bg-blue-100 text-blue-900 p-2 rounded text-xs">
                GET /api/membership/applications
              </code>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.proposalNo} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{app.nameEnglish}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Proposal No.</p>
                        <p className="font-semibold text-gray-900">{app.proposalNo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mobile</p>
                        <p className="font-semibold text-gray-900">{app.mobile}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Membership</p>
                        <p className="font-semibold text-gray-900">{String(app.membershipType).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-semibold text-gray-900">{new Date(app.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg
                               transition-colors duration-200 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownload(app)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                               transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Proposal Information</h3>
                  <p><strong>Proposal No:</strong> {selectedApp.proposalNo}</p>
                  <p><strong>Status:</strong> {selectedApp.status}</p>
                  <p><strong>Submitted:</strong> {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <dl className="space-y-1 text-sm">
                      <div><dt className="text-gray-600">Name:</dt><dd className="font-medium">{selectedApp.nameEnglish}</dd></div>
                      <div><dt className="text-gray-600">Mobile:</dt><dd className="font-medium">{selectedApp.mobile}</dd></div>
                      <div><dt className="text-gray-600">DOB:</dt><dd className="font-medium">{selectedApp.dob}</dd></div>
                      <div><dt className="text-gray-600">Age:</dt><dd className="font-medium">{selectedApp.age}</dd></div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Membership Details</h3>
                    <dl className="space-y-1 text-sm">
                      <div><dt className="text-gray-600">Type:</dt><dd className="font-medium">{String(selectedApp.membershipType).toUpperCase()}</dd></div>
                      <div><dt className="text-gray-600">Blood Group:</dt><dd className="font-medium">{selectedApp.bloodGroup}</dd></div>
                      <div><dt className="text-gray-600">Weight:</dt><dd className="font-medium">{selectedApp.weight} kg</dd></div>
                      <div><dt className="text-gray-600">Height:</dt><dd className="font-medium">{selectedApp.height} ft</dd></div>
                    </dl>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedApp)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg
                             font-semibold transition-colors"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg
                             font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipAdmin;
