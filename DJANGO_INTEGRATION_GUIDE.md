# Django Backend Integration Guide

## 🎯 Overview

This guide helps you integrate the BrightLife React frontend with the Django REST API backend (PostgreSQL + Django ORM).

## 📁 Repository Structure

```
brightlife-workspace/
├── brightlife-typescript-app/     # React Frontend (This repo)
│   ├── src/
│   ├── .env.local                 # Development config
│   └── package.json
│
└── Brightlife-Django-Backend/     # Django Backend (Sibling repo)
    ├── manage.py
    ├── requirements.txt
    ├── membership/                # Django app
    └── config/                    # Django settings
```

## 🚀 Quick Start

### Step 1: Start Django Backend

```bash
# Navigate to Django backend directory
cd ../Brightlife-Django-Backend

# Activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure PostgreSQL database in config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'brightlife_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (for admin panel)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
# Server runs at http://localhost:8000
```

### Step 2: Start React Frontend

```bash
# Navigate to React frontend directory
cd brightlife-typescript-app

# Ensure .env.local is configured
# VITE_USE_MOCK_API=false
# VITE_API_BASE_URL=http://localhost:8000/api

# Start Vite dev server
npm run dev
# Server runs at http://localhost:5173
```

### Step 3: Test Integration

1. Open http://localhost:5173
2. Fill out membership form
3. Submit → Data sent to Django backend
4. Check Django admin: http://localhost:8000/admin

## 🔧 Django Backend Requirements

### Required Django Models

#### `membership/models.py`

```python
from django.db import models
from django.contrib.postgres.fields import ArrayField

class MembershipApplication(models.Model):
    MEMBERSHIP_TYPES = [
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
        ('diamond', 'Diamond'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    MARITAL_STATUS = [
        ('unmarried', 'Unmarried'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    ]
    
    # Application Details
    proposal_no = models.CharField(max_length=50, unique=True, editable=False)
    status = models.CharField(max_length=20, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    # Personal Information
    membership_type = models.CharField(max_length=20, choices=MEMBERSHIP_TYPES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    name_bangla = models.CharField(max_length=255)
    name_english = models.CharField(max_length=255)
    father_name = models.CharField(max_length=255)
    mother_name = models.CharField(max_length=255)
    spouse_name = models.CharField(max_length=255, blank=True)
    mobile = models.CharField(max_length=15)
    dob = models.DateField()
    age = models.IntegerField()
    nationality = models.CharField(max_length=50, default='Bangladeshi')
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS)
    
    # Education & Occupation
    education = models.CharField(max_length=255, blank=True)
    professional_qualifications = models.CharField(max_length=255, blank=True)
    occupation = models.CharField(max_length=50)
    organization_details = models.TextField(blank=True)
    daily_work = models.TextField(blank=True)
    annual_income = models.CharField(max_length=100, blank=True)
    income_source = models.CharField(max_length=255, blank=True)
    
    # Address
    present_address = models.TextField()
    permanent_address = models.TextField()
    
    # Physical Measurements
    weight = models.CharField(max_length=10)
    height = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=5)
    chest = models.CharField(max_length=10, blank=True)
    surgery_details = models.TextField(blank=True)
    
    # Files
    photo = models.ImageField(upload_to='photos/')
    age_proof_doc = models.FileField(upload_to='documents/age_proof/')
    license_doc = models.FileField(upload_to='documents/license/', blank=True, null=True)
    
    # Terms
    accept_terms = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.proposal_no:
            import time
            self.proposal_no = f'BLBD-{int(time.time() * 1000)}'
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-submitted_at']
        db_table = 'membership_applications'
    
    def __str__(self):
        return f"{self.proposal_no} - {self.name_english}"


class Nominee(models.Model):
    application = models.ForeignKey(
        MembershipApplication, 
        related_name='nominees', 
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    relation = models.CharField(max_length=100)
    share = models.IntegerField()
    age = models.IntegerField()
    photo = models.ImageField(upload_to='nominees/', blank=True, null=True)
    
    class Meta:
        db_table = 'nominees'
    
    def __str__(self):
        return f"{self.name} ({self.relation})"


class MedicalRecord(models.Model):
    application = models.ForeignKey(
        MembershipApplication,
        related_name='medical_records',
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to='medical_records/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'medical_records'


class NomineeIdProof(models.Model):
    application = models.ForeignKey(
        MembershipApplication,
        related_name='nominee_id_proofs',
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to='nominee_ids/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'nominee_id_proofs'
```

