/**
 * Nearby airports functionality
 * Finds airports near a given airport code or city
 */

import { Location, getLocationByCode, searchLocations } from './locations';

/**
 * Airport proximity groups - airports that are close to each other
 * In production, this would use actual geographic coordinates and distance calculations
 */
const AIRPORT_GROUPS: Record<string, string[]> = {
  // New York area
  'JFK': ['LGA', 'EWR', 'JFK'],
  'LGA': ['JFK', 'EWR', 'LGA'],
  'EWR': ['JFK', 'LGA', 'EWR'],
  
  // London area
  'LHR': ['LGW', 'STN', 'LTN', 'LHR'],
  'LGW': ['LHR', 'STN', 'LTN', 'LGW'],
  'STN': ['LHR', 'LGW', 'LTN', 'STN'],
  
  // Paris area
  'CDG': ['ORY', 'CDG'],
  'ORY': ['CDG', 'ORY'],
  
  // Tokyo area
  'NRT': ['HND', 'NRT'],
  'HND': ['NRT', 'HND'],
  
  // Los Angeles area
  'LAX': ['BUR', 'SNA', 'ONT', 'LAX'],
  'BUR': ['LAX', 'SNA', 'ONT', 'BUR'],
  'SNA': ['LAX', 'BUR', 'ONT', 'SNA'],
  
  // San Francisco area
  'SFO': ['OAK', 'SJC', 'SFO'],
  'OAK': ['SFO', 'SJC', 'OAK'],
  'SJC': ['SFO', 'OAK', 'SJC'],
  
  // Chicago area
  'ORD': ['MDW', 'ORD'],
  'MDW': ['ORD', 'MDW'],
  
  // Miami area
  'MIA': ['FLL', 'PBI', 'MIA'],
  'FLL': ['MIA', 'PBI', 'FLL'],
  
  // Dallas area
  'DFW': ['DAL', 'DFW'],
  'DAL': ['DFW', 'DAL'],
  
  // Washington DC area
  'DCA': ['IAD', 'BWI', 'DCA'],
  'IAD': ['DCA', 'BWI', 'IAD'],
  'BWI': ['DCA', 'IAD', 'BWI'],
  
  // Berlin area
  'BER': ['SXF', 'TXL', 'BER'],
  
  // Rome area
  'FCO': ['CIA', 'FCO'],
  
  // Barcelona area
  'BCN': ['GRO', 'BCN'],
};

/**
 * Find nearby airports for a given airport code
 * Returns array of airport codes including the original
 */
export function getNearbyAirports(airportCode: string): string[] {
  const code = airportCode.toUpperCase();
  
  // Check if we have a predefined group
  if (AIRPORT_GROUPS[code]) {
    return AIRPORT_GROUPS[code];
  }
  
  // Try to find by city - if airports share the same city, they're nearby
  const location = getLocationByCode(code);
  if (location && location.type === 'airport') {
    const cityAirports = searchLocations(location.city, 'airport')
      .filter(loc => loc.type === 'airport')
      .map(loc => loc.code);
    
    if (cityAirports.length > 0) {
      return cityAirports;
    }
  }
  
  // Default: return just the original airport
  return [code];
}

/**
 * Get all nearby airport locations (full Location objects)
 */
export function getNearbyAirportLocations(airportCode: string): Location[] {
  const codes = getNearbyAirports(airportCode);
  return codes
    .map(code => getLocationByCode(code))
    .filter((loc): loc is Location => loc !== undefined);
}

/**
 * Format nearby airports for display
 */
export function formatNearbyAirports(airportCode: string): string {
  const nearby = getNearbyAirports(airportCode);
  if (nearby.length <= 1) {
    return airportCode;
  }
  return nearby.join(', ');
}

/**
 * Check if an airport code is in a nearby airports list
 */
export function isNearbyAirport(airportCode: string, nearbyList: string[]): boolean {
  return nearbyList.includes(airportCode.toUpperCase());
}

