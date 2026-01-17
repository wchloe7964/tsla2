'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Home, 
  Car, 
  Calendar,
  Truck,
  QrCode,
  Share2,
  Printer,
  ArrowRight,
  Shield,
  CreditCard,
  Battery,
  Zap
} from 'lucide-react'

interface Order {
  id: string
  carId: string
  carName: string
  totalAmount: number
  estimatedDelivery: string
  status: string
  orderDate: string
  vehicleDetails: {
    color: string
    model: string
    year: number
  }
}

export default function OrderSuccessPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
    setShareUrl(window.location.href)
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrder({
        id: orderId || `TSLA-${Date.now().toString().slice(-8)}`,
        carId: id as string,
        carName: 'Tesla Model 3 Long Range',
        totalAmount: 48600,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: 'confirmed',
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        vehicleDetails: {
          color: 'Pearl White',
          model: 'Model 3',
          year: 2024
        }
      })
    } catch (error) {
      console.error('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Tesla Order #${orderId}`,
          text: `I just ordered a Tesla! Order #${orderId}`,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert('Order link copied to clipboard!')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-tesla-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tesla-blue mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-tesla-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-tesla-gray-800 transition-colors duration-200">
      {/* Success Header with Tesla branding */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 opacity-95">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-tesla font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-green-100 dark:text-green-200 mb-8 max-w-3xl mx-auto">
            Thank you for choosing Tesla. Your order <span className="font-semibold">#{orderId}</span> has been confirmed.
          </p>
          
          {/* QR Code */}
          <div className="inline-block p-6 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 bg-white rounded-lg p-4">
                {/* QR Code Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white mb-1">Order QR Code</p>
                <p className="text-xs text-green-100">Show at delivery or service center</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-green-100 mb-1">Order Number</p>
              <p className="text-lg font-tesla font-bold text-white">{orderId?.slice(-6)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-green-100 mb-1">Status</p>
              <p className="text-lg font-tesla font-bold text-white">Confirmed</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-green-100 mb-1">Total</p>
              <p className="text-lg font-tesla font-bold text-white">{formatPrice(order?.totalAmount || 0)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-green-100 mb-1">Delivery</p>
              <p className="text-lg font-tesla font-bold text-white">1-2 weeks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        {/* Order Details Card */}
        <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-tesla-gray-700 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-6 h-6 text-tesla-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vehicle</h3>
              <p className="text-gray-600 dark:text-tesla-gray-400">{order?.carName}</p>
              {order?.vehicleDetails && (
                <p className="text-xs text-gray-500 dark:text-tesla-gray-500 mt-1">
                  {order.vehicleDetails.color} • {order.vehicleDetails.year}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Date</h3>
              <p className="text-gray-600 dark:text-tesla-gray-400">{order?.orderDate}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Delivery</h3>
              <p className="text-gray-600 dark:text-tesla-gray-400">{order?.estimatedDelivery}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Total Amount</h3>
              <p className="text-gray-600 dark:text-tesla-gray-400">{formatPrice(order?.totalAmount || 0)}</p>
            </div>
          </div>
          
          {/* Order Actions */}
          <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-gray-200 dark:border-tesla-gray-700">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-tesla-gray-600 text-gray-700 dark:text-tesla-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-tesla-gray-700 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-tesla-gray-600 text-gray-700 dark:text-tesla-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-tesla-gray-700 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              Share Order
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-tesla-blue text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-tesla-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What's Next?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-tesla-blue">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Order Confirmation Email
                </h3>
                <p className="text-gray-600 dark:text-tesla-gray-400">
                  We've sent a confirmation email with your order details and receipt.
                  Check your inbox (and spam folder).
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-tesla-blue">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Vehicle Preparation
                </h3>
                <p className="text-gray-600 dark:text-tesla-gray-400">
                  Our team will prepare your vehicle for delivery. You'll receive updates
                  about the preparation progress via email and SMS.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-tesla-blue">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Delivery Day
                </h3>
                <p className="text-gray-600 dark:text-tesla-gray-400">
                  A delivery specialist will contact you 24 hours before delivery to
                  schedule the exact time that works best for you.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-tesla-blue">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Post-Delivery Support
                </h3>
                <p className="text-gray-600 dark:text-tesla-gray-400">
                  After delivery, our support team will reach out to ensure everything
                  is perfect and help with any questions you might have.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tesla Benefits */}
        <div className="bg-gradient-to-r from-tesla-blue/10 to-blue-500/10 dark:from-tesla-blue/20 dark:to-blue-500/20 rounded-2xl border border-tesla-blue/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Tesla Benefits Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-tesla-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-tesla-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">5-Year Warranty</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                Comprehensive vehicle and battery protection
              </p>
            </div>
            
            <div className="bg-white dark:bg-tesla-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-tesla-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-tesla-blue/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-tesla-blue" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Free Supercharging</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                1,000 miles of free Supercharging credits
              </p>
            </div>
            
            <div className="bg-white dark:bg-tesla-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-tesla-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Battery className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">OTA Updates</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                Lifetime over-the-air software updates included
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/portfolio"
            className="group bg-white dark:bg-tesla-gray-800 border border-gray-200 dark:border-tesla-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-tesla-blue/30 transition-colors duration-200">
              <Home className="w-6 h-6 text-tesla-blue" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Portfolio</h3>
            <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
              Track your investments and assets
            </p>
          </Link>
          
          <Link
            href={`/cars/${id}`}
            className="group bg-white dark:bg-tesla-gray-800 border border-gray-200 dark:border-tesla-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors duration-200">
              <Car className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vehicle Details</h3>
            <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
              View your ordered vehicle specs
            </p>
          </Link>
          
          <Link
            href="/cars"
            className="group bg-white dark:bg-tesla-gray-800 border border-gray-200 dark:border-tesla-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors duration-200">
              <Car className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browse More</h3>
            <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
              Explore other available vehicles
            </p>
          </Link>
        </div>

        {/* Support Section */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-tesla-gray-700">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Need Help With Your Order?
            </h3>
            <p className="text-gray-600 dark:text-tesla-gray-400">
              Our team is available 24/7 to assist with your order
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <a
              href="mailto:support@tesla.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-tesla-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <a
              href="tel:+18885127523"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-tesla-gray-600 text-gray-700 dark:text-tesla-gray-300 hover:bg-gray-50 dark:hover:bg-tesla-gray-700 rounded-lg font-medium transition-all duration-200"
            >
              Call: (888) 512-7523
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-tesla-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500 dark:text-tesla-gray-500">
                Support available 24/7
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500 dark:text-tesla-gray-500">
                Avg. response: 15 minutes
              </span>
            </div>
          </div>
          
          {/* Order Timeline Progress */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Order Status</p>
                <p className="text-xs text-gray-500 dark:text-tesla-gray-500">Order placed • Preparing vehicle • Delivery scheduled</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-tesla-blue/20 dark:text-blue-300">
                  Step 1 of 4
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-tesla-gray-700 rounded-full h-2">
              <div className="bg-tesla-blue h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-tesla-gray-500">
              <span>Ordered</span>
              <span>Preparing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>
        
        {/* Download App CTA */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-black dark:from-tesla-gray-800 dark:to-tesla-gray-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Track Your Order on the Go</h3>
              <p className="text-gray-300">
                Download the Tesla app to track your order status, schedule delivery, and control your vehicle.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
                Download for iOS
              </button>
              <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium">
                Download for Android
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}