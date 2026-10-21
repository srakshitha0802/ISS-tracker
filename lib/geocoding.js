/**
 * Offline Geospatial Region & Ocean Classifier
 * Accurately determines the body of water, territory, or continent directly from coordinates.
 * Pure text and categorical metadata without emojis.
 */

export function getGeographicRegion(lat, lon) {
  if (lat === null || lat === undefined || lon === null || lon === undefined) {
    return { name: 'Orbiting Earth', category: 'space', code: 'SPACE' };
  }

  // Major Geographic Bounding Boxes
  // Australia & New Zealand
  if (lat >= -44 && lat <= -10 && lon >= 112 && lon <= 155) {
    return { name: 'Australia & Coral Sea', category: 'land', code: 'AU' };
  }
  if (lat >= -47 && lat <= -34 && lon >= 165 && lon <= 179) {
    return { name: 'New Zealand Region', category: 'land', code: 'NZ' };
  }

  // North America
  if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -67) {
    return { name: 'United States & Canada', category: 'land', code: 'US_CA' };
  }
  if (lat >= 14 && lat <= 32 && lon >= -117 && lon <= -86) {
    return { name: 'Mexico & Central America', category: 'land', code: 'MX_CAM' };
  }

  // South America
  if (lat >= -56 && lat <= 12 && lon >= -82 && lon <= -34) {
    if (lat >= -15 && lat <= 5 && lon >= -75 && lon <= -45) {
      return { name: 'Amazon Rainforest Basin', category: 'land', code: 'AMAZON' };
    }
    return { name: 'South American Continent', category: 'land', code: 'SA' };
  }

  // Europe & Mediterranean
  if (lat >= 36 && lat <= 52 && lon >= -10 && lon <= 35) {
    return { name: 'European Territory', category: 'land', code: 'EU' };
  }

  // Africa
  if (lat >= 15 && lat <= 35 && lon >= -17 && lon <= 36) {
    return { name: 'Sahara Desert, North Africa', category: 'land', code: 'SAHARA' };
  }
  if (lat >= -35 && lat < 15 && lon >= 10 && lon <= 50) {
    return { name: 'Sub-Saharan Africa', category: 'land', code: 'AFRICA' };
  }

  // Asia
  if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
    return { name: 'Indian Subcontinent & Bay of Bengal', category: 'land', code: 'IN' };
  }
  if (lat >= 20 && lat <= 52 && lon >= 98 && lon <= 135) {
    return { name: 'East Asia Territory', category: 'land', code: 'EAST_ASIA' };
  }
  if (lat >= 12 && lat <= 42 && lon >= 34 && lon <= 60) {
    return { name: 'Arabian Peninsula & Middle East', category: 'land', code: 'MIDDLE_EAST' };
  }
  if (lat >= -11 && lat <= 20 && lon >= 95 && lon <= 140) {
    return { name: 'Southeast Asian Archipelago', category: 'land', code: 'SE_ASIA' };
  }

  // Major Oceans
  if (lon >= 100 || lon <= -120) {
    if (lat > 0) {
      return { name: 'North Pacific Ocean', category: 'ocean', code: 'N_PACIFIC' };
    } else if (lat < -40) {
      return { name: 'Southern Ocean (Pacific Sector)', category: 'ocean', code: 'S_OCEAN' };
    }
    return { name: 'South Pacific Ocean', category: 'ocean', code: 'S_PACIFIC' };
  }

  if (lon >= -75 && lon <= 20) {
    if (lat > 0) {
      return { name: 'North Atlantic Ocean', category: 'ocean', code: 'N_ATLANTIC' };
    } else if (lat < -40) {
      return { name: 'Southern Ocean (Atlantic Sector)', category: 'ocean', code: 'S_OCEAN' };
    }
    return { name: 'South Atlantic Ocean', category: 'ocean', code: 'S_ATLANTIC' };
  }

  if (lon >= 20 && lon < 100) {
    if (lat < -40) {
      return { name: 'Southern Ocean (Indian Sector)', category: 'ocean', code: 'S_OCEAN' };
    }
    return { name: 'Indian Ocean Basin', category: 'ocean', code: 'INDIAN_OCEAN' };
  }

  return { name: 'Open Terrestrial Orbit', category: 'space', code: 'ORBIT' };
}
