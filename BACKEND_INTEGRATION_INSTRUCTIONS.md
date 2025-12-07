# Backend Integration Instructions

## Django REST API Requirements for BrightLife Membership Form

This document provides complete instructions for backend developers to implement the Django REST API endpoints required for the membership form integration.

---

## 1. API Endpoint Required

### **POST /api/v1/membership/applications/**

**Purpose:** Submit membership application with all form data and file uploads

**Content-Type:** `multipart/form-data`

**Authentication:** Public endpoint (no authentication required for submission)

**Important:** Always use the versioned endpoint with `/v1/`:
- ❌ Wrong: `POST http://localhost:8000/api/membership/applications/`
- ✅ Correct: `POST http://localhost:8000/api/v1/membership/applications/`

---

## 2. Request Field Mapping

The frontend sends data with specific field names. Your Django models must accept these exact field names or implement field mapping in the serializer.

### Proposal Information Fields

| Frontend Field | Backend Field | Type | Required | Notes |
|---------------|---------------|------|----------|-------|
| `proposalNo` | `proposal_no` | String | Yes | Format: BLBD-{timestamp}-{random} |
| `foCode` | `fo_code` | String | No | Field Officer Code |
| `foName` | `fo_name` | String | No | Field Officer Name |

### Personal Information Fields

| Frontend Field | Backend Field | Type | Required | Notes |
|---------------|---------------|------|----------|-------|
| `membershipType` | `membership_type` | String | Yes | **MAPPING REQUIRED** (see below) |
| `gender` | `gender` | String | Yes | Choices: male, female |
| `nameBangla` | `name_bangla` | String | No | |
| `nameEnglish` | `name_english` | String | Yes | |
| `fatherName` | `father_name` | String | Yes | |
| `motherName` | `mother_name` | String | Yes | |
| `spouseName` | `spouse_name` | String | No | |
| `mobile` | `mobile` | String | Yes | Format: +880XXXXXXXXXX |
| `email` | `email` | Email | No | New field added |
| `photo` | `photo` | File | Yes | Image, Max 2MB |
| `dob` | `dob` | Date | Yes | Format: YYYY-MM-DD |
| `age` | `age` | Integer | Yes | Auto-calculated from DOB |
| `nationality` | `nationality` | String | No | Default: Bangladeshi |
| `ageProof` | `age_proof` | JSON Array | Yes | Selected proof types |
| `ageProofDoc` | `age_proof_doc` | File | Yes | PDF/Image, Max 5MB |
| `drivingLicense` | `driving_license` | String | No | Choices: yes, no |
| `licenseDoc` | `license_doc` | File | No | If driving_license=yes |
| `maritalStatus` | `marital_status` | String | No | **MAPPING REQUIRED** (see below) |
| `education` | `education` | String | No | |
| `professionalQualifications` | `professional_qualifications` | String | No | |
| `occupation` | `occupation` | String | No | Choices: service, business, farmer, others |
| `organizationDetails` | `organization_details` | Text | No | |
| `dailyWork` | `daily_work` | String | No | |
| `annualIncome` | `monthly_income` | Decimal | No | **CONVERT: annual ÷ 12** |
| `incomeSource` | `income_source` | String | No | |

### Address Fields

| Frontend Field | Backend Field | Type | Required | Notes |
|---------------|---------------|------|----------|-------|
| `presentAddress` | `present_address` | Text | Yes | |
| `permanentAddress` | `permanent_address` | Text | Yes | |

### Nominee Fields (Array of 3 nominees)

Sent as FormData array format: `nominees[index]field`

| Frontend Field Pattern | Backend Field | Type | Required | Notes |
|----------------------|---------------|------|----------|-------|
| `nominees[0]name` | - | String | Yes* | Name of nominee 1 |
| `nominees[0]relation` | - | String | Yes* | **MAPPING REQUIRED** (see below) |
| `nominees[0]share` | - | Integer | Yes* | Percentage (must total 100%) |
| `nominees[0]age` | - | Integer | Yes* | |
| `nominees[0]photo` | - | File | No | Image file |
| `nominees[0]id_proof` | - | File | No | ID proof document |

*At least one nominee required, total share must equal 100%

**Nominee ID Proof Files:**
- Multiple files sent as: `nomineeIdProof[0]`, `nomineeIdProof[1]`, `nomineeIdProof[2]`

### Physical Measurement Fields