### Required Django Serializers

#### `membership/serializers.py`

```python
from rest_framework import serializers
from .models import MembershipApplication, Nominee, MedicalRecord, NomineeIdProof

class NomineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominee
        fields = ['name', 'relation', 'share', 'age', 'photo']

class MembershipApplicationSerializer(serializers.ModelSerializer):
    nominees = NomineeSerializer(many=True)
    medical_records = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    nominee_id_proofs = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    
    class Meta:
        model = MembershipApplication
        fields = '__all__'
        read_only_fields = ['proposal_no', 'submitted_at', 'status']
    
    def create(self, validated_data):
        nominees_data = validated_data.pop('nominees', [])
        medical_records = validated_data.pop('medical_records', [])
        nominee_id_proofs = validated_data.pop('nominee_id_proofs', [])
        
        # Create application
        application = MembershipApplication.objects.create(**validated_data)
        
        # Create nominees
        for nominee_data in nominees_data:
            Nominee.objects.create(application=application, **nominee_data)
        
        # Create medical records
        for file in medical_records:
            MedicalRecord.objects.create(application=application, file=file)
        
        # Create nominee ID proofs
        for file in nominee_id_proofs:
            NomineeIdProof.objects.create(application=application, file=file)
        
        return application
```

### Required Django Views

