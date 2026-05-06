// Location utility for getting user's geolocation

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export async function getUserLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true, // Enable high accuracy for better location
        timeout: 10000, // Increased timeout for high accuracy
        maximumAge: 0, // Don't use cached location, get fresh data
      }
    );
  });
}

export async function getLocationName(lat: number, lon: number): Promise<{ city: string; country: string } | null> {
  try {
    // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AgroTech-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get location name');
    }

    const data = await response.json();

    // Try to get the most accurate city name from various address components
    const city = data.address?.city ||
                 data.address?.town ||
                 data.address?.municipality ||
                 data.address?.village ||
                 data.address?.county ||
                 data.address?.state_district ||
                 'Your Location';

    const country = data.address?.country || 'India';

    return { city, country };
  } catch (error) {
    console.error('Error getting location name:', error);
    return { city: 'Your Location', country: 'India' };
  }
}

export function saveLocation(location: LocationData) {
  localStorage.setItem('user_location', JSON.stringify(location));
}

export function getSavedLocation(): LocationData | null {
  const saved = localStorage.getItem('user_location');
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}
