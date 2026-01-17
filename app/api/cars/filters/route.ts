import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Car from '@/lib/models/Car'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get all unique filter values for Tesla-like filters
    const [
      models,
      locations,
      years,
      minPriceResult,
      maxPriceResult,
      minRangeResult,
      maxRangeResult
    ] = await Promise.all([
      Car.distinct('model'),
      Car.distinct('location'),
      Car.distinct('year').sort({ year: -1 }),
      Car.findOne().sort({ price: 1 }).select('price'),
      Car.findOne().sort({ price: -1 }).select('price'),
      Car.findOne().sort({ 'specs.range.value': 1 }).select('specs.range.value'),
      Car.findOne().sort({ 'specs.range.value': -1 }).select('specs.range.value')
    ])
    
    // Get count by status
    const counts = {
      total: await Car.countDocuments(),
      new: await Car.countDocuments({ status: 'New' }),
      demo: await Car.countDocuments({ type: 'Demo Vehicle' }),
      preOwned: await Car.countDocuments({ status: 'Pre-Owned' }),
      available: await Car.countDocuments({ available: true })
    }
    
    // Get popular configurations
    const popularConfigs = await Car.aggregate([
      { $match: { available: true } },
      { $group: {
        _id: '$model',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
    
    // Get delivery times
    const deliveryTimes = await Car.distinct('deliveryTime')
    
    return NextResponse.json({
      success: true,
      data: {
        models: models.sort(),
        locations: locations.filter(loc => loc).sort(),
        years: years,
        deliveryTimes: deliveryTimes.filter(time => time).sort(),
        priceRange: {
          min: minPriceResult?.price || 0,
          max: maxPriceResult?.price || 0,
          step: 1000
        },
        rangeRange: {
          min: minRangeResult?.specs?.range?.value || 0,
          max: maxRangeResult?.specs?.range?.value || 0,
          step: 50
        },
        counts,
        popularConfigs: popularConfigs.map(config => ({
          model: config._id,
          count: config.count,
          priceRange: {
            min: config.minPrice,
            max: config.maxPrice,
            average: config.avgPrice
          }
        }))
      }
    })
    
  } catch (error: any) {
    console.error('Get filters error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch filter options'
      },
      { status: 500 }
    )
  }
}