#### `membership/views.py`

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import MembershipApplication
from .serializers import MembershipApplicationSerializer

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = MembershipApplication.objects.all()
    serializer_class = MembershipApplicationSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    @action(detail=False, methods=['post'], url_path='submit')
    def submit_application(self, request):
        """Handle membership application submission"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            application = serializer.save()
            return Response({
                'success': True,
                'message': 'Application submitted successfully',
                'data': {
                    'proposalNo': application.proposal_no,
                    'status': application.status,
                    'submittedAt': application.submitted_at.isoformat()
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='types')
    def membership_types(self, request):
        """Get available membership types"""
        types = [
            {
                'type': 'silver',
                'name': 'Silver',
                'price': 5000,
                'benefits': ['Basic coverage', 'Network hospitals']
            },
            {
                'type': 'gold',
                'name': 'Gold',
                'price': 10000,
                'benefits': ['Enhanced coverage', 'Priority support']
            },
            {
                'type': 'platinum',
                'name': 'Platinum',
                'price': 20000,
                'benefits': ['Premium coverage', '24/7 support']
            },
            {
                'type': 'diamond',
                'name': 'Diamond',
                'price': 50000,
                'benefits': ['Unlimited coverage', 'Concierge service']
            }
        ]
        return Response({
            'success': True,
            'message': 'Membership types fetched successfully',
            'data': types
        })
```

### Required Django URLs

#### `membership/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembershipViewSet

router = DefaultRouter()
router.register(r'membership', MembershipViewSet, basename='membership')

urlpatterns = [
    path('', include(router.urls)),
]
```

#### `config/urls.py` (Main URLs)

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('membership.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### CORS Configuration

#### `config/settings.py`

```python
INSTALLED_APPS = [
    # ... Django apps
    'rest_framework',
    'corsheaders',
    'membership',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at top
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "https://ya-shuvo30.github.io",  # GitHub Pages (if using)
]

CORS_ALLOW_CREDENTIALS = True

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Database - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'brightlife_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### Install Required Packages

```bash
pip install djangorestframework django-cors-headers psycopg2-binary Pillow
```

## 🔄 Frontend API Integration

The React frontend is already configured to work with Django. Key files:

### `src/services/api/membershipAPI.ts`
- ✅ Sends FormData to `/api/membership/submit`
- ✅ Handles file uploads
- ✅ Parses Django responses
- ✅ Mock mode disabled in `.env.local`

### Expected Django API Responses

#### Success Response
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "proposalNo": "BLBD-1700123456789",
    "status": "pending",
    "submittedAt": "2025-11-17T10:30:00Z"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "mobile": ["This field is required"],
    "age": ["Age must be at least 18"]
  }
}
```

## 🗄️ PostgreSQL Setup

### Install PostgreSQL
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql postgresql-contrib
```

### Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE brightlife_db;

-- Create user (optional)
CREATE USER brightlife_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE brightlife_db TO brightlife_user;
```

### Apply Migrations
```bash
python manage.py makemigrations membership
python manage.py migrate
```

## 🧪 Testing the Integration

### 1. Test Backend Alone
```bash
# Django shell
python manage.py shell

from membership.models import MembershipApplication
apps = MembershipApplication.objects.all()
print(apps)
```

### 2. Test API Endpoints
```bash
# Using curl
curl -X GET http://localhost:8000/api/membership/types/

# Should return membership types JSON
```

### 3. Test Full Integration
1. Start Django backend: `python manage.py runserver`
2. Start React frontend: `npm run dev`
3. Fill form at http://localhost:5173
4. Submit application
5. Check Django admin: http://localhost:8000/admin
6. Verify data saved in PostgreSQL

## 📊 Django Admin Configuration

#### `membership/admin.py`

```python
from django.contrib import admin
from .models import MembershipApplication, Nominee, MedicalRecord, NomineeIdProof

class NomineeInline(admin.TabularInline):
    model = Nominee
    extra = 0

class MedicalRecordInline(admin.TabularInline):
    model = MedicalRecord
    extra = 0

class NomineeIdProofInline(admin.TabularInline):
    model = NomineeIdProof
    extra = 0

@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = ['proposal_no', 'name_english', 'membership_type', 'status', 'submitted_at']
    list_filter = ['status', 'membership_type', 'submitted_at']
    search_fields = ['proposal_no', 'name_english', 'mobile']
    readonly_fields = ['proposal_no', 'submitted_at']
    inlines = [NomineeInline, MedicalRecordInline, NomineeIdProofInline]
    
    fieldsets = (
        ('Application Info', {
            'fields': ('proposal_no', 'status', 'submitted_at')
        }),
        ('Personal Information', {
            'fields': ('membership_type', 'gender', 'name_bangla', 'name_english',
                      'father_name', 'mother_name', 'spouse_name', 'mobile', 
                      'dob', 'age', 'nationality', 'marital_status')
        }),
        ('Education & Occupation', {
            'fields': ('education', 'professional_qualifications', 'occupation',
                      'organization_details', 'daily_work', 'annual_income', 'income_source')
        }),
        ('Address', {
            'fields': ('present_address', 'permanent_address')
        }),
        ('Physical Measurements', {
            'fields': ('weight', 'height', 'blood_group', 'chest', 'surgery_details')
        }),
        ('Documents', {
            'fields': ('photo', 'age_proof_doc', 'license_doc')
        }),
        ('Terms', {
            'fields': ('accept_terms',)
        }),
    )
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku/AWS)

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up
```

#### Environment Variables (Production)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=api.brightlifebd.com
CORS_ALLOWED_ORIGINS=https://ya-shuvo30.github.io
```

### Frontend Deployment (GitHub Pages)

Update `.env.production`:
```
VITE_API_BASE_URL=https://api.brightlifebd.com/api
VITE_USE_MOCK_API=false
```

Build and deploy:
```bash
npm run build
# GitHub Actions will deploy to GitHub Pages
```

## 📝 Checklist

### Backend Setup
- [ ] PostgreSQL installed and running
- [ ] Django project cloned
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Database configured in settings.py
- [ ] CORS configured
- [ ] Models created
- [ ] Migrations applied
- [ ] Superuser created
- [ ] Django server running on port 8000

### Frontend Setup
- [ ] `.env.local` updated (VITE_USE_MOCK_API=false)
- [ ] Dev server running on port 5173
- [ ] Can access membership form
- [ ] Form submits to Django backend
- [ ] Success modal appears
- [ ] Data visible in Django admin

### Production Deployment
- [ ] Backend deployed to cloud
- [ ] PostgreSQL database in production
- [ ] Frontend `.env.production` configured
- [ ] CORS allows production domain
- [ ] SSL/HTTPS enabled
- [ ] Media files served correctly

## 🆘 Troubleshooting

### CORS Errors
```python
# In Django settings.py
CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

### File Upload Errors
```python
# Check settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Check urls.py has static files configuration
```

### Database Connection Errors
```bash
# Test PostgreSQL connection
psql -U postgres -d brightlife_db

# Check Django can connect
python manage.py dbshell
```

## ✅ Success!

Your React frontend is now ready to integrate with Django REST API backend! 🎉

**Next Steps:**
1. Set up PostgreSQL database
2. Clone and configure Django backend
3. Run migrations
4. Start both servers
5. Test the integration
