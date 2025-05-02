import axios from 'axios';
import promptSync from 'prompt-sync';
require('dotenv').config();


interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}

const apiKey = process.env.GOOGLE_API_KEY; 

const getUserInput = (): string => {
  const prompt = promptSync();
  return prompt('Enter a place to get latitude and longitude: ');
};

const fetchGeocode = async (placeName: string): Promise<{ lat: number; lng: number } | null> => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  try {
    const response = await axios.get<GeocodeResponse>(baseUrl, {
      params: {
        address: placeName,
        key: apiKey
      }
    });

    if (response.data.status === 'OK') {
      return response.data.results[0].geometry.location;
    } else {
      console.error(`Geocoding failed with status: ${response.data.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching geocode:', error);
    return null;
  }
};

const handleGeocodeLookup = async (): Promise<void> => {
  const placeName = getUserInput();

  if (!placeName) {
    console.error('No place name provided.');
    return;
  }

  const coordinates = await fetchGeocode(placeName);

  if (coordinates) {
    console.log(`Latitude: ${coordinates.lat}`);
    console.log(`Longitude: ${coordinates.lng}`);
  }
};

handleGeocodeLookup();
