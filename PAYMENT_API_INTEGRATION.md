# Payment Proof API Integration Guide

## Overview
This document provides the backend implementation requirements for the Payment Proof submission feature.

## API Endpoint

### Submit Payment Proof
**Endpoint:** `POST /api/v1/payment/proof/`  
**Content-Type:** `multipart/form-data`  
**Authentication:** Optional (can require user authentication if needed)

## Request Format

### Form Data Fields

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `transaction_id` | string | Yes | Transaction/Reference ID from payment | Max 100 chars |
| `payment_method` | string | Yes | Payment method used | Enum: `touch-n-go`, `bkash`, `bank-transfer` |
| `amount` | decimal | Yes | Payment amount | > 0 |
| `payer_name` | string | Yes | Name of person who made payment | Max 200 chars |
| `payer_contact` | string | Yes | Contact number | Valid phone format |
| `screenshot` | file | No | Payment screenshot/receipt | Image only, max 5MB |
| `notes` | string | No | Additional notes | Max 500 chars |

### Example cURL Request

```bash
curl -X POST http://localhost:8000/api/v1/payment/proof/ \
  -H "Content-Type: multipart/form-data" \
  -F "transaction_id=TXN123456789" \
  -F "payment_method=bkash" \
  -F "amount=5000.00" \
  -F "payer_name=John Doe" \
  -F "payer_contact=01712345678" \
  -F "screenshot=@/path/to/screenshot.jpg" \
  -F "notes=Payment for membership"
```

## Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Payment proof submitted successfully. We will verify your payment within 24-48 hours.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "transactionId": "TXN123456789",
    "status": "pending",
    "submittedAt": "2025-11-23T15:30:00Z"
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "transaction_id": ["This field is required."],
    "amount": ["Ensure this value is greater than 0."]
  }
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "An error occurred while processing your request."
}
```

## Django Model Example

```python
from django.db import models
from django.core.validators import MinValueValidator
import uuid

