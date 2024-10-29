import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for requests from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
# Example endpoint to process the input string
@app.post("/api/process")
async def process_string(input_data):
    processed_data = [word.upper() for word in input_data.text.split()]
    return {"processed_data": processed_data}

# Example endpoint to fetch initial items
@app.get("/api/items")
async def read_items():
    return [{"name": "Item 1"}, {"name": "Item 2"}]
"""

@app.get("/api/fetch_weather_data")
async def fetch_weather_data(location="Colombo"):
    API_key = "19bb1f0415cd489892d145152242810"
    URL = "http://api.weatherapi.com/v1/current.json"
    params = {"key": API_key, "q": f"{location}"}

    response = requests.get(URL, params=params)
    return response.json()