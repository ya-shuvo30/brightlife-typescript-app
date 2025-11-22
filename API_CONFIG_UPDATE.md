# API Configuration Update - Real Backend by Default

## Changes Made

### 1. API Service Layer Updates

**Updated Files:**
- `src/services/api/membershipAPI.ts`
- `src/services/api/paymentAPI.ts`

**Change:**
```typescript
// OLD (Mock by default)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Default: true

// NEW (Real backend by default)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'; // Default: false
```

### 2. Environment Configuration

**`.env.local`** (already configured):
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false  # Real backend by default
```

**`.env.example`** (updated):
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false  # Mock API disabled by default
```

### 3. Documentation Updates

**Updated:**
- `PAYMENT_API_INTEGRATION.md` - Reflects real backend as default
- `.github/copilot-instructions.md` - Updated API configuration sections

## Behavior

### Default (Real Backend)
- Application connects to Django backend at `http://localhost:8000/api`
- All API calls go to real server
- Requires Django backend to be running
- No environment variable needed (default behavior)

### Mock Mode (Testing)
To enable mock API for frontend-only testing:

**.env.local:**
```env
VITE_USE_MOCK_API=true
```

Then restart dev server:
```bash
npm run dev
```

## API Endpoints Expected

The frontend expects these Django backend endpoints:

### Membership API
- `POST /api/v1/membership/submit` - Submit membership application
- `GET /api/v1/membership/types` - Get membership types/plans

### Payment API
- `POST /api/v1/payment/proof/` - Submit payment proof
- `GET /api/v1/payment/proof/:transactionId` - Get payment status

## Development Workflow

### With Django Backend (Default)
1. Start Django backend:
   ```bash
   cd ../brightlife-django-backend
   python manage.py runserver
   ```

2. Start React frontend:
   ```bash
   npm run dev
   ```

3. Frontend automatically connects to `http://localhost:8000/api`

### Without Backend (Mock Mode)
1. Set `VITE_USE_MOCK_API=true` in `.env.local`
2. Start frontend only:
   ```bash
   npm run dev
   ```
3. All API calls are mocked with 1.5s delay

## Verification

After restarting the dev server, you can verify the configuration:

1. Open browser console
2. Submit a payment or membership form
3. Check the console logs:
   - **Mock mode**: You'll see `📝 Mock API: ...` logs
   - **Real backend**: You'll see actual API request logs

## Next Steps

✅ Real backend is now the default
✅ Mock mode available for testing (opt-in)
✅ Documentation updated
✅ Environment files configured

**To test with real backend:**
1. Ensure Django backend is running on port 8000
2. Restart Vite dev server: `npm run dev`
3. Submit a form to test the connection

**If backend is not ready:**
- Set `VITE_USE_MOCK_API=true` in `.env.local`
- Restart dev server
- Continue frontend development with mock API
