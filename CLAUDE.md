# CLAUDE.md - AI Assistant Guide for Simple Weather App

This document provides comprehensive guidance for AI assistants working with the Simple Weather application codebase.

## Project Overview

Simple Weather is a full-stack web application that provides real-time weather information based on user location or search queries. The application uses browser geolocation to automatically detect the user's position and displays current weather conditions with detailed metrics.

**Live Deployment:**
- Frontend: https://lxnid.github.io/simple_weather/
- Backend API: https://simple-weather-868c.onrender.com/api

**License:** MIT

---

## Architecture

### High-Level Structure

```
simple_weather/
├── frontend/          # React SPA with Tailwind CSS
│   ├── public/       # Static assets and HTML shell
│   └── src/          # React components and utilities
├── backend/          # Python FastAPI server
│   ├── main.py      # Core API application
│   ├── .env         # Environment variables (API keys)
│   └── requirements.txt
├── README.md
├── LICENSE
└── CLAUDE.md        # This file
```

### Technology Stack

**Backend:**
- Python 3.13.0
- FastAPI (async web framework)
- Uvicorn (ASGI server)
- python-dotenv (environment management)
- requests (HTTP client)

**Frontend:**
- React 18.3.1 (via create-react-app)
- Tailwind CSS 3.4.14 (utility-first styling)
- React Icons 5.3.0
- PostCSS + Autoprefixer

**External APIs:**
- PositionStack API (reverse geocoding: coordinates → city)
- WeatherAPI (current weather data)

---

## Development Setup

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # Runs on http://127.0.0.1:8000
```

**Environment Variables Required:**
Create or verify `/backend/.env`:
```
POSITIONSTACK_API_KEY=your_key_here
WEATHERAPI_KEY=your_key_here
```

### Frontend Setup

```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

**Development API URL:**
The frontend is configured to use production API by default. For local development, update `App.js:15` to point to `http://127.0.0.1:8000/api`

---

## Key Files Reference

### Backend Files

| File | Purpose | Lines of Interest |
|------|---------|-------------------|
| `/backend/main.py` | FastAPI app, endpoints, CORS config | Entire file (~200 lines) |
| `/backend/.env` | API keys (PositionStack, WeatherAPI) | SECURITY: Should be in .gitignore |
| `/backend/requirements.txt` | Python dependencies | - |
| `/backend/runtime.txt` | Python version for deployment | - |

### Frontend Files

| File | Purpose | Lines of Interest |
|------|---------|-------------------|
| `/frontend/src/App.js` | Main React component, UI logic | Entire file (~150 lines) |
| `/frontend/src/current.js` | Geolocation utility function | Function `current()` |
| `/frontend/src/index.js` | React DOM entry point | - |
| `/frontend/src/index.css` | Tailwind directives, global styles | - |
| `/frontend/public/index.html` | HTML shell | - |
| `/frontend/tailwind.config.js` | Tailwind configuration | - |
| `/frontend/package.json` | Dependencies, scripts, homepage | - |

---

## API Structure

### Base URLs

- **Production:** `https://simple-weather-868c.onrender.com/api`
- **Development:** `http://127.0.0.1:8000/api`

### Endpoints

#### `GET /api/fetch_weather_data`

Fetches weather data for a specified location.

**Query Parameters:**
- `location` (string, default: "paris")
  - City name: `"London"`, `"New York"`, `"Tokyo"`
  - Coordinates format: `"latitude%:%longitude"` (URL encoded as `latitude,longitude`)
    - Example: `"51.5074%:%-0.1278"` for London

**Response Schema:**
```json
{
  "location": {
    "name": "London",
    "country": "United Kingdom",
    "lat": 51.52,
    "lon": -0.11,
    "localtime": "2024-10-28 15:30"
  },
  "current": {
    "temp_c": 15.0,
    "condition": {
      "text": "Partly cloudy",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
    },
    "humidity": 72,
    "precip_mm": 0.0,
    "wind_kph": 15.5,
    "pressure_mb": 1013.0,
    "uv": 4.0,
    "vis_km": 10.0
  }
}
```

