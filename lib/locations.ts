/**
 * Airport and city location data
 * In production, this would come from an API or database
 */

export interface Location {
  code: string; // Airport code (e.g., "JFK") or city code
  name: string; // Display name
  city: string; // City name
  country: string; // Country name
  type: 'airport' | 'city';
}

/**
 * Popular airports and cities for autocomplete
 */
export const POPULAR_LOCATIONS: Location[] = [
  // US Airports
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', type: 'airport' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', type: 'airport' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States', type: 'airport' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States', type: 'airport' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', type: 'airport' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States', type: 'airport' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'United States', type: 'airport' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States', type: 'airport' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'United States', type: 'airport' },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'United States', type: 'airport' },
  
  // European Airports
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom', type: 'airport' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', type: 'airport' },
  { code: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Germany', type: 'airport' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', type: 'airport' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Spain', type: 'airport' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino', city: 'Rome', country: 'Italy', type: 'airport' },
  { code: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'Spain', type: 'airport' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', type: 'airport' },
  { code: 'ZUR', name: 'Zurich', city: 'Zurich', country: 'Switzerland', type: 'airport' },
  
  // Asian Airports
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', type: 'airport' },
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', type: 'airport' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', type: 'airport' },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', type: 'airport' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', type: 'airport' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', type: 'airport' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', type: 'airport' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', type: 'airport' },
  
  // Cities (for hotels/stays)
  { code: 'NYC', name: 'New York', city: 'New York', country: 'United States', type: 'city' },
  { code: 'LON', name: 'London', city: 'London', country: 'United Kingdom', type: 'city' },
  { code: 'PAR', name: 'Paris', city: 'Paris', country: 'France', type: 'city' },
  { code: 'ROM', name: 'Rome', city: 'Rome', country: 'Italy', type: 'city' },
  { code: 'BCN', name: 'Barcelona', city: 'Barcelona', country: 'Spain', type: 'city' },
  { code: 'BER', name: 'Berlin', city: 'Berlin', country: 'Germany', type: 'city' },
  { code: 'AMS', name: 'Amsterdam', city: 'Amsterdam', country: 'Netherlands', type: 'city' },
  { code: 'MAD', name: 'Madrid', city: 'Madrid', country: 'Spain', type: 'city' },
  { code: 'VIE', name: 'Vienna', city: 'Vienna', country: 'Austria', type: 'city' },
  { code: 'PRG', name: 'Prague', city: 'Prague', country: 'Czech Republic', type: 'city' },
  { code: 'BUD', name: 'Budapest', city: 'Budapest', country: 'Hungary', type: 'city' },
  { code: 'ATH', name: 'Athens', city: 'Athens', country: 'Greece', type: 'city' },
  { code: 'LIS', name: 'Lisbon', city: 'Lisbon', country: 'Portugal', type: 'city' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', type: 'city' },
  { code: 'STO', name: 'Stockholm', city: 'Stockholm', country: 'Sweden', type: 'city' },
  { code: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', type: 'city' },
  { code: 'OSL', name: 'Oslo', city: 'Oslo', country: 'Norway', type: 'city' },
  { code: 'HEL', name: 'Helsinki', city: 'Helsinki', country: 'Finland', type: 'city' },
  { code: 'WAW', name: 'Warsaw', city: 'Warsaw', country: 'Poland', type: 'city' },
  { code: 'KRA', name: 'Krakow', city: 'Krakow', country: 'Poland', type: 'city' },
];

/**
 * Search locations by query string
 */
export function searchLocations(query: string, type?: 'airport' | 'city'): Location[] {
  if (!query || query.length < 2) {
    return POPULAR_LOCATIONS.slice(0, 10); // Return top 10 popular locations
  }

  const lowerQuery = query.toLowerCase();
  const filtered = POPULAR_LOCATIONS.filter(loc => {
    if (type && loc.type !== type) return false;
    
    return (
      loc.code.toLowerCase().includes(lowerQuery) ||
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.city.toLowerCase().includes(lowerQuery) ||
      loc.country.toLowerCase().includes(lowerQuery)
    );
  });

  // Sort by relevance (exact matches first, then partial matches)
  return filtered.sort((a, b) => {
    const aExact = a.code.toLowerCase() === lowerQuery || a.city.toLowerCase() === lowerQuery;
    const bExact = b.code.toLowerCase() === lowerQuery || b.city.toLowerCase() === lowerQuery;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return 0;
  }).slice(0, 10);
}

/**
 * Get location by code
 */
export function getLocationByCode(code: string): Location | undefined {
  return POPULAR_LOCATIONS.find(loc => loc.code === code.toUpperCase());
}

/**
 * Format location for display
 */
export function formatLocation(location: Location): string {
  if (location.type === 'airport') {
    return `${location.code} - ${location.name}, ${location.city}`;
  }
  return `${location.name}, ${location.country}`;
}

