# Django Backend CORS Configuration

**IMPORTANT:** Your Django backend MUST allow requests from GitHub Pages for the frontend to work.

## Quick Setup

### 1. Install django-cors-headers (if not already installed)

```bash
pip install django-cors-headers
```

### 2. Update Django `settings.py`

Add to `INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
    # ... rest of apps
]
```

Add to `MIDDLEWARE` (near the top, before CommonMiddleware):
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this line
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]
```

### 3. Configure CORS Origins

**Option A: Specific Origins (Recommended for Production)**
```python
CORS_ALLOWED_ORIGINS = [
    "https://yeasin-dev-me.github.io",  # GitHub Pages
    "http://localhost:5173",          # Vite dev server (local testing)
    "http://localhost:3000",          # Alternative dev port
]
```

**Option B: Allow All (Development Only - NOT SECURE)**
```python
CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ Use only for testing!
```

### 4. Additional CORS Settings (Optional)

```python
# Allow credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Allow specific HTTP methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Allow specific headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### 5. Test CORS Configuration

**From PowerShell:**
```powershell
# Test preflight OPTIONS request
Invoke-WebRequest -Uri "http://162.0.233.161/api/v1/membership/applications/" `
  -Method OPTIONS `
  -Headers @{
    "Origin" = "https://yeasin-dev-me.github.io"
    "Access-Control-Request-Method" = "POST"
  }
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: https://yeasin-dev-me.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: content-type, authorization
```

### 6. Restart Django Server

```bash
# Stop current server (Ctrl+C)

# Restart
python manage.py runserver 0.0.0.0:80
# Or if using production server:
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

## Troubleshooting

### CORS Error in Browser
**Symptom:** Console shows "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Verify `corsheaders` is in `INSTALLED_APPS`
2. Verify `CorsMiddleware` is in `MIDDLEWARE`
3. Check GitHub Pages URL is in `CORS_ALLOWED_ORIGINS`
4. Restart Django server

### Still Not Working?

**Debug CORS Settings:**
```python
# Add to settings.py temporarily for debugging
print("CORS_ALLOWED_ORIGINS:", CORS_ALLOWED_ORIGINS)
print("CORS_ALLOW_ALL_ORIGINS:", CORS_ALLOW_ALL_ORIGINS)
```

**Check Response Headers:**
```bash
curl -I -X OPTIONS http://162.0.233.161/api/v1/membership/applications/ \
  -H "Origin: https://yeasin-dev-me.github.io" \
  -H "Access-Control-Request-Method: POST"
```

## Production Checklist

- [x] Install `django-cors-headers`
- [x] Add to `INSTALLED_APPS`
- [x] Add middleware
- [x] Configure `CORS_ALLOWED_ORIGINS`
- [ ] Test from browser console
- [ ] Test form submission
- [ ] Test payment upload
- [ ] Remove `CORS_ALLOW_ALL_ORIGINS = True` if used

## Security Notes

⚠️ **Never use `CORS_ALLOW_ALL_ORIGINS = True` in production**

✅ **Best Practice:**
- Only allow specific trusted domains
- Use HTTPS in production
- Validate origin in middleware if needed
- Monitor CORS errors in logs

---

**Reference:** https://github.com/adamchainz/django-cors-headers

**Need Help?**
1. Check Django logs: `tail -f /var/log/django/error.log`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Test API directly: http://162.0.233.161/api/schema/swagger-ui/