| Frontend Field | Backend Field | Type | Required | Notes |
|---------------|---------------|------|----------|-------|
| `weight` | `weight` | String | Yes | In kg (e.g., "70.5") |
| `height` | `height` | String | Yes | In feet (e.g., "5'8\"") |
| `bloodGroup` | `blood_group` | String | Yes | Choices: A+, A-, B+, B-, AB+, AB-, O+, O- |
| `chest` | `chest` | String | No | In inches |
| `surgeryDetails` | `surgery_details` | Text | No | Medical history |
| `medicalRecords` | `medical_records` | File[] | No | Multiple files, Max 5MB each |

### Terms & Conditions

| Frontend Field | Backend Field | Type | Required | Notes |
|---------------|---------------|------|----------|-------|
| `acceptTerms` | `accept_terms` | Boolean | Yes | Must be true |

---

## 3. Critical Field Mappings

### Membership Type Mapping
Frontend sends: `silver`, `bronze`, `gold`, `executive`  
Backend must accept: `individual`, `family`, `corporate`

```python
MEMBERSHIP_TYPE_CHOICES = [
    ('individual', 'Individual'),  # Maps from: silver, bronze
    ('family', 'Family'),          # Maps from: gold
    ('corporate', 'Corporate'),    # Maps from: executive
]
```

**Mapping Logic:**
```python
def map_membership_type(frontend_value):
    mapping = {
        'silver': 'individual',
        'bronze': 'individual',
        'gold': 'family',
        'executive': 'corporate'
    }
    return mapping.get(frontend_value, 'individual')
```

### Marital Status Mapping
Frontend sends: `unmarried`, `married`, `divorced`, `others`  
Backend must accept: `single`, `married`, `divorced`, `widowed`

```python
MARITAL_STATUS_CHOICES = [
    ('single', 'Single'),      # Maps from: unmarried
    ('married', 'Married'),
    ('divorced', 'Divorced'),
    ('widowed', 'Widowed'),    # Maps from: others
]
```

**Mapping Logic:**
```python
def map_marital_status(frontend_value):
    mapping = {
        'unmarried': 'single',
        'married': 'married',
        'divorced': 'divorced',
        'others': 'widowed'
    }
    return mapping.get(frontend_value, 'single')
```

### Nominee Relationship Mapping
Frontend sends: User-entered text (e.g., "son", "wife", "mother")  
Backend must accept: `child`, `spouse`, `father`, `mother`, `sibling`

```python
RELATIONSHIP_CHOICES = [
    ('child', 'Child'),        # Maps from: son, daughter
    ('spouse', 'Spouse'),      # Maps from: wife, husband
    ('father', 'Father'),
    ('mother', 'Mother'),
    ('sibling', 'Sibling'),    # Maps from: brother, sister
]
```

**Mapping Logic:**
```python
def normalize_relationship(user_input):
    user_input = user_input.lower().strip()
    mapping = {
        'son': 'child',
        'daughter': 'child',
        'wife': 'spouse',
        'husband': 'spouse',
        'father': 'father',
        'mother': 'mother',
        'brother': 'sibling',
        'sister': 'sibling'
    }
    return mapping.get(user_input, user_input)
```

---

## 4. Django Model Structure

