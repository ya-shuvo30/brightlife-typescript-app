# Backend Integration Checklist

**Status**: Frontend Ready ✅ | Backend Pending ⏳

---

## ✅ Frontend (COMPLETED)

- [x] All form components created (5 steps)
- [x] TypeScript types defined (`src/types/membership.ts`)
- [x] API service configured (`src/services/api/membershipAPI.ts`)
- [x] Mock API working for offline development
- [x] File upload handling implemented
- [x] Form validation working
- [x] PDF download feature ready
- [x] Success modal implemented
- [x] Routing configured (`/membership-form`)
- [x] API endpoint updated to match Django URL

---

## ⏳ Backend Setup (TODO)

### Step 1: Navigate to Backend Repository

```bash
cd ..\Brightlife-Django-Backend
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary pillow python-decouple django-cors-headers
pip freeze > requirements.txt
```

### Step 4: Configure Environment Variables

Create `.env` file in backend root:

```env
SECRET_KEY=your-secret-key-here-generate-with-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=brightlife_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ORIGINS=http://localhost:5173,https://ya-shuvo30.github.io
```

### Step 5: Create Membership App

```bash
python manage.py startapp membership
```

### Step 6: Copy Code from Guide

Open `BACKEND_IMPLEMENTATION_GUIDE.md` and copy:

1. **Django Settings** → `config/settings.py`
2. **Models** (updated version in Appendix) → `membership/models.py`
3. **Serializers** (updated version in Appendix) → `membership/serializers.py`
4. **Views** (updated version in Appendix) → `membership/views.py`
5. **URLs** → `membership/urls.py` and `config/urls.py`
6. **Admin** → `membership/admin.py`

### Step 7: Setup PostgreSQL Database

```bash
# Install PostgreSQL if not already installed
# Then create database:
psql -U postgres
CREATE DATABASE brightlife_db;
\q
```

### Step 8: Run Migrations

```bash
python manage.py makemigrations membership
python manage.py migrate
```

### Step 9: Create Superuser

```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@brightlife-bd.com
# Password: [your secure password]
```

### Step 10: Create Media Directories

```bash
mkdir -p media/photos
mkdir -p media/documents/age_proof
mkdir -p media/documents/licenses
mkdir -p media/medical_records
mkdir -p media/nominees/photos
mkdir -p media/nominees/id_proof
```

### Step 11: Start Django Server

```bash
python manage.py runserver
```

**Server will run at**: `http://localhost:8000`

---

## 🔗 Connect Frontend to Backend

### Step 1: Update Frontend Environment

Edit `brightlife-typescript-app/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

### Step 2: Start Both Servers

**Terminal 1 (Backend)**:
```bash
cd Brightlife-Django-Backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 (Frontend)**:
```bash
cd brightlife-typescript-app
npm run dev
```

### Step 3: Test Integration

1. Open browser: `http://localhost:5173/membership-form`
2. Fill out the form (all 5 steps)
3. Submit application
4. Check console for API response
5. Verify data in Django admin: `http://localhost:8000/admin/`

---

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Form loads without errors
- [ ] All 5 steps navigate correctly
- [ ] File uploads accept correct formats
- [ ] Validation messages appear
- [ ] Nominee share percentage validation (must be 100%)
- [ ] Success modal shows after submission
- [ ] PDF download works

### Backend Tests
- [ ] Django server starts without errors
- [ ] Admin panel accessible at `/admin/`
- [ ] Can login with superuser credentials
- [ ] Form submission creates database entry
- [ ] All files uploaded successfully
- [ ] Proposal number auto-generated
- [ ] Age auto-calculated from DOB
- [ ] Nominee share percentage validated (100% check)
- [ ] Email confirmation sent (if configured)

### Integration Tests
- [ ] No CORS errors in browser console
- [ ] API returns proposal number
- [ ] Files accessible via media URLs
- [ ] Application visible in Django admin
- [ ] All form fields saved correctly
- [ ] Nominees linked properly
- [ ] Medical records uploaded
- [ ] Status updates work

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
```python
# In Django settings.py, ensure:
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Add this
]
```

### Issue: Database Connection Error
**Error**: `could not connect to server: Connection refused`

**Solution**:
- Ensure PostgreSQL is running
- Check credentials in `.env` file
- Test connection: `psql -U postgres -d brightlife_db`

### Issue: File Upload Fails
**Error**: `413 Request Entity Too Large`

**Solution**:
```python
# In settings.py, increase limits:
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 15 * 1024 * 1024  # 15MB
```

### Issue: Media Files Not Accessible
**Error**: 404 on media file URLs

**Solution**:
```python
# In urls.py (development only):
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Issue: Nominee Share Validation
**Error**: `Total share must be 100%`

**Solution**: Ensure all 3 nominees' share percentages add up to exactly 100 in the frontend form.

---

## 📊 Expected API Response

### Success Response

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "proposalNo": "BLBD-20251117-0001",
    "status": "pending",
    "submittedAt": "2025-11-17T10:30:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "mobile": ["This field is required"],
    "nominees": ["Total share must be 100%. Current: 75%"]
  }
}
```

---

## 📁 File Structure (Backend)

```
Brightlife-Django-Backend/
├── config/
│   ├── settings.py          ✅ Configure this
│   ├── urls.py              ✅ Configure this
│   └── wsgi.py
├── membership/              ✅ Create this app
│   ├── models.py            ✅ Add updated models
│   ├── serializers.py       ✅ Add updated serializers
│   ├── views.py             ✅ Add updated views
│   ├── urls.py              ✅ Create this
│   ├── admin.py             ✅ Configure this
│   └── tests.py
├── media/                   ✅ Create directories
│   ├── photos/
│   ├── documents/
│   ├── medical_records/
│   └── nominees/
├── .env                     ✅ Create this (never commit)
├── requirements.txt         ✅ Generate this
└── manage.py
```

---

## 🎯 Field Mapping Quick Reference

| Frontend Field | Backend Field | Type |
|---------------|---------------|------|
| `membershipType` | `membership_type` | string |
| `nameBangla` | `name_bangla` | string |
| `nameEnglish` | `name_english` | string |
| `fatherName` | `father_name` | string |
| `mobile` | `mobile` | string |
| `dob` | `dob` | date |
| `ageProof` | `age_proof_types` | JSON array |
| `ageProofDoc` | `age_proof_doc` | file |
| `drivingLicense` | `driving_license` | choice |
| `licenseDoc` | `license_doc` | file |
| `maritalStatus` | `marital_status` | choice |
| `presentAddress` | `present_address` | text |
| `permanentAddress` | `permanent_address` | text |
| `acceptTerms` | `accept_terms` | boolean |

---

## 📞 Support & Resources

- **Backend Guide**: `BACKEND_IMPLEMENTATION_GUIDE.md` (complete code)
- **Django Docs**: https://docs.djangoproject.com/
- **DRF Docs**: https://www.django-rest-framework.org/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**Last Updated**: November 17, 2025  
**Status**: Ready for backend setup ✅
