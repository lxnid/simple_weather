import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from cachetools import TTLCache

# Load environment variables once at startup
load_dotenv()
POSITIONSTACK_API_KEY = os.getenv("POSITIONSTACK_API_KEY")
WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY")

app = FastAPI()

# Initialize cache with 10-minute TTL, max 100 entries
weather_cache = TTLCache(maxsize=100, ttl=600)  # 10 minutes
forecast_cache = TTLCache(maxsize=100, ttl=1800)  # 30 minutes for forecast

# Enable CORS for requests from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://lxnid.github.io/simple_weather/",
        "https://lxnid.github.io",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"]
)


async def get_location(location: str):
    """
    Reverse geocode coordinates to city/country using PositionStack API.

    Args:
        location: String in format "latitude%:%longitude"

    Returns:
        String in format "City, Country"

    Raises:
        HTTPException: If location not found or API error
    """
    if not POSITIONSTACK_API_KEY:
        raise HTTPException(status_code=500, detail="PositionStack API key not configured")

    URL = "https://api.positionstack.com/v1/reverse"
    params = {
        "access_key": POSITIONSTACK_API_KEY,
        "query": location.replace("%:%", ","),
        "limit": 1
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(URL, params=params, timeout=10.0)
            response.raise_for_status()
            json_data = response.json()

            if "data" in json_data and json_data["data"] and len(json_data["data"]) > 0:
                region = json_data["data"][0].get("region", "Unknown")
                country = json_data["data"][0].get("country", "Unknown")
                return f"{region}, {country}"
            else:
                raise HTTPException(
                    status_code=404,
                    detail="Location not found. Please check your coordinates."
                )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to location service timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Location service error: {str(e)}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching location data: {str(e)}")


@app.get("/api/fetch_weather_data")
async def fetch_weather_data(location: str = "paris"):
    """
    Fetch current weather data for a given location.

    Args:
        location: City name (e.g., "London") or coordinates in format "latitude%:%longitude"

    Returns:
        JSON object with weather data

    Raises:
        HTTPException: If validation fails or API error
    """
    # Input validation
    if not location or location.strip() == "":
        raise HTTPException(status_code=400, detail="Location parameter cannot be empty")

    location = location.strip()

    # Check if location is too long (prevent abuse)
    if len(location) > 200:
        raise HTTPException(status_code=400, detail="Location parameter too long")

    # Check cache first
    cache_key = location.lower()
    if cache_key in weather_cache:
        return weather_cache[cache_key]

    # Handle coordinate format or city name
    if "%:%" in location:
        temp_location = await get_location(location)
    else:
        temp_location = location

    if not WEATHERAPI_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    URL = "https://api.weatherapi.com/v1/current.json"
    params = {"key": WEATHERAPI_KEY, "q": temp_location}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(URL, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            # Check if API returned an error
            if "error" in data:
                error_msg = data["error"].get("message", "Unknown error from weather API")
                raise HTTPException(status_code=400, detail=error_msg)

            # Cache the successful response
            weather_cache[cache_key] = data

            return data
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to weather service timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Weather service error: {str(e)}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")


@app.get("/api/fetch_forecast_data")
async def fetch_forecast_data(location: str = "paris", days: int = 5):
    """
    Fetch weather forecast data for a given location.

    Args:
        location: City name (e.g., "London") or coordinates in format "latitude%:%longitude"
        days: Number of days for forecast (1-10, default 5)

    Returns:
        JSON object with forecast data

    Raises:
        HTTPException: If validation fails or API error
    """
    # Input validation
    if not location or location.strip() == "":
        raise HTTPException(status_code=400, detail="Location parameter cannot be empty")

    location = location.strip()

    # Validate days parameter
    if days < 1 or days > 10:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 10")

    # Check if location is too long (prevent abuse)
    if len(location) > 200:
        raise HTTPException(status_code=400, detail="Location parameter too long")

    # Check cache first
    cache_key = f"{location.lower()}_{days}"
    if cache_key in forecast_cache:
        return forecast_cache[cache_key]

    # Handle coordinate format or city name
    if "%:%" in location:
        temp_location = await get_location(location)
    else:
        temp_location = location

    if not WEATHERAPI_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    URL = "https://api.weatherapi.com/v1/forecast.json"
    params = {"key": WEATHERAPI_KEY, "q": temp_location, "days": days}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(URL, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            # Check if API returned an error
            if "error" in data:
                error_msg = data["error"].get("message", "Unknown error from weather API")
                raise HTTPException(status_code=400, detail=error_msg)

            # Cache the successful response
            forecast_cache[cache_key] = data

            return data
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to weather service timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Weather service error: {str(e)}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast data: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "positionstack_configured": bool(POSITIONSTACK_API_KEY),
        "weatherapi_configured": bool(WEATHERAPI_KEY),
        "weather_cache_size": len(weather_cache),
        "weather_cache_max": weather_cache.maxsize,
        "forecast_cache_size": len(forecast_cache),
        "forecast_cache_max": forecast_cache.maxsize
    }


@app.get("/api/cache/clear")
async def clear_cache():
    """Clear both weather and forecast caches (for debugging/admin use)"""
    weather_cache.clear()
    forecast_cache.clear()
    return {"status": "cache cleared", "message": "All caches have been cleared successfully"}
