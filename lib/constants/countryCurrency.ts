// Country to default currency mapping
export const countryCurrencyMap: Record<string, string> = {
  // North America
  "US": "USD", // United States
  "CA": "CAD", // Canada
  "MX": "MXN", // Mexico
  
  // Europe
  "GB": "GBP", // United Kingdom
  "DE": "EUR", // Germany
  "FR": "EUR", // France
  "IT": "EUR", // Italy
  "ES": "EUR", // Spain
  "NL": "EUR", // Netherlands
  "BE": "EUR", // Belgium
  "AT": "EUR", // Austria
  "IE": "EUR", // Ireland
  "PT": "EUR", // Portugal
  "GR": "EUR", // Greece
  "FI": "EUR", // Finland
  "SE": "SEK", // Sweden
  "NO": "NOK", // Norway
  "DK": "DKK", // Denmark
  "CH": "CHF", // Switzerland
  "PL": "PLN", // Poland
  "CZ": "CZK", // Czech Republic
  "HU": "HUF", // Hungary
  "RO": "RON", // Romania
  
  // Asia
  "JP": "JPY", // Japan
  "CN": "CNY", // China
  "IN": "INR", // India
  "KR": "KRW", // South Korea
  "ID": "IDR", // Indonesia
  "TH": "THB", // Thailand
  "VN": "VND", // Vietnam
  "PH": "PHP", // Philippines
  "MY": "MYR", // Malaysia
  "SG": "SGD", // Singapore
  "PK": "PKR", // Pakistan
  "BD": "BDT", // Bangladesh
  "LK": "LKR", // Sri Lanka
  
  // Middle East
  "SA": "SAR", // Saudi Arabia
  "AE": "AED", // United Arab Emirates
  "QA": "QAR", // Qatar
  "KW": "KWD", // Kuwait
  "OM": "OMR", // Oman
  "BH": "BHD", // Bahrain
  "JO": "JOD", // Jordan
  "LB": "LBP", // Lebanon
  "IR": "IRR", // Iran
  "IL": "ILS", // Israel
  "TR": "TRY", // Turkey
  
  // Africa
  "ZA": "ZAR", // South Africa
  "EG": "EGP", // Egypt
  "NG": "NGN", // Nigeria
  "KE": "KES", // Kenya
  "ET": "ETB", // Ethiopia
  "GH": "GHS", // Ghana
  "TZ": "TZS", // Tanzania
  "UG": "UGX", // Uganda
  "AO": "AOA", // Angola
  "MZ": "MZN", // Mozambique
  "ZM": "ZMW", // Zambia
  "ZW": "USD", // Zimbabwe (uses USD due to hyperinflation)
  
  // South America
  "BR": "BRL", // Brazil
  "AR": "ARS", // Argentina
  "CL": "CLP", // Chile
  "CO": "COP", // Colombia
  "PE": "PEN", // Peru
  "VE": "VES", // Venezuela
  
  // Oceania
  "AU": "AUD", // Australia
  "NZ": "NZD", // New Zealand
  
  // Default to USD for other countries
}

// Get currency for a country code
export function getCurrencyForCountry(countryCode: string): string {
  return countryCurrencyMap[countryCode] || "USD"
}

// Check if currency is available in our supported currencies
export function isCurrencySupported(currencyCode: string): boolean {
  const supportedCurrencies = [
    "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR",
    "SGD", "HKD", "KRW", "BRL", "RUB", "ZAR", "MXN", "NZD", "SEK",
    "NOK", "DKK", "PLN", "TRY", "THB", "IDR", "MYR", "PHP", "AED",
    "SAR", "QAR", "KWD", "OMR", "BHD", "CLP", "COP", "PEN", "ARS",
    "VND", "PKR", "BDT", "EGP", "NGN", "KES", "ETB", "GHS", "TZS",
    "UGX", "AOA", "MZN", "ZMW"
  ]
  return supportedCurrencies.includes(currencyCode)
}