class PaymentProof(models.Model):
    """Model for storing payment proof submissions"""
    
    PAYMENT_METHOD_CHOICES = [
        ('touch-n-go', 'Touch n Go eWallet'),
        ('bkash', 'Bkash'),
        ('bank-transfer', 'Bank Transfer'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    payer_name = models.CharField(max_length=200)
    payer_contact = models.CharField(max_length=50)
    screenshot = models.ImageField(upload_to='payment_proofs/', null=True, blank=True)
    notes = models.TextField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Metadata
    submitted_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Optional: Link to membership application
    # membership_application = models.ForeignKey('MembershipApplication', on_delete=models.CASCADE, null=True)
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Payment Proof'
        verbose_name_plural = 'Payment Proofs'
    
    def __str__(self):
        return f"{self.transaction_id} - {self.payer_name} ({self.status})"
```

## Django Serializer Example

```python
from rest_framework import serializers
from .models import PaymentProof

class PaymentProofSerializer(serializers.ModelSerializer):
    """Serializer for payment proof submission"""
    
    class Meta:
        model = PaymentProof
        fields = [
            'id',
            'transaction_id',
            'payment_method',
            'amount',
            'payer_name',
            'payer_contact',
            'screenshot',
            'notes',
            'status',
            'submitted_at'
        ]
        read_only_fields = ['id', 'status', 'submitted_at']
    
    def validate_amount(self, value):
        """Ensure amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value
    
    def validate_payer_contact(self, value):
        """Validate phone number format"""
        import re
        if not re.match(r'^[0-9+\-\s()]+$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value
    
    def validate_screenshot(self, value):
        """Validate screenshot file"""
        if value:
            # Check file size (5MB limit)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("File size must be less than 5MB")
            
            # Check file type
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError("Only image files are allowed")
        
        return value
```

## Django View Example

```python
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import PaymentProof
from .serializers import PaymentProofSerializer

class PaymentProofSubmitView(APIView):
    """API view for submitting payment proof"""
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        """Handle payment proof submission"""
        serializer = PaymentProofSerializer(data=request.data)
        
        if serializer.is_valid():
            payment_proof = serializer.save()
            
            # TODO: Send notification email to admin
            # TODO: Send confirmation email to payer
            
            return Response({
                'success': True,
                'message': 'Payment proof submitted successfully. We will verify your payment within 24-48 hours.',
                'data': {
                    'id': str(payment_proof.id),
                    'transactionId': payment_proof.transaction_id,
                    'status': payment_proof.status,
                    'submittedAt': payment_proof.submitted_at.isoformat()
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class PaymentProofStatusView(APIView):
    """API view for checking payment proof status"""
    
    def get(self, request, transaction_id):
        """Get payment proof status by transaction ID"""
        try:
            payment_proof = PaymentProof.objects.get(transaction_id=transaction_id)
            serializer = PaymentProofSerializer(payment_proof)
            
            return Response({
                'success': True,
                'message': 'Payment proof found',
                'data': {
                    'id': str(payment_proof.id),
                    'transactionId': payment_proof.transaction_id,
                    'status': payment_proof.status,
                    'submittedAt': payment_proof.submitted_at.isoformat()
                }
            }, status=status.HTTP_200_OK)
        
        except PaymentProof.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Payment proof not found'
            }, status=status.HTTP_404_NOT_FOUND)
```

## URL Configuration

```python
# urls.py
from django.urls import path
from .views import PaymentProofSubmitView, PaymentProofStatusView

urlpatterns = [
    path('v1/payment/proof/', PaymentProofSubmitView.as_view(), name='payment-proof-submit'),
    path('v1/payment/proof/<str:transaction_id>/', PaymentProofStatusView.as_view(), name='payment-proof-status'),
]
```

## Django Settings Configuration

```python
# settings.py

# File upload settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload size limits
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024  # 5MB

# CORS settings (if frontend is on different domain)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://your-production-domain.com"
]

# Email settings for notifications (optional)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

## Database Migration

```bash
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate
```

## Testing the API

### Using cURL

```bash
# Submit payment proof
curl -X POST http://localhost:8000/api/v1/payment/proof/ \
  -F "transaction_id=TEST123" \
  -F "payment_method=bkash" \
  -F "amount=1000" \
  -F "payer_name=Test User" \
  -F "payer_contact=01712345678" \
  -F "screenshot=@screenshot.jpg"

# Check payment status
curl http://localhost:8000/api/v1/payment/proof/TEST123/
```

### Using Python requests

```python
import requests

# Submit payment proof
files = {'screenshot': open('screenshot.jpg', 'rb')}
data = {
    'transaction_id': 'TEST123',
    'payment_method': 'bkash',
    'amount': '1000',
    'payer_name': 'Test User',
    'payer_contact': '01712345678'
}

response = requests.post(
    'http://localhost:8000/api/v1/payment/proof/',
    data=data,
    files=files
)
print(response.json())
```

## Frontend Integration Status

✅ **Completed:**
- Payment section UI component created
- Payment method selection (Touch 'n Go, Bkash, Bank Transfer)
- Payment proof submission form
- Screenshot upload made optional
- API service layer (`paymentAPI.ts`) implemented
- **Real backend API integration by default**
- Mock API available for testing (opt-in via environment variable)
- Form validation and error handling
- Success/error feedback UI
- **Payment Receipt Modal with Print Functionality** ✅
  - Automatic display on successful submission
  - Organization header with logo
  - Receipt details in clean table format
  - Print button with optimized print layout
  - CSS `@media print` rules for professional printing
  - Responsive modal design

🔄 **Environment Configuration:**

Default configuration in `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false  # Uses real backend by default
```

**To enable mock API for testing without backend:**
```env
VITE_USE_MOCK_API=true  # Set to true to use mock API
```

### Receipt Modal Features

The frontend automatically captures and displays the receipt when payment proof is submitted:

1. **Data Capture:**
   - Receipt data is extracted from API response: `response.data.data`
   - Includes: ID, transaction ID, payment method, amount, payer details, status, timestamp

2. **Modal Display:**
   - Automatically opens after successful submission
   - Professional layout with organization branding
   - Clean table format for all payment details
   - Color-coded status badges (pending/verified/rejected)

3. **Print Functionality:** ✅ **UPDATED - NEW WINDOW APPROACH**
   - Dedicated print button in modal
   - **New window print solution** - Opens separate print dialog with only receipt
   - Optimized print layout (A4 size, 1cm margins)
   - Organization header with logo (embedded as base64)
   - Professional formatting for physical receipts
   - **Eliminates common CSS print issues:**
     - No empty pages
     - No multiple page printing
     - No CSS conflicts with main page
     - Works reliably across all browsers
   - **Print preview displays complete receipt content**
   - Automatic window cleanup after printing

4. **User Experience:**
   - Modal can be closed anytime
   - Receipt remains accessible until closed
   - Print preview shows optimized layout
   - Responsive design for all devices

## Admin Panel Features (Recommended)

1. **List View:**
   - Display all payment proof submissions
   - Filter by status, payment method, date
   - Search by transaction ID, payer name

2. **Detail View:**
   - View full payment details
   - Display screenshot
   - Verify/Reject actions
   - Add rejection reason
   - Link to membership application

3. **Notifications:**
   - Email to admin on new submission
   - Email to payer on verification/rejection
   - SMS notifications (optional)

## Security Considerations

1. **File Upload Security:**
   - Validate file types (only images)
   - Limit file size (5MB)
   - Scan for malware (optional)
   - Use secure file storage

2. **Data Validation:**
   - Sanitize all inputs
   - Validate transaction ID uniqueness
   - Verify phone number format

3. **Rate Limiting:**
   - Limit submissions per IP
   - Prevent spam submissions

4. **Authentication:**
   - Consider requiring user authentication
   - Log submission IP addresses

## Next Steps

1. **Backend Team:**
   - Implement Django models, serializers, views
   - Configure file upload settings
   - Set up email notifications
   - Create admin panel interface
   - Deploy to production server

2. **Integration:**
   - Update `VITE_API_BASE_URL` to production URL
   - Set `VITE_USE_MOCK_API=false`
   - Test end-to-end flow
   - Monitor submissions

3. **Enhancements:**
   - Add payment verification workflow
   - Integrate with membership management
   - Add payment reminders
   - Generate payment receipts