**Error Response:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Data Flow

1. **Frontend → Backend:** User searches for location OR app auto-detects coordinates
2. **Backend → PositionStack:** If coordinates provided, reverse geocode to city/country
3. **Backend → WeatherAPI:** Fetch current weather for the location
4. **Backend → Frontend:** Return weather data JSON
5. **Frontend:** Display weather information with responsive UI

---

## Code Conventions & Patterns

### Backend Patterns (`/backend/main.py`)

1. **Environment Variables:**
   ```python
   from dotenv import load_dotenv
   import os

   load_dotenv()
   POSITIONSTACK_API_KEY = os.getenv("POSITIONSTACK_API_KEY")
   WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY")
   ```

2. **CORS Configuration:**
   ```python
   origins = [
       "https://lxnid.github.io/simple_weather/",
       "https://lxnid.github.io",
       "http://localhost:3000"
   ]

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_methods=["GET", "POST", "OPTIONS"],
       allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"]
   )
   ```

3. **Error Handling:**
   ```python
   try:
       # API call
   except Exception as e:
       raise HTTPException(status_code=500, detail=str(e))
   ```

4. **Class-based Models:**
   - `Address` class with property decorators
   - Getter/setter validation with `ValueError`

5. **Async Endpoints:**
   ```python
   @app.get("/api/fetch_weather_data")
   async def fetch_weather_data(location: str = "paris"):
       # Implementation
   ```

### Frontend Patterns (`/frontend/src/App.js`)

1. **React Hooks:**
   ```javascript
   const [weatherData, setWeatherData] = useState(null);
   const [error, setError] = useState(null);
   const [location, setLocation] = useState("");

   useEffect(() => {
       // Initial geolocation fetch
   }, []);
   ```

2. **API Calls:**
   ```javascript
   const response = await fetch(
       `https://simple-weather-868c.onrender.com/api/fetch_weather_data?location=${encodedLocation}`
   );
   ```

3. **Tailwind CSS Utility Classes:**
   ```javascript
   <div className="flex flex-col lg:flex-row h-screen">
     <div className="lg:w-1/2 w-full">
       {/* Mobile-first responsive design */}
     </div>
   </div>
   ```

4. **Error Handling:**
   ```javascript
   if (!response.ok) {
       throw new Error("Failed to fetch weather data");
   }
   setError(null);  // Clear previous errors on success
   ```

5. **Dynamic Styling:**
   ```javascript
   <div
     style={{ backgroundImage: `url(${weatherData.current.condition.icon})` }}
     className="bg-cover bg-center"
   >
   ```

### Git Commit Conventions

The repository follows conventional commit format:

- `fix(scope):` - Bug fixes
  - Example: `fix(cors): add domain to allowed origins`
- `chore:` - Maintenance tasks
  - Example: `chore: update API URL to production endpoint`
- `feat:` - New features
- `update:` - Feature enhancements
- `docs:` - Documentation changes

**Scope examples:** cors, security, api, ui

---

## Common Development Tasks

### Adding a New Frontend Feature

1. Modify `/frontend/src/App.js` (single component architecture)
2. Update state if needed using `useState`
3. Add Tailwind utility classes for styling
4. Test responsiveness at `lg:` breakpoint (1024px)
5. Run `npm start` to verify changes
6. Build with `npm run build` before deployment

### Adding a New Backend Endpoint

1. Add endpoint in `/backend/main.py`
2. Use `async def` for async operations
3. Add endpoint to CORS allowed methods if needed
4. Use `HTTPException` for error responses
5. Test with `uvicorn main:app --reload`
6. Update this documentation with endpoint details

### Updating Dependencies

**Backend:**
```bash
cd backend
pip install package_name
pip freeze > requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install package_name
# package.json is updated automatically
```

### Testing API Locally

```bash
# Start backend
cd backend
uvicorn main:app --reload

