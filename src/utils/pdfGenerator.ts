import jsPDF from 'jspdf';
import type { MembershipFormData } from '@/types/membership';

/**
 * Calculate validity date based on membership type
 */
const calculateValidityDate = (membershipType: string): string => {
  const today = new Date();
  const validityDate = new Date(today);
  
  switch (membershipType.toLowerCase()) {
    case 'silver':
    case 'executive':
      validityDate.setFullYear(today.getFullYear() + 1); // 1 year
      break;
    case 'bronze':
      validityDate.setFullYear(today.getFullYear() + 2); // 2 years
      break;
    case 'gold':
      validityDate.setFullYear(today.getFullYear() + 3); // 3 years
      break;
    default:
      validityDate.setFullYear(today.getFullYear() + 1); // Default 1 year
  }
  
  return validityDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

/**
 * Generate and download membership form as PDF
 */
export const generateMembershipPDF = (formData: MembershipFormData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = 20;

  // Company Address
  const COMPANY_ADDRESS = 'Bijoy Nagar, Ramna, Dhaka-1000';
  
  // Calculate validity date
  const applicationDate = new Date().toLocaleDateString('en-GB');
  const validityDate = calculateValidityDate(formData.membershipType);

  // Header with BrightLife branding
  pdf.setFillColor(220, 53, 69);
  pdf.rect(0, 0, pageWidth, 45, 'F');
  pdf.setTextColor(255, 255, 255);
  
  // Membership ID as prominent header
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Proposal No: ${formData.proposalNo || 'N/A'}`, pageWidth / 2, 10, { align: 'center' });
  
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MEMBERSHIP APPLICATION FORM', pageWidth / 2, 22, { align: 'center' });
  pdf.setFontSize(13);
  pdf.text('Bright Life Bangladesh Ltd.', pageWidth / 2, 31, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text(COMPANY_ADDRESS, pageWidth / 2, 38, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  yPosition = 55;

  // Proposal Information Box (NEW SECTION)
  pdf.setFillColor(255, 248, 220);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 'F');
  pdf.setDrawColor(220, 180, 50);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(139, 69, 19);
  pdf.text('PROPOSAL INFORMATION', margin + 5, yPosition + 2);
  pdf.setTextColor(0, 0, 0);
  yPosition += 8;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Proposal No:', margin + 5, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(220, 53, 69);
  pdf.text(formData.proposalNo || 'N/A', margin + 35, yPosition);
  pdf.setTextColor(0, 0, 0);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('FO Code:', pageWidth / 2 - 10, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(formData.foCode || 'N/A', pageWidth / 2 + 15, yPosition);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('FO Name:', pageWidth - margin - 55, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(formData.foName || 'N/A', pageWidth - margin - 30, yPosition);
  
  yPosition += 12;

  // Application Info Box
  pdf.setFillColor(248, 249, 250);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, 'F');
  pdf.setDrawColor(220, 53, 69);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Application Date:', margin + 5, yPosition + 3);
  pdf.setFont('helvetica', 'normal');
  pdf.text(applicationDate, margin + 50, yPosition + 3);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Membership Type:', margin + 5, yPosition + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(220, 53, 69);
  pdf.text(String(formData.membershipType).toUpperCase(), margin + 50, yPosition + 10);
  pdf.setTextColor(0, 0, 0);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Valid Until:', pageWidth - margin - 60, yPosition + 3);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 128, 0);
  pdf.text(validityDate, pageWidth - margin - 25, yPosition + 3);
  pdf.setTextColor(0, 0, 0);
  
  yPosition += 25;

  // Helper for section headers
  const addSectionHeader = (title: string) => {
    yPosition += 3;
    pdf.setFillColor(220, 53, 69);
    pdf.rect(margin, yPosition - 4, pageWidth - 2 * margin, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin + 3, yPosition + 2);
    pdf.setTextColor(0, 0, 0);
    yPosition += 8;
  };

  // Section 1: Personal Information
  addSectionHeader('1. PERSONAL INFORMATION');
  
  const personalInfo = [
    ['Name (English)', formData.nameEnglish],
    ['Name (Bangla)', formData.nameBangla || 'N/A'],
    ['Father\'s Name', formData.fatherName],
    ['Mother\'s Name', formData.motherName],
    ['Spouse Name', formData.spouseName || 'N/A'],
    ['Gender', formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)],
    ['Date of Birth', formData.dob],
    ['Age', `${formData.age} years`],
    ['Nationality', formData.nationality || 'Bangladeshi'],
    ['Mobile/Bkash', formData.mobile],
    ['Email', formData.email || 'N/A'],
    ['Marital Status', formData.maritalStatus.charAt(0).toUpperCase() + formData.maritalStatus.slice(1)],
  ];

  personalInfo.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(label + ':', margin + 3, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(value), margin + 50, yPosition);
    yPosition += 6;
  });

  yPosition += 2;

  // Section 2: Education & Occupation
  addSectionHeader('2. EDUCATION & OCCUPATION');
  
  const eduOccupation = [
    ['Education', formData.education || 'N/A'],
    ['Professional Qualifications', formData.professionalQualifications || 'N/A'],
    ['Occupation Type', formData.occupation.charAt(0).toUpperCase() + formData.occupation.slice(1)],
    ['Organization/Business', formData.organizationDetails || 'N/A'],
    ['Daily Work', formData.dailyWork || 'N/A'],
    ['Annual Income', formData.annualIncome || 'N/A'],
    ['Income Source', formData.incomeSource || 'N/A'],
  ];

  eduOccupation.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(label + ':', margin + 3, yPosition);
    pdf.setFont('helvetica', 'normal');
    const textLines = pdf.splitTextToSize(String(value), pageWidth - margin - 55);
    pdf.text(textLines, margin + 50, yPosition);
    yPosition += 6 * textLines.length;
  });

  yPosition += 2;

  // Section 3: Address Information
  addSectionHeader('3. ADDRESS INFORMATION');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Present Address:', margin + 3, yPosition);
  yPosition += 5;
  pdf.setFont('helvetica', 'normal');
  const presentLines = pdf.splitTextToSize(formData.presentAddress, pageWidth - 2 * margin - 6);
  pdf.text(presentLines, margin + 3, yPosition);
  yPosition += 6 * presentLines.length + 3;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Permanent Address:', margin + 3, yPosition);
  yPosition += 5;
  pdf.setFont('helvetica', 'normal');
  const permanentLines = pdf.splitTextToSize(formData.permanentAddress, pageWidth - 2 * margin - 6);
  pdf.text(permanentLines, margin + 3, yPosition);
  yPosition += 6 * permanentLines.length + 2;

  // Section 4: Nominee Details
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }
  
  addSectionHeader('4. NOMINEE DETAILS');
  
  const filledNominees = formData.nominees.filter(n => n.name && n.name.trim());
  
  filledNominees.forEach((nominee, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(108, 117, 125);
    pdf.text(`Nominee ${index + 1}:`, margin + 3, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${nominee.name}`, margin + 8, yPosition);
    yPosition += 5;
    pdf.text(`Relation: ${nominee.relation}     |     Share: ${nominee.share}%     |     Age: ${nominee.age || 'N/A'} years`, margin + 8, yPosition);
    yPosition += 7;
  });

  const totalShare = formData.nominees.reduce((sum, n) => sum + n.share, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(`Total Share Distribution: ${totalShare}%`, margin + 3, yPosition);
  yPosition += 5;

  // Section 5: Physical Measurements
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }
  
  addSectionHeader('5. PHYSICAL MEASUREMENTS');
  
  const physicalInfo = [
    ['Weight', `${formData.weight || 'N/A'} kg`],
    ['Height', formData.height || 'N/A'],
    ['Blood Group', formData.bloodGroup || 'N/A'],
    ['Chest Measurement', formData.chest ? `${formData.chest} inches` : 'N/A'],
  ];

  physicalInfo.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(label + ':', margin + 3, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(value), margin + 50, yPosition);
    yPosition += 6;
  });
  
  if (formData.surgeryDetails && formData.surgeryDetails.trim()) {
    yPosition += 2;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Medical/Surgery History:', margin + 3, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    const surgeryLines = pdf.splitTextToSize(formData.surgeryDetails, pageWidth - 2 * margin - 6);
    pdf.text(surgeryLines, margin + 3, yPosition);
    yPosition += 6 * surgeryLines.length;
  }
  yPosition += 3;

  // Section 6: Uploaded Documents
  addSectionHeader('6. SUBMITTED DOCUMENTS');
  
  const documents = [];
  if (formData.photo) documents.push('✓ Member Passport Photo');
  if (formData.ageProofDoc) documents.push('✓ Age Proof Document');
  if (formData.licenseDoc) documents.push('✓ Driving License');
  if (formData.nomineeIdProof.length > 0) documents.push(`✓ Nominee ID Proofs (${formData.nomineeIdProof.length} file${formData.nomineeIdProof.length > 1 ? 's' : ''})`);
  if (formData.medicalRecords.length > 0) documents.push(`✓ Medical Records (${formData.medicalRecords.length} file${formData.medicalRecords.length > 1 ? 's' : ''})`);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  documents.forEach(doc => {
    pdf.text(doc, margin + 3, yPosition);
    yPosition += 6;
  });
  yPosition += 5;

  // Declaration Section
  if (yPosition > pageHeight - 70) {
    pdf.addPage();
    yPosition = 20;
  }

  addSectionHeader('7. DECLARATION');
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const declaration = 'I hereby declare that all the information provided above is true, accurate, and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or immediate termination of my membership without any refund. I agree to abide by all terms, conditions, policies, and regulations of Bright Life Bangladesh Ltd.';
  const declLines = pdf.splitTextToSize(declaration, pageWidth - 2 * margin - 6);
  pdf.text(declLines, margin + 3, yPosition);
  yPosition += 6 * declLines.length + 5;

  pdf.setFont('helvetica', 'bold');
  pdf.text(`Terms & Conditions Accepted: ${formData.acceptTerms ? 'YES ✓' : 'NO ✗'}`, margin + 3, yPosition);
  yPosition += 15;

  // Signature Section
  pdf.setLineWidth(0.3);
  pdf.line(margin + 5, yPosition, margin + 70, yPosition);
  pdf.line(pageWidth - margin - 70, yPosition, pageWidth - margin - 5, yPosition);
  yPosition += 5;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Applicant Signature', margin + 20, yPosition);
  pdf.text('Date', pageWidth - margin - 40, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Proposal No: ${formData.proposalNo || 'N/A'} | FO Code: ${formData.foCode || 'N/A'} | FO Name: ${formData.foName || 'N/A'}`, margin + 5, yPosition);

  // Footer on all pages
  const totalPages = (pdf as unknown as { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    pdf.setFontSize(7);
    pdf.setTextColor(108, 117, 125);
    pdf.text('Bright Life Bangladesh Ltd. | ' + COMPANY_ADDRESS, pageWidth / 2, pageHeight - 7, { align: 'center' });
    pdf.text(`Generated: ${new Date().toLocaleString('en-GB')} | Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 3, { align: 'center' });
  }

  // Save PDF
  const fileName = `BrightLife_Application_${formData.nameEnglish.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  pdf.save(fileName);
};

/**
 * Generate a simple receipt-style PDF (alternative format)
 */
export const generateReceiptPDF = (formData: MembershipFormData, proposalNumber: string): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  pdf.setFillColor(220, 53, 69);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('APPLICATION RECEIPT', pageWidth / 2, 15, { align: 'center' });
  pdf.setFontSize(14);
  pdf.text('Bright Life Bangladesh Ltd.', pageWidth / 2, 23, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('Bijoy Nagar, Ramna, Dhaka-1000', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  yPosition = 50;

  // Proposal Number (highlighted)
  pdf.setFillColor(255, 243, 205);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 20, 'F');
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Proposal Number:', pageWidth / 2, yPosition + 3, { align: 'center' });
  pdf.setFontSize(20);
  pdf.setTextColor(220, 53, 69);
  pdf.text(proposalNumber, pageWidth / 2, yPosition + 12, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  yPosition = 80;

  // Application Summary
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Application Summary', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const validityDate = calculateValidityDate(formData.membershipType);
  
  const summaryData = [
    ['Applicant Name:', formData.nameEnglish],
    ['Membership Type:', String(formData.membershipType).toUpperCase()],
    ['Mobile Number:', formData.mobile],
    ['Date of Birth:', formData.dob],
    ['Application Date:', new Date().toLocaleDateString('en-GB')],
    ['Valid Until:', validityDate],
  ];

  summaryData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 80, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Next Steps
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Next Steps', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const steps = [
    '1. Your application has been received successfully.',
    '2. Our team will review your application within 3-5 business days.',
    '3. You will receive a confirmation call/email once approved.',
    '4. Keep your Proposal Number for future reference.',
  ];

  steps.forEach(step => {
    const lines = pdf.splitTextToSize(step, pageWidth - 40);
    pdf.text(lines, 20, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Contact Information
  pdf.setFillColor(245, 245, 245);
  pdf.rect(15, yPosition, pageWidth - 30, 35, 'F');
  yPosition += 8;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Contact Us', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Phone: +880 1806 672338', 20, yPosition);
  yPosition += 6;
  pdf.text('Email: info@brightlifebd.com', 20, yPosition);
  yPosition += 6;
  pdf.text('Address: Bijoy Nagar, Ramna, Dhaka-1000', 20, yPosition);

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Thank you for choosing Bright Life Bangladesh Ltd.', pageWidth / 2, footerY, { align: 'center' });
  pdf.text(`Generated on ${new Date().toLocaleString('en-GB')}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Save
  const fileName = `BrightLife_Receipt_${proposalNumber}.pdf`;
  pdf.save(fileName);
};
