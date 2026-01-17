import { NextRequest, NextResponse } from 'next/server'

// Clean country list - alphabetical order, no duplicates
const countries = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "AR", name: "Argentina" },
  { code: "AT", name: "Austria" },
  { code: "AU", name: "Australia" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BH", name: "Bahrain" },
  { code: "BI", name: "Burundi" },
  { code: "BJ", name: "Benin" },
  { code: "BR", name: "Brazil" },
  { code: "BW", name: "Botswana" },
  { code: "CA", name: "Canada" },
  { code: "CD", name: "DR Congo" },
  { code: "CF", name: "Central African Republic" },
  { code: "CG", name: "Republic of the Congo" },
  { code: "CH", name: "Switzerland" },
  { code: "CI", name: "Ivory Coast" },
  { code: "CL", name: "Chile" },
  { code: "CM", name: "Cameroon" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DJ", name: "Djibouti" },
  { code: "DK", name: "Denmark" },
  { code: "DZ", name: "Algeria" },
  { code: "EG", name: "Egypt" },
  { code: "EH", name: "Western Sahara" },
  { code: "ER", name: "Eritrea" },
  { code: "ES", name: "Spain" },
  { code: "ET", name: "Ethiopia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GB", name: "United Kingdom" },
  { code: "GH", name: "Ghana" },
  { code: "GM", name: "Gambia" },
  { code: "GN", name: "Guinea" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "GR", name: "Greece" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "HU", name: "Hungary" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IN", name: "India" },
  { code: "IR", name: "Iran" },
  { code: "IT", name: "Italy" },
  { code: "JO", name: "Jordan" },
  { code: "JP", name: "Japan" },
  { code: "KE", name: "Kenya" },
  { code: "KM", name: "Comoros" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "LB", name: "Lebanon" },
  { code: "LR", name: "Liberia" },
  { code: "LS", name: "Lesotho" },
  { code: "LY", name: "Libya" },
  { code: "MA", name: "Morocco" },
  { code: "MG", name: "Madagascar" },
  { code: "ML", name: "Mali" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MW", name: "Malawi" },
  { code: "MX", name: "Mexico" },
  { code: "MY", name: "Malaysia" },
  { code: "MZ", name: "Mozambique" },
  { code: "NA", name: "Namibia" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "NZ", name: "New Zealand" },
  { code: "OM", name: "Oman" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PK", name: "Pakistan" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Réunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SC", name: "Seychelles" },
  { code: "SD", name: "Sudan" },
  { code: "SE", name: "Sweden" },
  { code: "SG", name: "Singapore" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SN", name: "Senegal" },
  { code: "SO", name: "Somalia" },
  { code: "SS", name: "South Sudan" },
  { code: "SZ", name: "Eswatini" },
  { code: "TD", name: "Chad" },
  { code: "TG", name: "Togo" },
  { code: "TH", name: "Thailand" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TZ", name: "Tanzania" },
  { code: "UA", name: "Ukraine" },
  { code: "UG", name: "Uganda" },
  { code: "US", name: "United States" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YT", name: "Mayotte" },
  { code: "ZA", name: "South Africa" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    
    // Filter countries based on search
    const filteredCountries = search
      ? countries.filter(country => 
          country.name.toLowerCase().includes(search) ||
          country.code.toLowerCase().includes(search)
        )
      : countries
    
    return NextResponse.json({
      success: true,
      countries: filteredCountries,
      total: filteredCountries.length
    })
    
  } catch (error: any) {
    console.error('Get countries error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch countries' 
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}