# Test endpoint
curl "http://127.0.0.1:8000/api/fetch_weather_data?location=London"
```

### Deployment

**Frontend (GitHub Pages):**
```bash
cd frontend
npm run deploy  # Builds and pushes to gh-pages branch
```

**Backend (Render.com):**
- Deployment is automated via git push
- Ensure environment variables are set in Render dashboard
- Runtime specified in `runtime.txt`

---

## Security Considerations

### Current Security Issues

1. **API Keys Exposed in Git:**
   - `/backend/.env` contains API keys but is currently tracked in git
   - **ACTION REQUIRED:** Add `.env` to `/backend/.gitignore`
   - **ACTION REQUIRED:** Rotate API keys after fixing

2. **Recommended Fix:**
   ```bash
   echo ".env" >> backend/.gitignore
   git rm --cached backend/.env
   git commit -m "fix(security): remove .env from version control"
   ```

3. **Environment Variable Management:**
   - Local development: Use `/backend/.env`
   - Production: Set environment variables in Render dashboard
   - Never commit API keys to version control

### CORS Policy

The backend explicitly allows only these origins:
- `https://lxnid.github.io/simple_weather/`
- `https://lxnid.github.io`
- `http://localhost:3000`

When adding new frontend domains, update the `origins` list in `/backend/main.py`

### API Rate Limits

Be aware of external API limitations:
- **PositionStack:** Free tier has rate limits
- **WeatherAPI:** Free tier has rate limits

Implement caching if needed to reduce API calls.

---

## Important Notes for AI Assistants

### When Making Changes

1. **Always read files before editing** - Use Read tool before Edit/Write
2. **Preserve existing patterns** - Follow the conventions documented above
3. **Test locally** - Ensure changes work in development before committing
4. **Update documentation** - If API changes, update this file
5. **Security first** - Never commit secrets or API keys

### File Organization

- **Single Component Architecture:** Frontend uses one main component (`App.js`)
- **No State Management Library:** Uses React hooks only (no Redux/Context)
- **Flat Structure:** Minimal directory nesting for simplicity
- **Separation of Concerns:** Frontend and backend are completely separate

### Testing Strategy

**Frontend:**
```bash
cd frontend
npm test  # Runs React Testing Library tests
npm run build  # Verify production build works
```

**Backend:**
```bash
cd backend
# Manual testing via curl or browser
# Consider adding pytest for unit tests (not currently implemented)
```

### Common Pitfalls

1. **CORS Errors:** If adding new frontend domain, update CORS origins in backend
2. **API URL Mismatch:** Frontend hardcodes production API URL - change for local dev
3. **Coordinate Format:** Must use `latitude%:%longitude` format, not `lat,lng`
4. **Environment Variables:** Backend needs `.env` file to function
5. **Node Modules:** Never commit `/frontend/node_modules/` (already in .gitignore)

### Code Quality Checklist

Before committing:
- [ ] Code follows existing patterns and conventions
- [ ] No hardcoded secrets or API keys
- [ ] CORS configuration updated if needed
- [ ] Error handling implemented
- [ ] Responsive design maintained (mobile and desktop)
- [ ] No console.log statements in production code
- [ ] Dependencies properly listed in requirements.txt or package.json

---

## Troubleshooting

### Common Issues

**"Failed to fetch weather data" Error:**
- Check backend is running
- Verify CORS configuration includes your frontend domain
- Check API keys are valid in `.env`
- Verify network connectivity to external APIs

**Geolocation Not Working:**
- Browser must support geolocation API
- User must grant location permissions
- HTTPS required for geolocation (works on localhost too)
- Fallback to "paris" if geolocation fails

**CORS Policy Error:**
- Frontend domain must be in `origins` list in `/backend/main.py`
- OPTIONS method must be allowed
- Check browser console for specific CORS error

