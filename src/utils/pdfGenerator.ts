import jsPDF from 'jspdf';
import type { MembershipFormData } from '@/types/membership';

/**
 * Generate and download membership form as PDF
 */
export const generateMembershipPDF = (formData: MembershipFormData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = 20;
  const lineHeight = 7;

  // Helper function to add text with word wrap
  const addText = (text: string, isBold = false, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    pdf.text(lines, margin, yPosition);
    yPosition += lineHeight * lines.length;
  };

  // Header
  pdf.setFillColor(220, 53, 69); // Red color
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MEMBERSHIP APPLICATION FORM', pageWidth / 2, 12, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text('Bright Life Bangladesh Ltd.', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('Bikiran, Savar, Dhaka-1000', pageWidth / 2, 26, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  yPosition = 40;

  // Application Details
  addText(`Application Date: ${new Date().toLocaleDateString()}`, false, 10);
  addText(`Membership Type: ${String(formData.membershipType).toUpperCase()}`, true, 12);
  yPosition += 3;

  // Section 1: Personal Information
  addText('PERSONAL INFORMATION', true, 14);
  yPosition += 2;
  
  addText(`Name (Bangla): ${formData.nameBangla}`);
  addText(`Name (English): ${formData.nameEnglish}`);
  addText(`Father's Name: ${formData.fatherName}`);
  addText(`Mother's Name: ${formData.motherName}`);
  addText(`Spouse Name: ${formData.spouseName || 'N/A'}`);
  addText(`Gender: ${formData.gender}`);
  addText(`Date of Birth: ${formData.dob}`);
  addText(`Age: ${formData.age} years`);
  addText(`Nationality: ${formData.nationality}`);
  addText(`Mobile Number: ${formData.mobile}`);
  addText(`Marital Status: ${formData.maritalStatus}`);
  yPosition += 3;

  // Age Proof
  addText(`Age Proof: ${formData.ageProof.join(', ') || 'N/A'}`);
  addText(`Driving License: ${formData.drivingLicense === 'yes' ? 'Yes' : 'No'}`);
  yPosition += 3;

  // Education & Occupation
  addText('EDUCATION & OCCUPATION', true, 14);
  yPosition += 2;
  
  addText(`Educational Qualification: ${formData.education || 'N/A'}`);
  addText(`Professional Qualifications: ${formData.professionalQualifications || 'N/A'}`);
  addText(`Occupation: ${formData.occupation}`);
  addText(`Organization Details: ${formData.organizationDetails || 'N/A'}`);
  addText(`Daily Work: ${formData.dailyWork || 'N/A'}`);
  addText(`Annual Income: ${formData.annualIncome || 'N/A'}`);
  addText(`Source of Income: ${formData.incomeSource || 'N/A'}`);
  yPosition += 3;

  // Section 2: Address Information
  addText('ADDRESS INFORMATION', true, 14);
  yPosition += 2;
  
  addText('Present Address:', true);
  addText(formData.presentAddress);
  yPosition += 2;
  
  addText('Permanent Address:', true);
  addText(formData.permanentAddress);
  yPosition += 3;

  // Section 3: Nominee Details
  addText('NOMINEE DETAILS', true, 14);
  yPosition += 2;
  
  const filledNominees = formData.nominees.filter(n => n.name.trim());
  
  filledNominees.forEach((nominee, index) => {
    addText(`Nominee ${index + 1}:`, true);
    addText(`  Name: ${nominee.name}`);
    addText(`  Relation: ${nominee.relation}`);
    addText(`  Share: ${nominee.share}%`);
    addText(`  Age: ${nominee.age} years`);
    yPosition += 2;
  });

  const totalShare = formData.nominees.reduce((sum, n) => sum + n.share, 0);
  addText(`Total Share: ${totalShare}%`, true);
  yPosition += 3;

  // Section 4: Physical Measurements
  addText('PHYSICAL MEASUREMENTS', true, 14);
  yPosition += 2;
  
  addText(`Weight: ${formData.weight} kg`);
  addText(`Height: ${formData.height} ft`);
  addText(`Blood Group: ${formData.bloodGroup}`);
  addText(`Chest Measurement: ${formData.chest || 'N/A'}`);
  
  if (formData.surgeryDetails) {
    yPosition += 2;
    addText('Surgery/Medical History:', true);
    addText(formData.surgeryDetails);
  }
  yPosition += 3;

  // Uploaded Documents
  addText('UPLOADED DOCUMENTS', true, 14);
  yPosition += 2;
  
  const documents = [];
  if (formData.photo) documents.push('Member Photo');
  if (formData.ageProofDoc) documents.push('Age Proof Document');
  if (formData.licenseDoc) documents.push('Driving License Document');
  if (formData.nomineeIdProof.length > 0) documents.push(`Nominee ID Proofs (${formData.nomineeIdProof.length} files)`);
  if (formData.medicalRecords.length > 0) documents.push(`Medical Records (${formData.medicalRecords.length} files)`);
  
  documents.forEach(doc => {
    addText(`✓ ${doc}`);
  });
  yPosition += 5;

  // Declaration
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  addText('DECLARATION', true, 14);
  yPosition += 2;
  
  const declaration = 'I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may result in the cancellation of my membership.';
  addText(declaration);
  yPosition += 5;

  addText(`Terms Accepted: ${formData.acceptTerms ? 'YES' : 'NO'}`, true);
  yPosition += 10;

  // Signature line
  pdf.line(margin, yPosition, margin + 60, yPosition);
  yPosition += 5;
  addText('Applicant Signature', false, 9);

  // Footer on last page
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('This is a computer-generated document.', pageWidth / 2, pageHeight - 10, { align: 'center' });
  pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 6, { align: 'center' });

  // Save PDF
  const fileName = `BrightLife_Membership_${formData.nameEnglish.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
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
  pdf.text('Bikiran, Savar, Dhaka-1000', pageWidth / 2, 30, { align: 'center' });
  
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
  
  const summaryData = [
    ['Applicant Name:', formData.nameEnglish],
    ['Membership Type:', String(formData.membershipType).toUpperCase()],
    ['Mobile Number:', formData.mobile],
    ['Date of Birth:', formData.dob],
    ['Application Date:', new Date().toLocaleDateString()],
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
  pdf.text('Phone: +880 1XXX-XXXXXX', 20, yPosition);
  yPosition += 6;
  pdf.text('Email: info@brightlifebangladesh.com', 20, yPosition);
  yPosition += 6;
  pdf.text('Address: Bikiran, Savar, Dhaka-1000', 20, yPosition);

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Thank you for choosing Bright Life Bangladesh Ltd.', pageWidth / 2, footerY, { align: 'center' });
  pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Save
  const fileName = `BrightLife_Receipt_${proposalNumber}.pdf`;
  pdf.save(fileName);
};
