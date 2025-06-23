import json
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

app = FastAPI()

# Enable CORS for requests from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Address:
    def __init__(self,region:str,country:str):
        self._region = region
        self._country = country

    def __str__(self):
        return f"{self._region}, {self._country}"
    
    @property
    def region(self):
        return self._region
    
    @region.setter
    def region(self,region):
        if not region:
            raise ValueError
        self._region = region

    @property
    def country(self):
        return self._country
    
    @country.setter
    def country(self,country):
        if not country:
            raise ValueError
        self._country = country


def get_location(location):
    load_dotenv()
    API_key = os.getenv("POSITIONSTACK_API_KEY")
    URL = "http://api.positionstack.com/v1/reverse"
    params = {"access_key": API_key, "query":location.replace("%:%", ","), "limit":1}

    response = requests.get(URL, params=params)

    data = Address(
        region=response.json()["data"][0]["region"],
        country=response.json()["data"][0]["country"],
    )
    return f"{data.region}, {data.country}"


@app.get("/api/fetch_weather_data")
async def fetch_weather_data(location="paris"):
    if "%:%" in location:
        temp_location = get_location(location)
    else:
        temp_location = location
    load_dotenv()
    API_key = os.getenv("WEATHERAPI_KEY")
    URL = "http://api.weatherapi.com/v1/current.json"
    params = {"key": API_key, "q": f"{temp_location}"}

    response = requests.get(URL, params=params)
    return response.json()

# get_location("48.8584%:%2.2945")