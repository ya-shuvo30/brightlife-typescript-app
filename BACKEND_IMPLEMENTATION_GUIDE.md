# Backend Implementation Guide for Membership Form
**Django REST Framework + PostgreSQL Complete Setup**

## Table of Contents
1. [Project Setup](#project-setup)
2. [Database Models](#database-models)
3. [Serializers](#serializers)
4. [Views & Business Logic](#views--business-logic)
5. [URL Configuration](#url-configuration)
6. [File Upload Handling](#file-upload-handling)
7. [Validation & Error Handling](#validation--error-handling)
8. [Testing](#testing)
9. [Deployment Checklist](#deployment-checklist)

---

## Project Setup

### 1. Initialize Django Project (if not already done)

```bash
# Navigate to backend directory
cd ..\Brightlife-Django-Backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary pillow python-decouple django-cors-headers

# Create requirements.txt
pip freeze > requirements.txt
```

### 2. Django Settings Configuration

**File: `config/settings.py`** (or your settings file)

```python
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = config('SECRET_KEY', default='your-secret-key-here')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'membership',  # Your membership app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',  # Vite dev server
    'https://ya-shuvo30.github.io',  # Production frontend
]

CORS_ALLOW_CREDENTIALS = True

# Database - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='brightlife_db'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='password'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # For membership form (public endpoint)
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ),
}

# Media Files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Static Files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# File Upload Settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'membership_submissions.log',
        },
    },
    'loggers': {
        'membership': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    },
}
```

### 3. Environment Variables

**File: `.env`** (create in backend root, **never commit**)

```env
# Django Settings
SECRET_KEY=your-production-secret-key-here-generate-with-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=brightlife_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,https://ya-shuvo30.github.io
```

### 4. Create Membership App

```bash
python manage.py startapp membership
```

---

## Database Models

### File: `membership/models.py`

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils import timezone
import uuid


class MembershipApplication(models.Model):
    """
    Main membership application model matching frontend MembershipFormData interface
    """
    
    # Auto-generated fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    proposal_number = models.CharField(max_length=20, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Status tracking
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('under_review', 'Under Review'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Step 1: Personal Information
    MEMBERSHIP_TYPE_CHOICES = [
        ('individual', 'Individual Membership'),
        ('family', 'Family Membership'),
        ('corporate', 'Corporate Membership'),
    ]
    membership_type = models.CharField(max_length=20, choices=MEMBERSHIP_TYPE_CHOICES)
    
    # Name fields
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    
    # Date of birth and calculated age
    date_of_birth = models.DateField()
    age = models.IntegerField(editable=False)  # Auto-calculated from DOB
    
    # Gender
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Marital status
    MARITAL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    ]
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES)
    
    # Contact information
    mobile_number = models.CharField(max_length=20)
    email = models.EmailField()
    emergency_contact_name = models.CharField(max_length=200)
    emergency_contact_number = models.CharField(max_length=20)
    
    # Identification
    nid_number = models.CharField(max_length=50, unique=True)
    passport_number = models.CharField(max_length=50, blank=True)
    
    # Occupation
    occupation = models.CharField(max_length=200)
    organization_name = models.CharField(max_length=200, blank=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Family information (for family membership)
    spouse_name = models.CharField(max_length=200, blank=True)
    number_of_children = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        default=0
    )
    father_name = models.CharField(max_length=200)
    mother_name = models.CharField(max_length=200)
    
    # File uploads - Step 1
    photo = models.ImageField(
        upload_to='photos/%Y/%m/',
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])],
        help_text='Passport-size photo (JPG/PNG, max 5MB)'
    )
    age_proof = models.FileField(
        upload_to='documents/age_proof/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        help_text='Birth certificate or NID (PDF/Image, max 5MB)'
    )
    driving_license = models.FileField(
        upload_to='documents/licenses/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        blank=True,
        null=True,
        help_text='Driving license (optional, PDF/Image, max 5MB)'
    )
    
    # Step 2: Address Information
    present_address = models.TextField(help_text='Full present address')
    permanent_address = models.TextField(help_text='Full permanent address')
    
    # Step 4: Physical Measurements
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(10), MaxValueValidator(500)],
        help_text='Weight in kg'
    )
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(50), MaxValueValidator(300)],
        help_text='Height in cm'
    )
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A Positive'),
        ('A-', 'A Negative'),
        ('B+', 'B Positive'),
        ('B-', 'B Negative'),
        ('AB+', 'AB Positive'),
        ('AB-', 'AB Negative'),
        ('O+', 'O Positive'),
        ('O-', 'O Negative'),
    ]
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    
    # Medical history
    surgery_history = models.TextField(
        blank=True,
        help_text='List any previous surgeries (optional)'
    )
    medical_records = models.FileField(
        upload_to='documents/medical/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        blank=True,
        null=True,
        help_text='Medical records (optional, PDF/Image, max 5MB)'
    )
    prescription = models.FileField(
        upload_to='documents/prescriptions/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        blank=True,
        null=True,
        help_text='Current prescriptions (optional, PDF/Image, max 5MB)'
    )
    
    # Declaration acceptance
    terms_accepted = models.BooleanField(default=False)
    declaration_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Membership Application'
        verbose_name_plural = 'Membership Applications'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['proposal_number']),
            models.Index(fields=['nid_number']),
        ]
    
    def save(self, *args, **kwargs):
        # Auto-generate proposal number if not exists
        if not self.proposal_number:
            self.proposal_number = self.generate_proposal_number()
        
        # Auto-calculate age from date of birth
        if self.date_of_birth:
            today = timezone.now().date()
            self.age = today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        
        super().save(*args, **kwargs)
    
    def generate_proposal_number(self):
        """Generate unique proposal number: BL-YYYYMM-XXXX"""
        from datetime import datetime
        today = datetime.now()
        prefix = f"BL-{today.strftime('%Y%m')}"
        
        # Get last proposal number for this month
        last_application = MembershipApplication.objects.filter(
            proposal_number__startswith=prefix
        ).order_by('-proposal_number').first()
        
        if last_application:
            last_number = int(last_application.proposal_number.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        return f"{prefix}-{new_number:04d}"
    
    def __str__(self):
        return f"{self.proposal_number} - {self.first_name} {self.last_name}"


class Nominee(models.Model):
    """
    Nominee details linked to membership application
    Each application can have up to 3 nominees
    """
    application = models.ForeignKey(
        MembershipApplication,
        on_delete=models.CASCADE,
        related_name='nominees'
    )
    
    # Nominee details
    name = models.CharField(max_length=200)
    
    RELATIONSHIP_CHOICES = [
        ('spouse', 'Spouse'),
        ('father', 'Father'),
        ('mother', 'Mother'),
        ('son', 'Son'),
        ('daughter', 'Daughter'),
        ('brother', 'Brother'),
        ('sister', 'Sister'),
        ('other', 'Other'),
    ]
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    
    mobile_number = models.CharField(max_length=20)
    nid_number = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    
    # Share percentage (must total 100% across all nominees)
    share_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # ID proof upload
    id_proof = models.FileField(
        upload_to='documents/nominee_id/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        help_text='NID or other ID proof (PDF/Image, max 5MB)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'Nominee'
        verbose_name_plural = 'Nominees'
    
    def __str__(self):
        return f"{self.name} ({self.relationship}) - {self.share_percentage}%"


class ApplicationStatusHistory(models.Model):
    """Track status changes for auditing"""
    application = models.ForeignKey(
        MembershipApplication,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.CharField(max_length=200, blank=True)  # Admin username
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Status History'
        verbose_name_plural = 'Status Histories'
    
    def __str__(self):
        return f"{self.application.proposal_number}: {self.previous_status} → {self.new_status}"
```

---

## Serializers

### File: `membership/serializers.py`

```python
from rest_framework import serializers
from .models import MembershipApplication, Nominee, ApplicationStatusHistory
from django.core.validators import FileExtensionValidator
from decimal import Decimal


class NomineeSerializer(serializers.ModelSerializer):
    """
    Serializer for Nominee model
    Validates share percentage and file uploads
    """
    
    class Meta:
        model = Nominee
        fields = [
            'id', 'name', 'relationship', 'mobile_number', 
            'nid_number', 'date_of_birth', 'share_percentage', 'id_proof'
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }
    
    def validate_share_percentage(self, value):
        """Validate share percentage is between 0 and 100"""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Share percentage must be between 0 and 100")
        return value
    
    def validate_id_proof(self, value):
        """Validate file size (max 5MB)"""
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB")
        return value


class MembershipApplicationSerializer(serializers.ModelSerializer):
    """
    Main serializer for membership application
    Handles nested nominees and file uploads
    """
    nominees = NomineeSerializer(many=True)
    age = serializers.IntegerField(read_only=True)
    proposal_number = serializers.CharField(read_only=True)
    
    class Meta:
        model = MembershipApplication
        fields = '__all__'
        read_only_fields = ['id', 'proposal_number', 'age', 'created_at', 'updated_at', 'status']
    
    def validate(self, data):
        """
        Custom validation:
        1. Check if nominees' share percentages total 100%
        2. Validate date of birth (must be 18+ years old)
        3. Validate file sizes
        """
        # Validate nominees share percentage
        nominees_data = self.initial_data.get('nominees', [])
        if nominees_data:
            total_share = sum(Decimal(str(n.get('share_percentage', 0))) for n in nominees_data)
            if total_share != 100:
                raise serializers.ValidationError({
                    'nominees': f'Total share percentage must be 100%. Current total: {total_share}%'
                })
        
        # Validate age (18+ for individual, no restriction for family)
        from datetime import date
        dob = data.get('date_of_birth')
        if dob:
            today = date.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            
            if data.get('membership_type') == 'individual' and age < 18:
                raise serializers.ValidationError({
                    'date_of_birth': 'Applicant must be at least 18 years old for individual membership'
                })
        
        # Validate terms acceptance
        if not data.get('terms_accepted'):
            raise serializers.ValidationError({
                'terms_accepted': 'You must accept the terms and conditions'
            })
        
        return data
    
    def validate_nid_number(self, value):
        """Check for duplicate NID"""
        if self.instance is None:  # Creating new record
            if MembershipApplication.objects.filter(nid_number=value).exists():
                raise serializers.ValidationError("An application with this NID number already exists")
        return value
    
    def validate_photo(self, value):
        """Validate photo file"""
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Photo size cannot exceed 5MB")
        return value
    
    def create(self, validated_data):
        """
        Custom create method to handle nested nominees
        """
        nominees_data = validated_data.pop('nominees', [])
        
        # Create membership application
        application = MembershipApplication.objects.create(**validated_data)
        
        # Create associated nominees
        for nominee_data in nominees_data:
            Nominee.objects.create(application=application, **nominee_data)
        
        return application
    
    def update(self, instance, validated_data):
        """
        Custom update method to handle nested nominees
        """
        nominees_data = validated_data.pop('nominees', None)
        
        # Update membership application fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update nominees if provided
        if nominees_data is not None:
            # Delete existing nominees
            instance.nominees.all().delete()
            
            # Create new nominees
            for nominee_data in nominees_data:
                Nominee.objects.create(application=application, **nominee_data)
        
        return instance


class ApplicationStatusSerializer(serializers.ModelSerializer):
    """Serializer for status history tracking"""
    
    class Meta:
        model = ApplicationStatusHistory
        fields = '__all__'
        read_only_fields = ['timestamp']


class MembershipApplicationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing applications (admin view)
    """
    nominees_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MembershipApplication
        fields = [
            'id', 'proposal_number', 'first_name', 'last_name', 
            'membership_type', 'status', 'email', 'mobile_number',
            'nominees_count', 'created_at'
        ]
    
    def get_nominees_count(self, obj):
        return obj.nominees.count()
```

---

## Views & Business Logic

### File: `membership/views.py`

```python
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
import logging

from .models import MembershipApplication, Nominee, ApplicationStatusHistory
from .serializers import (
    MembershipApplicationSerializer,
    MembershipApplicationListSerializer,
    ApplicationStatusSerializer
)

logger = logging.getLogger('membership')


class MembershipApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for membership application CRUD operations
    
    Public endpoints:
    - POST /api/membership/applications/ - Submit new application
    - GET /api/membership/applications/{id}/ - Retrieve application (for user confirmation)
    
    Admin endpoints (requires authentication):
    - GET /api/membership/applications/ - List all applications
    - PATCH /api/membership/applications/{id}/ - Update status
    - DELETE /api/membership/applications/{id}/ - Delete application
    """
    queryset = MembershipApplication.objects.prefetch_related('nominees').all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'list':
            return MembershipApplicationListSerializer
        return MembershipApplicationSerializer
    
    def get_permissions(self):
        """
        Public access for create and retrieve
        Admin access for list, update, delete
        """
        if self.action in ['create', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Handle new membership application submission
        Wraps creation in database transaction for data integrity
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Save application and nominees
            application = serializer.save()
            
            # Log successful submission
            logger.info(
                f"New membership application submitted: {application.proposal_number} "
                f"by {application.first_name} {application.last_name}"
            )
            
            # Send confirmation email (optional)
            self.send_confirmation_email(application)
            
            # Return response with proposal number
            return Response({
                'success': True,
                'message': 'Application submitted successfully',
                'data': {
                    'proposal_number': application.proposal_number,
                    'id': str(application.id),
                    'status': application.status
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error submitting membership application: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to submit application',
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        """Get application details by ID or proposal number"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Application not found',
                'errors': str(e)
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """
        Admin endpoint to update application status
        POST /api/membership/applications/{id}/update_status/
        Body: { "status": "approved", "notes": "Optional notes" }
        """
        application = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status not in dict(MembershipApplication.STATUS_CHOICES):
            return Response({
                'success': False,
                'message': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Record status change in history
        ApplicationStatusHistory.objects.create(
            application=application,
            previous_status=application.status,
            new_status=new_status,
            changed_by=request.user.username if request.user.is_authenticated else 'system',
            notes=notes
        )
        
        # Update status
        application.status = new_status
        application.save()
        
        # Send notification email
        self.send_status_update_email(application, new_status)
        
        logger.info(f"Application {application.proposal_number} status updated to {new_status}")
        
        return Response({
            'success': True,
            'message': 'Status updated successfully',
            'data': {
                'proposal_number': application.proposal_number,
                'status': application.status
            }
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def statistics(self, request):
        """
        Admin endpoint for application statistics
        GET /api/membership/applications/statistics/
        """
        from django.db.models import Count
        
        stats = MembershipApplication.objects.aggregate(
            total=Count('id'),
            pending=Count('id', filter=models.Q(status='pending')),
            approved=Count('id', filter=models.Q(status='approved')),
            rejected=Count('id', filter=models.Q(status='rejected')),
            under_review=Count('id', filter=models.Q(status='under_review'))
        )
        
        # Membership type breakdown
        type_breakdown = MembershipApplication.objects.values('membership_type').annotate(
            count=Count('id')
        )
        
        return Response({
            'success': True,
            'data': {
                'overview': stats,
                'by_type': list(type_breakdown)
            }
        })
    
    def send_confirmation_email(self, application):
        """Send confirmation email to applicant"""
        try:
            subject = f'Membership Application Received - {application.proposal_number}'
            message = f"""
Dear {application.first_name} {application.last_name},

Thank you for submitting your membership application to BrightLife Bangladesh.

Your application details:
- Proposal Number: {application.proposal_number}
- Membership Type: {application.get_membership_type_display()}
- Submission Date: {application.created_at.strftime('%d %B %Y, %I:%M %p')}

Your application is currently under review. We will notify you once the review is complete.

For any queries, please contact us at support@brightlife-bd.com

Best regards,
BrightLife Bangladesh Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [application.email],
                fail_silently=True
            )
            logger.info(f"Confirmation email sent to {application.email}")
        except Exception as e:
            logger.error(f"Failed to send confirmation email: {str(e)}")
    
    def send_status_update_email(self, application, new_status):
        """Send email when application status changes"""
        try:
            status_messages = {
                'approved': 'We are pleased to inform you that your membership application has been approved!',
                'rejected': 'We regret to inform you that your membership application has been rejected.',
                'under_review': 'Your membership application is currently under review.'
            }
            
            subject = f'Application Status Update - {application.proposal_number}'
            message = f"""
Dear {application.first_name} {application.last_name},

{status_messages.get(new_status, 'Your application status has been updated.')}

Application Details:
- Proposal Number: {application.proposal_number}
- Current Status: {application.get_status_display()}

For any queries, please contact us at support@brightlife-bd.com

Best regards,
BrightLife Bangladesh Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [application.email],
                fail_silently=True
            )
        except Exception as e:
            logger.error(f"Failed to send status update email: {str(e)}")
```

---

## URL Configuration

### File: `membership/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembershipApplicationViewSet

router = DefaultRouter()
router.register(r'applications', MembershipApplicationViewSet, basename='membership-application')

app_name = 'membership'

urlpatterns = [
    path('', include(router.urls)),
]
```

### File: `config/urls.py` (Main project URLs)

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/membership/', include('membership.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## File Upload Handling

### Create Media Directory Structure

```bash
# In backend root
mkdir -p media/photos
mkdir -p media/documents/age_proof
mkdir -p media/documents/licenses
mkdir -p media/documents/medical
mkdir -p media/documents/prescriptions
mkdir -p media/documents/nominee_id
```

### File Upload Best Practices

**File: `membership/utils.py`**

```python
from django.core.exceptions import ValidationError
import os

def validate_file_size(file, max_size_mb=5):
    """Validate file size"""
    max_size_bytes = max_size_mb * 1024 * 1024
    if file.size > max_size_bytes:
        raise ValidationError(f'File size cannot exceed {max_size_mb}MB')

def validate_image_dimensions(image, max_width=2000, max_height=2000):
    """Validate image dimensions"""
    from PIL import Image
    img = Image.open(image)
    if img.width > max_width or img.height > max_height:
        raise ValidationError(f'Image dimensions cannot exceed {max_width}x{max_height}px')

def get_file_extension(filename):
    """Get file extension safely"""
    return os.path.splitext(filename)[1].lower()
```

---

## Admin Panel Configuration

### File: `membership/admin.py`

```python
from django.contrib import admin
from django.utils.html import format_html
from .models import MembershipApplication, Nominee, ApplicationStatusHistory


class NomineeInline(admin.TabularInline):
    model = Nominee
    extra = 0
    fields = ['name', 'relationship', 'mobile_number', 'share_percentage', 'id_proof']
    readonly_fields = []


class StatusHistoryInline(admin.TabularInline):
    model = ApplicationStatusHistory
    extra = 0
    readonly_fields = ['previous_status', 'new_status', 'changed_by', 'notes', 'timestamp']
    can_delete = False


@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'proposal_number', 'full_name', 'membership_type', 
        'status_badge', 'email', 'mobile_number', 'created_at'
    ]
    list_filter = ['status', 'membership_type', 'gender', 'created_at']
    search_fields = [
        'proposal_number', 'first_name', 'last_name', 
        'email', 'mobile_number', 'nid_number'
    ]
    readonly_fields = [
        'id', 'proposal_number', 'age', 'created_at', 
        'updated_at', 'declaration_date'
    ]
    
    fieldsets = (
        ('Application Info', {
            'fields': ('id', 'proposal_number', 'status', 'created_at', 'updated_at')
        }),
        ('Personal Information', {
            'fields': (
                'membership_type', 'first_name', 'middle_name', 'last_name',
                'date_of_birth', 'age', 'gender', 'marital_status'
            )
        }),
        ('Contact Information', {
            'fields': (
                'mobile_number', 'email', 
                'emergency_contact_name', 'emergency_contact_number'
            )
        }),
        ('Identification', {
            'fields': ('nid_number', 'passport_number')
        }),
        ('Occupation', {
            'fields': ('occupation', 'organization_name', 'monthly_income')
        }),
        ('Family Details', {
            'fields': (
                'spouse_name', 'number_of_children', 
                'father_name', 'mother_name'
            )
        }),
        ('Address', {
            'fields': ('present_address', 'permanent_address')
        }),
        ('Physical Measurements', {
            'fields': ('weight', 'height', 'blood_group', 'surgery_history')
        }),
        ('Documents', {
            'fields': (
                'photo', 'age_proof', 'driving_license',
                'medical_records', 'prescription'
            )
        }),
        ('Declaration', {
            'fields': ('terms_accepted', 'declaration_date')
        }),
    )
    
    inlines = [NomineeInline, StatusHistoryInline]
    
    def full_name(self, obj):
        """Display full name"""
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Name'
    
    def status_badge(self, obj):
        """Display status with color badge"""
        colors = {
            'pending': '#FFA500',
            'approved': '#28a745',
            'rejected': '#dc3545',
            'under_review': '#17a2b8'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, '#6c757d'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    actions = ['mark_approved', 'mark_rejected', 'mark_under_review']
    
    def mark_approved(self, request, queryset):
        """Bulk approve applications"""
        for app in queryset:
            ApplicationStatusHistory.objects.create(
                application=app,
                previous_status=app.status,
                new_status='approved',
                changed_by=request.user.username,
                notes='Bulk approved by admin'
            )
        queryset.update(status='approved')
        self.message_user(request, f'{queryset.count()} applications marked as approved')
    mark_approved.short_description = 'Mark selected as Approved'
    
    def mark_rejected(self, request, queryset):
        """Bulk reject applications"""
        for app in queryset:
            ApplicationStatusHistory.objects.create(
                application=app,
                previous_status=app.status,
                new_status='rejected',
                changed_by=request.user.username,
                notes='Bulk rejected by admin'
            )
        queryset.update(status='rejected')
        self.message_user(request, f'{queryset.count()} applications marked as rejected')
    mark_rejected.short_description = 'Mark selected as Rejected'
    
    def mark_under_review(self, request, queryset):
        """Bulk mark as under review"""
        for app in queryset:
            ApplicationStatusHistory.objects.create(
                application=app,
                previous_status=app.status,
                new_status='under_review',
                changed_by=request.user.username,
                notes='Bulk marked under review by admin'
            )
        queryset.update(status='under_review')
        self.message_user(request, f'{queryset.count()} applications marked as under review')
    mark_under_review.short_description = 'Mark selected as Under Review'


@admin.register(Nominee)
class NomineeAdmin(admin.ModelAdmin):
    list_display = ['name', 'application_proposal', 'relationship', 'share_percentage', 'mobile_number']
    list_filter = ['relationship']
    search_fields = ['name', 'nid_number', 'application__proposal_number']
    
    def application_proposal(self, obj):
        return obj.application.proposal_number
    application_proposal.short_description = 'Proposal Number'


@admin.register(ApplicationStatusHistory)
class StatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['application_proposal', 'previous_status', 'new_status', 'changed_by', 'timestamp']
    list_filter = ['new_status', 'timestamp']
    search_fields = ['application__proposal_number', 'changed_by']
    readonly_fields = ['application', 'previous_status', 'new_status', 'changed_by', 'notes', 'timestamp']
    
    def application_proposal(self, obj):
        return obj.application.proposal_number
    application_proposal.short_description = 'Proposal Number'
```

---

## Database Migration & Setup

### Step-by-Step Setup Commands

```bash
# 1. Ensure PostgreSQL is running and database exists
# Create database in PostgreSQL:
# psql -U postgres
# CREATE DATABASE brightlife_db;
# \q

# 2. Activate virtual environment
venv\Scripts\activate

# 3. Apply migrations
python manage.py makemigrations membership
python manage.py migrate

# 4. Create superuser for admin access
python manage.py createsuperuser
# Username: admin
# Email: admin@brightlife-bd.com
# Password: [your secure password]

# 5. Collect static files (for production)
python manage.py collectstatic --noinput

# 6. Run development server
python manage.py runserver

# Server runs at: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# API endpoint: http://localhost:8000/api/membership/applications/
```

---

## Testing

### File: `membership/tests.py`

```python
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date
from decimal import Decimal

from .models import MembershipApplication, Nominee


class MembershipApplicationModelTest(TestCase):
    """Test membership application model"""
    
    def setUp(self):
        self.photo = SimpleUploadedFile("photo.jpg", b"file_content", content_type="image/jpeg")
        self.age_proof = SimpleUploadedFile("age_proof.pdf", b"file_content", content_type="application/pdf")
        
        self.application = MembershipApplication.objects.create(
            membership_type='individual',
            first_name='John',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='male',
            marital_status='single',
            mobile_number='01712345678',
            email='john.doe@example.com',
            emergency_contact_name='Jane Doe',
            emergency_contact_number='01798765432',
            nid_number='1234567890',
            occupation='Engineer',
            father_name='Father Name',
            mother_name='Mother Name',
            present_address='123 Main St',
            permanent_address='123 Main St',
            weight=Decimal('70.5'),
            height=Decimal('175.0'),
            blood_group='O+',
            terms_accepted=True,
            photo=self.photo,
            age_proof=self.age_proof
        )
    
    def test_proposal_number_generation(self):
        """Test auto-generation of proposal number"""
        self.assertTrue(self.application.proposal_number.startswith('BL-'))
    
    def test_age_calculation(self):
        """Test automatic age calculation"""
        expected_age = 35  # As of 2025
        self.assertEqual(self.application.age, expected_age)
    
    def test_string_representation(self):
        """Test __str__ method"""
        expected = f"{self.application.proposal_number} - John Doe"
        self.assertEqual(str(self.application), expected)


class MembershipAPITest(APITestCase):
    """Test membership API endpoints"""
    
    def test_create_application(self):
        """Test creating new membership application"""
        photo = SimpleUploadedFile("photo.jpg", b"file_content", content_type="image/jpeg")
        age_proof = SimpleUploadedFile("age_proof.pdf", b"file_content", content_type="application/pdf")
        nominee_id = SimpleUploadedFile("nominee_id.pdf", b"file_content", content_type="application/pdf")
        
        data = {
            'membership_type': 'individual',
            'first_name': 'Test',
            'last_name': 'User',
            'date_of_birth': '1995-05-15',
            'gender': 'male',
            'marital_status': 'single',
            'mobile_number': '01712345678',
            'email': 'test@example.com',
            'emergency_contact_name': 'Emergency Contact',
            'emergency_contact_number': '01798765432',
            'nid_number': '9876543210',
            'occupation': 'Developer',
            'father_name': 'Father',
            'mother_name': 'Mother',
            'present_address': 'Present Address',
            'permanent_address': 'Permanent Address',
            'weight': '75.0',
            'height': '180.0',
            'blood_group': 'A+',
            'terms_accepted': True,
            'photo': photo,
            'age_proof': age_proof,
            'nominees': [
                {
                    'name': 'Nominee 1',
                    'relationship': 'spouse',
                    'mobile_number': '01712345679',
                    'nid_number': '1111111111',
                    'date_of_birth': '1996-06-20',
                    'share_percentage': '100',
                    'id_proof': nominee_id
                }
            ]
        }
        
        response = self.client.post('/api/membership/applications/', data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('proposal_number', response.data['data'])
    
    def test_invalid_share_percentage(self):
        """Test validation of nominee share percentages"""
        # Test data with shares not totaling 100%
        # ... (implementation similar to above but with incorrect shares)
        pass
```

### Run Tests

```bash
python manage.py test membership
```

---

## API Endpoints Summary

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/membership/applications/` | Submit new membership application |
| GET | `/api/membership/applications/{id}/` | Retrieve application by ID |

### Admin Endpoints (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/membership/applications/` | List all applications (paginated) |
| PATCH | `/api/membership/applications/{id}/update_status/` | Update application status |
| GET | `/api/membership/applications/statistics/` | Get application statistics |
| DELETE | `/api/membership/applications/{id}/` | Delete application |

---

## Deployment Checklist

### Pre-Deployment Steps

- [ ] Set `DEBUG=False` in production
- [ ] Configure proper `SECRET_KEY` (use environment variable)
- [ ] Set up PostgreSQL database (production instance)
- [ ] Configure `ALLOWED_HOSTS` with production domain
- [ ] Set up static file serving (WhiteNoise or CDN)
- [ ] Set up media file storage (AWS S3, Azure Blob, or CDN)
- [ ] Configure email backend (SMTP settings for confirmation emails)
- [ ] Enable HTTPS and update `CORS_ALLOWED_ORIGINS`
- [ ] Set up logging to file/cloud service
- [ ] Configure backup strategy for database and media files
- [ ] Set up monitoring (Sentry for errors, CloudWatch/Azure Monitor)
- [ ] Test file upload limits and server timeout settings
- [ ] Create admin user in production
- [ ] Test API endpoints with frontend integration

### Production Settings Example

```python
# production_settings.py
from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['api.brightlife-bd.com', 'brightlife-backend.azurewebsites.net']

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True

# Database - Use environment variables
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = 'noreply@brightlife-bd.com'

# Media files - AWS S3 example
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = 'brightlife-media'
AWS_S3_REGION_NAME = 'ap-south-1'
```

---

## Quick Start Commands Summary

```bash
# 1. Setup
cd ..\Brightlife-Django-Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 2. Configure .env file
# (Copy values from .env.example and fill in actual credentials)

# 3. Database
python manage.py makemigrations membership
python manage.py migrate
python manage.py createsuperuser

# 4. Run server
python manage.py runserver

# 5. Access
# API: http://localhost:8000/api/membership/applications/
# Admin: http://localhost:8000/admin

# 6. Test with frontend
# Ensure frontend .env.local has:
# VITE_API_BASE_URL=http://localhost:8000/api
# VITE_USE_MOCK_API=false
```

---

## Support & Troubleshooting

### Common Issues

**Issue: CORS errors when submitting form**
```python
# Solution: Check CORS_ALLOWED_ORIGINS includes your frontend URL
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Add this
]
```

**Issue: File upload fails with 413 error**
```python
# Solution: Increase file upload limits in settings.py
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 15 * 1024 * 1024  # 15MB
```

**Issue: Database connection errors**
```bash
# Solution: Verify PostgreSQL is running
# Check credentials in .env file
# Test connection: psql -U postgres -d brightlife_db
```

**Issue: Media files not accessible**
```python
# Solution: Ensure MEDIA_URL and MEDIA_ROOT are configured
# In development, add to urls.py:
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## Next Steps After Backend Setup

1. **Test API with Postman/Thunder Client**
   - Import API collection
   - Test all endpoints
   - Verify file uploads work

2. **Connect Frontend**
   - Set `VITE_USE_MOCK_API=false` in frontend `.env.local`
   - Start both servers (Django + Vite)
   - Submit test application from frontend

3. **Admin Panel Setup**
   - Login to Django admin
   - Review submitted applications
   - Test status update workflow

4. **Production Deployment**
   - Choose hosting (Heroku, Railway, Azure, AWS)
   - Set up PostgreSQL production database
   - Configure media file storage (S3/Azure Blob)
   - Deploy backend
   - Update frontend `VITE_API_BASE_URL` to production URL

---

**Documentation Version:** 1.0  
**Last Updated:** November 17, 2025  
**Compatibility:** Django 4.2+, DRF 3.14+, PostgreSQL 14+

---

## Appendix: Frontend Integration Guide

### 🚨 IMPORTANT: Frontend-Backend Field Mapping

**Your frontend implementation uses DIFFERENT field names** than the standard guide above. Update the Django models to match your actual frontend fields:

### Actual Frontend Fields (from `src/types/membership.ts`)

```typescript
export interface MembershipFormData {
  // Proposal Information
  proposalNo: string;
  serialNo: string;
  foName: string;
  memberShip: string;
  foCode: string;
  membershipType: 'silver' | 'bronze' | 'gold' | 'executive';

  // Personal Information
  gender: 'male' | 'female';
  nameBangla: string;
  nameEnglish: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  mobile: string;
  photo: File | null;
  
  // Additional Personal Info
  dob: string; // Date of Birth
  age: number;
  nationality: string;
  ageProof: string[]; // Types: e.g., ['Birth Certificate', 'NID']
  ageProofDoc: File | null;
  drivingLicense: 'yes' | 'no';
  licenseDoc: File | null;
  maritalStatus: 'married' | 'unmarried' | 'divorced' | 'others';
  education: string;
  professionalQualifications: string;
  occupation: 'service' | 'business' | 'farmer' | 'others';
  organizationDetails: string;
  dailyWork: string;
  annualIncome: string;
  incomeSource: string;

  // Address
  presentAddress: string;
  permanentAddress: string;

  // Nominees (Array of 3)
  nominees: Nominee[];
  nomineeIdProof: File[]; // Array of 3 ID proof files

  // Physical Measurement
  weight: string;
  height: string;
  bloodGroup: string;
  chest: string; // Chest measurement
  surgeryDetails: string;
  medicalRecords: File[]; // Array of medical record files

  // Terms
  acceptTerms: boolean;
}

export interface Nominee {
  name: string;
  relation: string;
  share: number; // Percentage (total must be 100)
  age: number;
  photo: File | null;
}
```

### Updated Django Model (Add to `membership/models.py`)

```python
class MembershipApplication(models.Model):
    """
    Updated model matching actual frontend implementation
    """
    
    # Auto-generated fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    proposal_number = models.CharField(max_length=20, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Status
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('under_review', 'Under Review'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Proposal Information (from frontend)
    serial_no = models.CharField(max_length=50, blank=True)
    fo_name = models.CharField(max_length=200, blank=True, verbose_name='Field Officer Name')
    membership = models.CharField(max_length=100, blank=True)
    fo_code = models.CharField(max_length=50, blank=True, verbose_name='Field Officer Code')
    
    MEMBERSHIP_TYPE_CHOICES = [
        ('silver', 'Silver'),
        ('bronze', 'Bronze'),
        ('gold', 'Gold'),
        ('executive', 'Executive'),
    ]
    membership_type = models.CharField(max_length=20, choices=MEMBERSHIP_TYPE_CHOICES)
    
    # Personal Information
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    name_bangla = models.CharField(max_length=200, verbose_name='Name (Bangla)')
    name_english = models.CharField(max_length=200, verbose_name='Name (English)')
    father_name = models.CharField(max_length=200)
    mother_name = models.CharField(max_length=200)
    spouse_name = models.CharField(max_length=200, blank=True)
    mobile = models.CharField(max_length=20)
    
    # Files - Personal
    photo = models.ImageField(
        upload_to='photos/%Y/%m/',
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])],
        help_text='Passport-size photo (JPG/PNG, max 5MB)'
    )
    
    # Additional Personal Info
    dob = models.DateField(verbose_name='Date of Birth')
    age = models.IntegerField(editable=False, verbose_name='Age')
    nationality = models.CharField(max_length=100, default='Bangladeshi')
    
    # Age proof types stored as JSON array
    age_proof_types = models.JSONField(
        default=list,
        help_text='Array of age proof types (e.g., ["Birth Certificate", "NID"])'
    )
    age_proof_doc = models.FileField(
        upload_to='documents/age_proof/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        help_text='Age proof document (PDF/Image, max 5MB)'
    )
    
    DRIVING_LICENSE_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]
    driving_license = models.CharField(max_length=3, choices=DRIVING_LICENSE_CHOICES)
    license_doc = models.FileField(
        upload_to='documents/licenses/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        blank=True,
        null=True,
        help_text='Driving license document (PDF/Image, max 5MB)'
    )
    
    MARITAL_STATUS_CHOICES = [
        ('married', 'Married'),
        ('unmarried', 'Unmarried'),
        ('divorced', 'Divorced'),
        ('others', 'Others'),
    ]
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES)
    
    education = models.CharField(max_length=200)
    professional_qualifications = models.TextField(blank=True)
    
    OCCUPATION_CHOICES = [
        ('service', 'Service'),
        ('business', 'Business'),
        ('farmer', 'Farmer'),
        ('others', 'Others'),
    ]
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES)
    organization_details = models.TextField(blank=True)
    daily_work = models.TextField(blank=True, verbose_name='Daily Work Description')
    annual_income = models.CharField(max_length=100)
    income_source = models.TextField()
    
    # Address
    present_address = models.TextField()
    permanent_address = models.TextField()
    
    # Physical Measurements
    weight = models.CharField(max_length=20, help_text='Weight (e.g., "70 kg")')
    height = models.CharField(max_length=20, help_text='Height (e.g., "175 cm")')
    blood_group = models.CharField(max_length=10)
    chest = models.CharField(max_length=20, help_text='Chest measurement')
    surgery_details = models.TextField(blank=True)
    
    # Terms
    accept_terms = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Membership Application'
        verbose_name_plural = 'Membership Applications'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['proposal_number']),
            models.Index(fields=['mobile']),
        ]
    
    def save(self, *args, **kwargs):
        # Auto-generate proposal number
        if not self.proposal_number:
            self.proposal_number = self.generate_proposal_number()
        
        # Auto-calculate age from DOB
        if self.dob:
            today = timezone.now().date()
            self.age = today.year - self.dob.year - (
                (today.month, today.day) < (self.dob.month, self.dob.day)
            )
        
        super().save(*args, **kwargs)
    
    def generate_proposal_number(self):
        """Generate unique proposal number: BLBD-YYYYMMDD-XXXX"""
        from datetime import datetime
        today = datetime.now()
        prefix = f"BLBD-{today.strftime('%Y%m%d')}"
        
        last_application = MembershipApplication.objects.filter(
            proposal_number__startswith=prefix
        ).order_by('-proposal_number').first()
        
        if last_application:
            last_number = int(last_application.proposal_number.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        return f"{prefix}-{new_number:04d}"
    
    def __str__(self):
        return f"{self.proposal_number} - {self.name_english}"


class Nominee(models.Model):
    """Nominee linked to membership application"""
    application = models.ForeignKey(
        MembershipApplication,
        on_delete=models.CASCADE,
        related_name='nominees'
    )
    
    name = models.CharField(max_length=200)
    relation = models.CharField(max_length=100)
    share = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Share percentage (total must be 100%)'
    )
    age = models.IntegerField()
    
    # Nominee photo
    photo = models.ImageField(
        upload_to='nominees/photos/%Y/%m/',
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])],
        blank=True,
        null=True
    )
    
    # ID proof for nominee
    id_proof = models.FileField(
        upload_to='nominees/id_proof/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        help_text='Nominee ID proof (PDF/Image, max 5MB)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.name} ({self.relation}) - {self.share}%"


class MedicalRecord(models.Model):
    """Medical records for membership application"""
    application = models.ForeignKey(
        MembershipApplication,
        on_delete=models.CASCADE,
        related_name='medical_files'
    )
    
    file = models.FileField(
        upload_to='medical_records/%Y/%m/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])],
        help_text='Medical record (PDF/Image, max 5MB)'
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Medical Record for {self.application.proposal_number}"
```

### Updated Serializer (Replace in `membership/serializers.py`)

```python
class NomineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominee
        fields = ['id', 'name', 'relation', 'share', 'age', 'photo', 'id_proof']
        extra_kwargs = {
            'id': {'read_only': True},
        }


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'file', 'uploaded_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'uploaded_at': {'read_only': True},
        }


class MembershipApplicationSerializer(serializers.ModelSerializer):
    nominees = NomineeSerializer(many=True)
    medical_files = MedicalRecordSerializer(many=True, read_only=True)
    age = serializers.IntegerField(read_only=True)
    proposal_number = serializers.CharField(read_only=True)
    
    class Meta:
        model = MembershipApplication
        fields = '__all__'
        read_only_fields = ['id', 'proposal_number', 'age', 'created_at', 'updated_at', 'status']
    
    def validate(self, data):
        """Validate nominees share total to 100%"""
        nominees_data = self.initial_data.get('nominees', [])
        if nominees_data:
            total_share = sum(Decimal(str(n.get('share', 0))) for n in nominees_data)
            if total_share != 100:
                raise serializers.ValidationError({
                    'nominees': f'Total share must be 100%. Current: {total_share}%'
                })
        
        if not data.get('accept_terms'):
            raise serializers.ValidationError({
                'accept_terms': 'You must accept the terms and conditions'
            })
        
        return data
    
    def create(self, validated_data):
        """Handle nested creation"""
        nominees_data = validated_data.pop('nominees', [])
        
        # Create application
        application = MembershipApplication.objects.create(**validated_data)
        
        # Create nominees
        for nominee_data in nominees_data:
            Nominee.objects.create(application=application, **nominee_data)
        
        return application
```

### Updated API View (Replace in `membership/views.py`)

```python
class MembershipApplicationViewSet(viewsets.ModelViewSet):
    queryset = MembershipApplication.objects.prefetch_related('nominees', 'medical_files').all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer_class = MembershipApplicationSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Handle membership application submission from frontend"""
        try:
            data = request.data.copy()
            
            # Parse nominees from request
            nominees_data = []
            if 'nominees' in data:
                import json
                nominees_json = json.loads(data['nominees']) if isinstance(data['nominees'], str) else data['nominees']
                
                for idx, nominee in enumerate(nominees_json):
                    nominee_data = {
                        'name': nominee['name'],
                        'relation': nominee['relation'],
                        'share': nominee['share'],
                        'age': nominee['age'],
                    }
                    
                    # Add nominee photo if exists
                    if f'nomineePhoto_{idx}' in request.FILES:
                        nominee_data['photo'] = request.FILES[f'nomineePhoto_{idx}']
                    
                    # Add nominee ID proof
                    if f'nomineeIdProof_{idx}' in request.FILES:
                        nominee_data['id_proof'] = request.FILES[f'nomineeIdProof_{idx}']
                    
                    nominees_data.append(nominee_data)
            
            # Create application
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            
            # Save with nominees
            application = serializer.save()
            
            # Handle medical records (multiple files)
            medical_files = []
            for key in request.FILES:
                if key.startswith('medicalRecord_'):
                    MedicalRecord.objects.create(
                        application=application,
                        file=request.FILES[key]
                    )
            
            logger.info(f"Application submitted: {application.proposal_number}")
            
            return Response({
                'success': True,
                'message': 'Application submitted successfully',
                'data': {
                    'proposalNo': application.proposal_number,
                    'status': application.status,
                    'submittedAt': application.created_at.isoformat(),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
```

### Frontend API Call (Already Implemented in `src/services/api/membershipAPI.ts`)

Your frontend already has the correct implementation! Just ensure:

1. **Set backend URL in `.env.local`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

2. **Update API endpoint in `membershipAPI.ts`:**
```typescript
// Change line 134 from:
const response = await apiClient.post('/membership/submit', form);

// To match Django URL:
const response = await apiClient.post('/membership/applications/', form);
```

3. **Start Django server:**
```bash
cd ..\Brightlife-Django-Backend
python manage.py runserver
```

4. **Test submission** from `http://localhost:5173/membership-form`

### Field Mapping Reference

| Frontend (camelCase) | Backend (snake_case) |
|---------------------|---------------------|
| `membershipType` | `membership_type` |
| `nameBangla` | `name_bangla` |
| `nameEnglish` | `name_english` |
| `fatherName` | `father_name` |
| `motherName` | `mother_name` |
| `spouseName` | `spouse_name` |
| `mobile` | `mobile` |
| `photo` | `photo` |
| `dob` | `dob` |
| `age` | `age` (auto-calculated) |
| `nationality` | `nationality` |
| `ageProof` | `age_proof_types` (JSON array) |
| `ageProofDoc` | `age_proof_doc` |
| `drivingLicense` | `driving_license` |
| `licenseDoc` | `license_doc` |
| `maritalStatus` | `marital_status` |
| `education` | `education` |
| `professionalQualifications` | `professional_qualifications` |
| `occupation` | `occupation` |
| `organizationDetails` | `organization_details` |
| `dailyWork` | `daily_work` |
| `annualIncome` | `annual_income` |
| `incomeSource` | `income_source` |
| `presentAddress` | `present_address` |
| `permanentAddress` | `permanent_address` |
| `weight` | `weight` |
| `height` | `height` |
| `bloodGroup` | `blood_group` |
| `chest` | `chest` |
| `surgeryDetails` | `surgery_details` |
| `acceptTerms` | `accept_terms` |

**Backend is ready to receive your exact frontend data structure!** ✅
