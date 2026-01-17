import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/** * Global is used here to maintain a cached connection across hot-reloads
 * in development. This prevents connections from growing exponentially.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache
}

let cached: MongooseCache = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(): Promise<typeof mongoose> {
  // 1. Return cached connection if available
  if (cached.conn) {
    return cached.conn
  }

  // 2. If no promise exists, create a new connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Set to true to allow Mongoose to queue commands while connecting
      maxPoolSize: 10,      // Optimized for serverless/lambda environments
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('--- MongoDB Connected Successfully ---')
      return mongooseInstance
    })
  }

  try {
    // 3. Await the promise to establish connection
    cached.conn = await cached.promise
  } catch (e) {
    // 4. Reset promise if connection fails so next request can retry
    cached.promise = null
    console.error('--- MongoDB Connection Failed ---', e)
    throw e
  }

  return cached.conn
}

export default connectDB