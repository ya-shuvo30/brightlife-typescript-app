# VPS Backend Connection Guide

## Production Backend Server

**VPS IP:** `162.0.233.161`  
**Base URL:** `http://162.0.233.161/api` (HTTP - SSL to be configured)

⚠️ **Note:** Currently using HTTP. Browsers may show mixed content warnings when frontend (HTTPS) calls backend (HTTP). This is temporary until SSL is configured.

### Available API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/` | GET | API Root |
| `/api/v1/users/` | GET/POST | User Management |
| `/api/v1/membership/applications/` | POST | Submit Membership |
| `/api/v1/payment/proof/` | POST | Submit Payment Proof |
| `/api/auth/token/` | POST | JWT Authentication |
| `/admin/` | GET | Admin Panel |
| `/api/schema/swagger-ui/` | GET | API Documentation |

## Frontend Configuration

### Environment Setup

**Production (.env.production):**
```env
VITE_API_BASE_URL=http://162.0.233.161/api
VITE_USE_MOCK_API=false
```

**Local Development (.env.local):**
```env
VITE_API_BASE_URL=http://162.0.233.161/api
VITE_USE_MOCK_API=false
```

## CORS Configuration Required

Your Django backend must allow requests from GitHub Pages:

**In Django `settings.py`:**
```python
CORS_ALLOWED_ORIGINS = [
    "https://ya-shuvo30.github.io",
    "http://localhost:5173",  # Vite dev server
]

# Or allow all (not recommended for production)
CORS_ALLOW_ALL_ORIGINS = True
```

## Deployment Steps

### 1. Build for Production
```bash
npm run build
```

### 2. Test Production Build Locally
```bash
npm run preview
```

### 3. Deploy to GitHub Pages
```bash
git add .
git commit -m "feat: Connect to VPS backend server"
git push origin main
```

### 4. Verify Deployment
- GitHub Actions will automatically build and deploy
- Check: https://ya-shuvo30.github.io/brightlife-typescript-app/
- Monitor GitHub Actions tab for deployment status

## Testing Backend Connection

### Test from Browser Console:
```javascript
// Test API connectivity
fetch('http://162.0.233.161/api/v1/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Test with curl:
```bash
# Test API root
curl http://162.0.233.161/api/v1/

# Test membership endpoint
curl -X POST http://162.0.233.161/api/v1/membership/applications/ \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Troubleshooting

### CORS Errors
**Symptom:** Browser console shows "CORS policy" errors  
**Solution:** Add GitHub Pages domain to Django CORS_ALLOWED_ORIGINS

### Connection Timeout
**Symptom:** Request takes 30s then fails  
**Solution:** Check VPS firewall allows HTTP traffic on port 80

### 404 Not Found
**Symptom:** API returns 404 for endpoints  
**Solution:** Verify Django URLs routing matches frontend API calls

### Network Error
**Symptom:** "Network error. Please check your connection"  
**Solution:** Verify VPS server is running and accessible

## Security Notes

⚠️ **HTTP (Not HTTPS):** Current setup uses HTTP. For production, configure SSL/TLS:
- Use Let's Encrypt for free SSL certificate
- Configure Nginx/Apache as reverse proxy with SSL
- Update frontend to `https://yourdomain.com/api/v1`

⚠️ **Firewall:** Ensure VPS firewall allows:
- Port 80 (HTTP)
- Port 443 (HTTPS - when configured)
- Port 22 (SSH - restrict to your IP)

## Monitoring

### Check Backend Health:
```bash
# API Status
curl http://162.0.233.161/api/v1/

# Server Response Time
curl -w "\nTime: %{time_total}s\n" http://162.0.233.161/api/v1/
```

### GitHub Pages Status:
- Repository → Settings → Pages
- Check deployment status in Actions tab

## Next Steps

1. ✅ Configure CORS on Django backend
2. ✅ Build and deploy frontend
3. ✅ Test membership form submission
4. ✅ Test payment proof upload
5. 🔒 Setup SSL/HTTPS (recommended)
6. 📊 Configure monitoring/logging
7. 🔐 Implement rate limiting
8. 💾 Setup database backups

---

**Last Updated:** November 25, 2025  
**Frontend:** https://ya-shuvo30.github.io/brightlife-typescript-app/  
**Backend:** http://162.0.233.161/api/v1/
