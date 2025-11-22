import React, { useRef } from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import logo from '../../assets/images/logo.png';

interface ReceiptData {
  id: string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  payerName: string;
  payerContact: string;
  status: string;
  submittedAt: string;
  notes?: string;
}

interface ReceiptModalProps {
  show: boolean;
  receipt: ReceiptData | null;
  onClose: () => void;
}

const PaymentReceiptModal: React.FC<ReceiptModalProps> = ({ show, receipt, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!show || !receipt) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      'touch-n-go': 'Touch \'n Go eWallet',
      'bkash': 'Bkash',
      'bank-transfer': 'Bank Transfer'
    };
    return methods[method] || method;
  };

  const formatStatus = (status: string) => {
    const statuses: Record<string, string> = {
      'pending': 'Pending Verification',
      'verified': 'Verified',
      'rejected': 'Rejected'
    };
    return statuses[status] || status;
  };

  const handlePrint = () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow pop-ups to print the receipt');
      return;
    }

    // Get the logo as base64 or use the current src
    const logoImg = receiptContent.querySelector('img') as HTMLImageElement;
    const logoSrc = logoImg ? logoImg.src : '';

    // Write the HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Receipt - ${receipt.transactionId}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              background: white;
              color: #000;
            }
            
            @page {
              margin: 1cm;
              size: A4 portrait;
            }
            
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 2rem;
              padding-bottom: 1.5rem;
              border-bottom: 2px solid #333;
            }
            
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 1rem;
              border-radius: 50%;
              display: block;
            }
            
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            
            .subtitle {
              font-size: 14px;
              color: #555;
              margin-bottom: 0.5rem;
            }
            
            .receipt-title {
              font-size: 12px;
              color: #666;
              font-weight: 600;
              margin-top: 0.5rem;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #ddd;
            }
            
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 2rem;
            }
            
            .info-table tr {
              border-bottom: 1px solid #ddd;
            }
            
            .info-table td {
              padding: 0.75rem 0.5rem;
            }
            
            .info-table td:first-child {
              font-weight: 600;
              color: #333;
              width: 35%;
            }
            
            .info-table td:last-child {
              color: #000;
            }
            
            .amount-row {
              background: #f5f5f5;
            }
            
            .amount-value {
              font-size: 20px;
              font-weight: bold;
              color: #000;
            }
            
            .status-badge {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              background: #fff3cd;
              color: #856404;
              border: 1px solid #ffc107;
            }
            
            .notice-box {
              background: #f8f9fa;
              border: 2px solid #dee2e6;
              border-radius: 4px;
              padding: 1rem;
              margin-bottom: 1.5rem;
            }
            
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            
            .notice-list {
              font-size: 12px;
              line-height: 1.6;
              color: #333;
              list-style-position: inside;
            }
            
            .notice-list li {
              margin-bottom: 0.25rem;
            }
            
            .footer {
              text-align: center;
              padding-top: 1rem;
              border-top: 2px solid #333;
              font-size: 11px;
              color: #666;
            }
            
            .footer p {
              margin: 0.25rem 0;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .receipt-container {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              ${logoSrc ? `<img src="${logoSrc}" alt="Logo" class="logo" />` : ''}
              <div class="company-name">Bright Life Bangladesh Ltd.</div>
              <div class="subtitle">Health Membership Platform</div>
              <div class="receipt-title">PAYMENT PROOF RECEIPT</div>
            </div>
            
            <div class="section-title">Payment Information</div>
            
            <table class="info-table">
              <tbody>
                <tr>
                  <td>Receipt ID:</td>
                  <td style="font-family: monospace;">${receipt.id}</td>
                </tr>
                <tr>
                  <td>Transaction ID:</td>
                  <td style="font-family: monospace; font-weight: bold;">${receipt.transactionId}</td>
                </tr>
                <tr>
                  <td>Payment Method:</td>
                  <td>${formatPaymentMethod(receipt.paymentMethod)}</td>
                </tr>
                <tr class="amount-row">
                  <td>Amount:</td>
                  <td class="amount-value">৳ ${receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Payer Name:</td>
                  <td>${receipt.payerName}</td>
                </tr>
                <tr>
                  <td>Contact:</td>
                  <td>${receipt.payerContact}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td><span class="status-badge">${formatStatus(receipt.status)}</span></td>
                </tr>
                <tr>
                  <td>Submitted:</td>
                  <td>${formatDate(receipt.submittedAt)}</td>
                </tr>
                ${receipt.notes ? `
                <tr>
                  <td>Notes:</td>
                  <td>${receipt.notes}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
            
            <div class="notice-box">
              <div class="notice-title">Important Notice</div>
              <ul class="notice-list">
                <li>This is a computer-generated receipt and does not require a signature.</li>
                <li>Your payment will be verified within 24-48 hours.</li>
                <li>Keep this receipt for your records.</li>
                <li>For queries, contact our support team with your Transaction ID.</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Generated on ${formatDate(new Date().toISOString())}</p>
              <p>© ${new Date().getFullYear()} Bright Life Bangladesh Ltd. All rights reserved.</p>
              <p style="margin-top: 0.5rem;">Thank you for choosing Bright Life Bangladesh!</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for images to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  return (
    <>
      {/* Modal Overlay - Hidden in Print */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 print:hidden">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-full print:rounded-none">
          {/* Modal Header - Hidden in Print */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Payment Receipt
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Receipt Content */}
          <div id="receipt-content" ref={receiptRef} className="p-6 print:p-8 print-content">
            {/* Organization Header */}
            <div className="text-center mb-8 border-b-2 border-gray-200 pb-6 print:border-gray-800">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={logo} 
                  alt="Bright Life Bangladesh Logo" 
                  className="h-16 w-16 rounded-full print:h-20 print:w-20"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1 print:text-3xl">
                Bright Life Bangladesh Ltd.
              </h1>
              <p className="text-sm text-gray-600 print:text-base print:text-gray-700">Health Membership Platform</p>
              <p className="text-xs text-gray-500 mt-2 print:text-sm print:text-gray-600 print:font-semibold">PAYMENT PROOF RECEIPT</p>
            </div>

            {/* Receipt Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 print:text-xl print:border-b-2 print:border-gray-300">
                Payment Information
              </h2>
              
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 w-1/3 print:text-base print:font-semibold print:text-gray-700">
                      Receipt ID:
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 font-mono print:text-base">
                      {receipt.id}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Transaction ID:
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 font-mono font-semibold print:text-base print:font-bold">
                      {receipt.transactionId}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Payment Method:
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 print:text-base">
                      {formatPaymentMethod(receipt.paymentMethod)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-green-50 print:border-gray-300 print:bg-gray-100">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Amount:
                    </td>
                    <td className="py-3 px-2 text-lg font-bold text-green-600 print:text-2xl print:text-gray-900">
                      ৳ {receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Payer Name:
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 print:text-base">
                      {receipt.payerName}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Contact:
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 print:text-base">
                      {receipt.payerContact}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Status:
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold print:text-base print:font-bold print:px-0 print:py-0 print:rounded-none ${
                        receipt.status === 'verified' 
                          ? 'bg-green-100 text-green-800 print:bg-transparent print:text-gray-900'
                          : receipt.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 print:bg-transparent print:text-gray-900'
                          : 'bg-red-100 text-red-800 print:bg-transparent print:text-gray-900'
                      }`}>
                        {formatStatus(receipt.status)}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-3 px-2 text-sm font-medium text-gray-600 print:text-base print:font-semibold print:text-gray-700">
                      Submitted:
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 print:text-base">
                      {formatDate(receipt.submittedAt)}
                    </td>
                  </tr>
                  {receipt.notes && (
                    <tr className="border-b border-gray-100 print:border-gray-300">
                      <td className="py-3 px-2 text-sm font-medium text-gray-600 align-top print:text-base print:font-semibold print:text-gray-700">
                        Notes:
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-900 print:text-base">
                        {receipt.notes}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 print:border-2 print:border-gray-300 print:rounded print:bg-transparent">
              <h3 className="text-sm font-semibold text-blue-900 mb-2 print:text-base print:text-gray-900">Important Notice</h3>
              <ul className="text-xs text-blue-800 space-y-1 print:text-sm print:text-gray-800">
                <li>• This is a computer-generated receipt and does not require a signature.</li>
                <li>• Your payment will be verified within 24-48 hours.</li>
                <li>• Keep this receipt for your records.</li>
                <li>• For queries, contact our support team with your Transaction ID.</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-gray-200 pt-4 print:border-t-2 print:border-gray-800">
              <p className="text-xs text-gray-500 print:text-sm print:text-gray-600">
                Generated on {formatDate(new Date().toISOString())}
              </p>
              <p className="text-xs text-gray-500 mt-1 print:text-sm print:text-gray-600">
                © {new Date().getFullYear()} Bright Life Bangladesh Ltd. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-2 print:text-sm print:text-gray-500">
                Thank you for choosing Bright Life Bangladesh!
              </p>
            </div>
          </div>

          {/* Action Buttons - Hidden in Print */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-all border border-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentReceiptModal;
