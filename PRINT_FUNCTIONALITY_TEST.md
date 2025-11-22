# Print Functionality Test Guide

## Testing the Payment Receipt Print Feature

### Test Steps:

1. **Start the application:**
   ```bash
   npm run dev
   ```
   App should be running on: http://localhost:5173/

2. **Navigate to Payment section:**
   - Scroll down to the "Payment" section on the homepage
   - Or use the navigation menu to jump to payment

3. **Submit a test payment:**
   Fill in the form with test data:
   - **Transaction ID:** TEST-2025-001
   - **Payment Method:** Bkash (or any option)
   - **Amount:** 5000
   - **Payer Name:** Test User
   - **Payer Contact:** 01712345678
   - **Screenshot:** (optional - skip or upload any image)
   - **Notes:** Test payment for verification

4. **Click "Submit Payment Proof"**
   - Mock API mode: Receipt modal should appear immediately
   - Real API mode: Requires backend running on localhost:8000

5. **Verify Receipt Modal Display:**
   Check that the modal shows:
   - ✅ Organization header with logo
   - ✅ "Payment Proof Receipt" title
   - ✅ Receipt ID (UUID)
   - ✅ Transaction ID
   - ✅ Payment method
   - ✅ Amount (formatted with ৳ symbol)
   - ✅ Payer name and contact
   - ✅ Status (Pending/Verified/Rejected)
   - ✅ Submission timestamp
   - ✅ Important notice section
   - ✅ Footer with generation date
   - ✅ Print button
   - ✅ Close button

6. **Test Print Functionality:**
   - Click the **"Print Receipt"** button
   - **New print window opens** (allow pop-ups if blocked)
   - Browser print dialog appears automatically
   - **Print Preview Verification:**
     - ✅ Receipt content is visible in new window (NOT empty)
     - ✅ Only receipt content visible (no navigation, no buttons, no modal)
     - ✅ Professional layout with organization header
     - ✅ All payment details clearly visible
     - ✅ Clean table formatting
     - ✅ Logo visible and properly sized
     - ✅ Text is readable and properly sized
     - ✅ Single page (A4 size)
   - Window closes automatically after printing/canceling

7. **Print to PDF (Recommended):**
   - In print dialog, select "Save as PDF" or "Microsoft Print to PDF"
   - Save the PDF and verify:
     - ✅ Content is not empty
     - ✅ All information is readable
     - ✅ Professional formatting
     - ✅ Single page (A4 size)

## Expected Print Output:

```
┌────────────────────────────────────────┐
│                                        │
│        [BRIGHT LIFE LOGO]              │
│    Bright Life Bangladesh Ltd.         │
│    Health Membership Platform          │
│    PAYMENT PROOF RECEIPT                │
│                                        │
├────────────────────────────────────────┤
│  Payment Information                   │
├────────────────────────────────────────┤
│  Receipt ID:     550e8400-e29b-...     │
│  Transaction ID: TEST-2025-001         │
│  Payment Method: Bkash                 │
│  Amount:         ৳ 5,000.00           │
│  Payer Name:     Test User             │
│  Contact:        01712345678           │
│  Status:         Pending Verification  │
│  Submitted:      November 23, 2025...  │
├────────────────────────────────────────┤
│  Important Notice                      │
│  • Computer-generated receipt          │
│  • Verification within 24-48 hours     │
│  • Keep for your records               │
│  • Contact support with Transaction ID │
├────────────────────────────────────────┤
│  Generated on November 23, 2025        │
│  © 2025 Bright Life Bangladesh Ltd.    │
│  Thank you for choosing Bright Life!   │
└────────────────────────────────────────┘
```

## Troubleshooting:

### Issue: Print preview is empty

**FIXED** - Now uses new window approach instead of CSS-based printing

### Issue: Pop-up blocked message

**Solution:** Allow pop-ups for localhost:5173 in browser settings

### Issue: Entire webpage prints instead of receipt

**FIXED** - New window contains only receipt content, not entire page

### Issue: Multiple blank pages

**FIXED** - New window approach eliminates CSS conflicts that caused extra pages

### Issue: Modal doesn't appear after submission

**Check:**

- Console for errors (F12 → Console tab)
- Network tab for API response
- Mock API mode is enabled if backend not running

## Current Print Strategy:

**New Window Approach** (Most Reliable):
1. Extract receipt content from DOM using ref
2. Open new browser window with specific dimensions
3. Write complete HTML with inline styles
4. Embed logo image (base64 or direct src)
5. Auto-trigger print dialog when window loads
6. Close window after print/cancel

**Advantages:**
- ✅ No CSS conflicts with main page
- ✅ No empty pages or extra blank pages
- ✅ Works across all browsers
- ✅ Print preview always shows content
- ✅ Clean, isolated print environment
- ✅ Automatic cleanup after printing

## Current Configuration:

**API Mode:** Real backend by default (`VITE_USE_MOCK_API=false`)

**To enable mock mode:**
Create/edit `.env.local`:
```env
VITE_USE_MOCK_API=true
```

**Backend Requirements (if using real API):**
- Django backend running on http://localhost:8000
- CORS configured to allow http://localhost:5173
- Payment proof endpoint: `POST /api/v1/payment/proof/`

## Print CSS Strategy:

The current implementation uses a **simple and reliable** approach:
1. Uses Tailwind's `print:hidden` utility class for modal overlay and buttons
2. `.print-content` class on the receipt content div
3. Print CSS ensures `.print-content` is visible and properly formatted
4. Removed complex selectors like `:has()` for better browser support
5. Static positioning instead of absolute for better print rendering

## Browser Compatibility:

✅ **Tested and working:**
- Chrome/Edge (recommended)
- Firefox
- Safari (macOS)

📝 **Note:** Print preview may vary slightly between browsers, but content should always be visible and properly formatted.

## Verification Checklist:

- [ ] Modal displays after form submission
- [ ] All receipt data is visible in modal
- [ ] Print button is clickable
- [ ] Print dialog opens when button clicked
- [ ] Print preview shows receipt content (NOT empty)
- [ ] Print preview hides modal overlay
- [ ] Print preview hides buttons
- [ ] Receipt fits on single A4 page
- [ ] All text is readable in print preview
- [ ] Logo and images are visible
- [ ] Borders and formatting are preserved
- [ ] Can save as PDF successfully

## Success Criteria:

✅ User can:
1. Submit payment proof form
2. See receipt modal with all details
3. Click print button
4. See complete receipt in print preview
5. Print/save receipt as PDF
6. Close modal and continue using app

## Next Steps if Print Still Fails:

1. Check browser console for errors
2. Verify `.print-content` class is on receipt div
3. Test in different browser (Chrome recommended)
4. Check if browser extensions are interfering with print
5. Try incognito/private mode
6. Clear browser cache and reload
