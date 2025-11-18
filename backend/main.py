import json
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables once at startup
load_dotenv()
POSITIONSTACK_API_KEY = os.getenv("POSITIONSTACK_API_KEY")
WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY")

app = FastAPI()

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


def get_location(location):
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
        response = requests.get(URL, params=params, timeout=10)
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
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to location service timed out")
    except requests.exceptions.RequestException as e:
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

    # Handle coordinate format or city name
    if "%:%" in location:
        temp_location = get_location(location)
    else:
        temp_location = location

    if not WEATHERAPI_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    URL = "https://api.weatherapi.com/v1/current.json"
    params = {"key": WEATHERAPI_KEY, "q": temp_location}

    try:
        response = requests.get(URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Check if API returned an error
        if "error" in data:
            error_msg = data["error"].get("message", "Unknown error from weather API")
            raise HTTPException(status_code=400, detail=error_msg)

        return data
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to weather service timed out")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "positionstack_configured": bool(POSITIONSTACK_API_KEY),
        "weatherapi_configured": bool(WEATHERAPI_KEY)
    }