**Tailwind Styles Not Applying:**
- Verify PostCSS is configured (`postcss.config.js`)
- Check Tailwind directives in `index.css`
- Run `npm start` to rebuild with Tailwind

---

## Project Structure Visualization

```
Simple Weather App
│
├─── Frontend (React SPA)
│    │
│    ├─── User Interface
│    │    ├─ Location Search Input
│    │    ├─ Weather Display Card
│    │    ├─ Metrics Panel (temp, humidity, etc.)
│    │    └─ Responsive Layout (mobile/desktop)
│    │
│    └─── Utilities
│         └─ Geolocation API Integration
│
├─── Backend (FastAPI)
│    │
│    ├─── Endpoints
│    │    └─ GET /api/fetch_weather_data
│    │
│    ├─── External API Integration
│    │    ├─ PositionStack (reverse geocoding)
│    │    └─ WeatherAPI (weather data)
│    │
│    └─── Configuration
│         ├─ CORS Middleware
│         └─ Environment Variables
│
└─── Deployment
     ├─ Frontend → GitHub Pages
     └─ Backend → Render.com
```

---

## Quick Reference

### Useful Commands

```bash
# Backend
cd backend
pip install -r requirements.txt        # Install dependencies
uvicorn main:app --reload              # Run development server
python -m pytest                       # Run tests (if added)

# Frontend
cd frontend
npm install                            # Install dependencies
npm start                              # Run development server (port 3000)
npm run build                          # Create production build
npm run deploy                         # Deploy to GitHub Pages
npm test                               # Run tests

# Git
git status                             # Check current status
git add .                              # Stage changes
git commit -m "type(scope): message"   # Commit with convention
git push -u origin branch-name         # Push to remote
```

### Key Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `POSITIONSTACK_API_KEY` | `/backend/.env` | Reverse geocoding API key |
| `WEATHERAPI_KEY` | `/backend/.env` | Weather data API key |

### File Size Guidelines

- Keep components under 200 lines when possible
- Split large components into smaller ones if complexity grows
- Consider creating `/frontend/src/components/` for multiple components
- Backend endpoints can be modularized into separate route files

---

## Version Information

**Current Stack Versions:**
- Python: 3.13.0
- FastAPI: Latest (check requirements.txt)
- React: 18.3.1
- Tailwind CSS: 3.4.14
- Node.js: Check with `node --version` (not specified in repo)

**Browser Compatibility:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires geolocation API support

---

## Future Considerations

### Potential Enhancements

1. **Backend:**
   - Add caching layer (Redis) to reduce API calls
   - Implement rate limiting middleware
   - Add comprehensive error logging
   - Create pytest test suite
   - Add /health endpoint for monitoring
   - Implement API versioning (/api/v1/...)

2. **Frontend:**
   - Add loading states and spinners
   - Implement 5-day forecast view
   - Add temperature unit toggle (°C/°F)
   - Store recent searches in localStorage
   - Add PWA offline support
   - Implement error boundary component
   - Add accessibility improvements (ARIA labels)

3. **DevOps:**
   - Add CI/CD pipeline (GitHub Actions)
   - Implement automated testing
   - Add environment-specific configurations
   - Set up monitoring and alerting
   - Add Docker containerization

4. **Security:**
   - Implement backend API key rotation
   - Add request rate limiting
   - Implement input sanitization
   - Add CSP headers
   - Regular dependency security audits

---

## Contact & Resources

**Repository:** Check git remote for repository URL

**External Documentation:**
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WeatherAPI Docs](https://www.weatherapi.com/docs/)
- [PositionStack Docs](https://positionstack.com/documentation)

**License:** MIT - See LICENSE file for full text

---

**Last Updated:** 2025-11-18
**Document Version:** 1.0.0

This document should be updated whenever significant architectural changes, new patterns, or important conventions are introduced to the codebase.