### Example Models

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class MembershipApplication(models.Model):
    # Proposal Information
    proposal_no = models.CharField(max_length=100, unique=True)
    fo_code = models.CharField(max_length=50, blank=True, null=True)
    fo_name = models.CharField(max_length=200, blank=True, null=True)
    
    # Membership Type (with mapping)
    membership_type = models.CharField(
        max_length=20,
        choices=MEMBERSHIP_TYPE_CHOICES
    )
    
    # Personal Information
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    name_bangla = models.CharField(max_length=200, blank=True)
    name_english = models.CharField(max_length=200)
    father_name = models.CharField(max_length=200)
    mother_name = models.CharField(max_length=200)
    spouse_name = models.CharField(max_length=200, blank=True, null=True)
    mobile = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    photo = models.ImageField(upload_to='member_photos/')
    
    # Additional Personal
    dob = models.DateField()
    age = models.IntegerField()
    nationality = models.CharField(max_length=100, default='Bangladeshi')
    age_proof = models.JSONField(default=list)  # Array of selected proofs
    age_proof_doc = models.FileField(upload_to='age_proofs/')
    driving_license = models.CharField(max_length=3, choices=[('yes', 'Yes'), ('no', 'No')], default='no')
    license_doc = models.FileField(upload_to='licenses/', blank=True, null=True)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, blank=True)
    education = models.CharField(max_length=200, blank=True)
    professional_qualifications = models.CharField(max_length=200, blank=True)
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES, blank=True)
    organization_details = models.TextField(blank=True)
    daily_work = models.CharField(max_length=200, blank=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    income_source = models.CharField(max_length=200, blank=True)
    
    # Address
    present_address = models.TextField()
    permanent_address = models.TextField()
    
    # Physical Measurements
    weight = models.CharField(max_length=20)
    height = models.CharField(max_length=20)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    chest = models.CharField(max_length=20, blank=True)
    surgery_details = models.TextField(blank=True)
    
    # Terms
    accept_terms = models.BooleanField(default=False)
    
    # Meta
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'membership_applications'
        ordering = ['-submitted_at']

class Nominee(models.Model):
    application = models.ForeignKey(MembershipApplication, on_delete=models.CASCADE, related_name='nominees')
    name = models.CharField(max_length=200)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    share = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    age = models.IntegerField()
    photo = models.ImageField(upload_to='nominee_photos/', blank=True, null=True)
    id_proof = models.FileField(upload_to='nominee_id_proofs/', blank=True, null=True)
    
    class Meta:
        db_table = 'nominees'

class MedicalRecord(models.Model):
    application = models.ForeignKey(MembershipApplication, on_delete=models.CASCADE, related_name='medical_records_files')
    file = models.FileField(upload_to='medical_records/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'medical_records'
```

---

## 5. Django Serializer Example

```python
from rest_framework import serializers

class NomineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominee
        fields = ['name', 'relationship', 'share', 'age', 'photo', 'id_proof']

class MembershipApplicationSerializer(serializers.ModelSerializer):
    nominees = NomineeSerializer(many=True)
    medical_records = serializers.ListField(
        child=serializers.FileField(),
        required=False
    )
    
    class Meta:
        model = MembershipApplication
        fields = '__all__'
    
    def validate_membership_type(self, value):
        """Map frontend membership types to backend choices"""
        mapping = {
            'silver': 'individual',
            'bronze': 'individual',
            'gold': 'family',
            'executive': 'corporate'
        }
        return mapping.get(value, value)
    
    def validate_marital_status(self, value):
        """Map frontend marital status to backend choices"""
        mapping = {
            'unmarried': 'single',
            'married': 'married',
            'divorced': 'divorced',
            'others': 'widowed'
        }
        return mapping.get(value, value)
    
    def validate(self, data):
        """Validate nominee shares total 100%"""
        if 'nominees' in data:
            total_share = sum(n['share'] for n in data['nominees'])
            if total_share != 100:
                raise serializers.ValidationError({
                    'nominees': f'Total share must equal 100%. Current total: {total_share}%'
                })
        return data
    
    def create(self, validated_data):
        nominees_data = validated_data.pop('nominees', [])
        medical_records = validated_data.pop('medical_records', [])
        
        # Convert annual income to monthly if needed
        if 'annual_income' in validated_data:
            validated_data['monthly_income'] = float(validated_data['annual_income']) / 12
        
        application = MembershipApplication.objects.create(**validated_data)
        
        # Create nominees
        for nominee_data in nominees_data:
            # Normalize relationship
            relationship = self.normalize_relationship(nominee_data.get('relationship', ''))
            nominee_data['relationship'] = relationship
            Nominee.objects.create(application=application, **nominee_data)
        
        # Create medical records
        for file in medical_records:
            MedicalRecord.objects.create(application=application, file=file)
        
        return application
    
    @staticmethod
    def normalize_relationship(user_input):
        """Normalize user-entered relationship to backend choices"""
        user_input = user_input.lower().strip()
        mapping = {
            'son': 'child',
            'daughter': 'child',
            'wife': 'spouse',
            'husband': 'spouse',
            'father': 'father',
            'mother': 'mother',
            'brother': 'sibling',
            'sister': 'sibling'
        }
        return mapping.get(user_input, user_input)
```

---

## 6. Django View Example

```python
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_membership_application(request):
    """
    Submit membership application
    
    Accepts multipart/form-data with files and nested nominee data
    """
    try:
        # Parse nominee data from FormData array format
        nominees_data = []
        i = 0
        while True:
            if f'nominees[{i}]name' not in request.data:
                break
            
            nominee = {
                'name': request.data.get(f'nominees[{i}]name'),
                'relationship': request.data.get(f'nominees[{i}]relation'),
                'share': int(request.data.get(f'nominees[{i}]share', 0)),
                'age': int(request.data.get(f'nominees[{i}]age', 0)),
            }
            
            # Handle nominee photo
            photo_key = f'nominees[{i}]photo'
            if photo_key in request.FILES:
                nominee['photo'] = request.FILES[photo_key]
            
            # Handle nominee ID proof
            id_proof_key = f'nominees[{i}]id_proof'
            if id_proof_key in request.FILES:
                nominee['id_proof'] = request.FILES[id_proof_key]
            
            nominees_data.append(nominee)
            i += 1
        
        # Prepare data for serializer
        data = request.data.copy()
        data['nominees'] = nominees_data
        
        # Handle medical records (multiple files)
        medical_records = []
        for key in request.FILES:
            if key.startswith('medicalRecords'):
                medical_records.append(request.FILES[key])
        if medical_records:
            data['medical_records'] = medical_records
        
        # Serialize and validate
        serializer = MembershipApplicationSerializer(data=data)
        
        if serializer.is_valid():
            application = serializer.save()
            
            return Response({
                'success': True,
                'message': 'Membership application submitted successfully',
                'data': {
                    'id': str(application.id),
                    'proposal_no': application.proposal_no,
                    'status': application.status,
                    'submitted_at': application.submitted_at.isoformat()
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

---

## 7. URL Configuration

```python
# urls.py
from django.urls import path
from .views import submit_membership_application

urlpatterns = [
    path('api/v1/membership/applications/', submit_membership_application, name='submit_membership'),
]
```

---

## 8. CORS Configuration

Add to `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
    "https://yeasin-dev-me.github.io",  # GitHub Pages (if deployed)
]

CORS_ALLOW_CREDENTIALS = True
```

Install package: `pip install django-cors-headers`

---

## 9. File Upload Settings

Add to `settings.py`:

```python
# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload limits
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB

# Allowed file types
ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png']
ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png']
```

---

## 10. Expected Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Membership application submitted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "proposal_no": "BLBD-1732283425123-456",
    "status": "pending",
    "submitted_at": "2025-11-22T10:30:00Z"
  }
}
```

### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Enter a valid email address."],
    "nominees": ["Total share must equal 100%. Current total: 90%"],
    "monthly_income": ["A valid number is required."]
  }
}
```

### Server Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Server error: Unexpected error occurred"
}
```

---

## 11. Testing the API

### Using cURL

```bash
curl -X POST http://localhost:8000/api/v1/membership/applications/ \
  -H "Content-Type: multipart/form-data" \
  -F "proposal_no=BLBD-1732283425123-456" \
  -F "fo_code=FO-001" \
  -F "fo_name=Field Officer Name" \
  -F "membershipType=silver" \
  -F "gender=male" \
  -F "nameEnglish=John Doe" \
  -F "fatherName=Father Name" \
  -F "motherName=Mother Name" \
  -F "mobile=+8801234567890" \
  -F "email=john@example.com" \
  -F "photo=@/path/to/photo.jpg" \
  -F "dob=1990-01-01" \
  -F "age=35" \
  -F "ageProof=[\"NID (National ID)\"]" \
  -F "ageProofDoc=@/path/to/nid.pdf" \
  -F "maritalStatus=unmarried" \
  -F "occupation=service" \
  -F "presentAddress=Present Address" \
  -F "permanentAddress=Permanent Address" \
  -F "nominees[0]name=Nominee 1" \
  -F "nominees[0]relation=son" \
  -F "nominees[0]share=100" \
  -F "nominees[0]age=10" \
  -F "weight=70.5" \
  -F "height=5'8\"" \
  -F "bloodGroup=O+" \
  -F "acceptTerms=true"
```

---

## 12. Frontend Configuration

The frontend is already configured. Ensure Django is running on:
- **Development:** `http://localhost:8000`
- **Production:** Update `VITE_API_BASE_URL` in frontend `.env.local`

Frontend will automatically send data in the correct format to:
```
POST http://localhost:8000/api/v1/membership/applications/
```

---

## 13. Database Migrations

After creating models, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 14. Admin Panel Setup (Optional)

```python
# admin.py
from django.contrib import admin
from .models import MembershipApplication, Nominee, MedicalRecord

class NomineeInline(admin.TabularInline):
    model = Nominee
    extra = 0

class MedicalRecordInline(admin.TabularInline):
    model = MedicalRecord
    extra = 0

@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = ['proposal_no', 'name_english', 'membership_type', 'status', 'submitted_at']
    list_filter = ['status', 'membership_type', 'submitted_at']
    search_fields = ['proposal_no', 'name_english', 'email', 'mobile']
    inlines = [NomineeInline, MedicalRecordInline]
    readonly_fields = ['submitted_at']
```

---

## Summary Checklist

- [ ] Create Django models with correct field names
- [ ] Implement field mapping in serializer (membership_type, marital_status, relationship)
- [ ] Handle FormData array format for nominees
- [ ] Implement nominee share validation (must equal 100%)
- [ ] Configure CORS for frontend origin
- [ ] Set up media file handling
- [ ] Create API endpoint at `/api/v1/membership/applications/`
- [ ] Return response in expected JSON format
- [ ] Test with multipart/form-data
- [ ] Run migrations
- [ ] Configure admin panel (optional)

---

**Questions?** Contact: BrightLife IT Department
