'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Shield,
  Truck,
  Calendar,
  Lock,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Home,
  DollarSign,
  Clock,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface Car {
  _id: string
  name: string
  model: string
  year: number
  price: number
  image: string
  description: string
  available: boolean
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  paymentMethod: 'credit_card' | 'bank_transfer' | 'financing'
  color: string
  termsAccepted: boolean
}

export default function OrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'credit_card',
    color: searchParams.get('color') || 'Pearl White',
    termsAccepted: false
  })
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    fetchCarDetails()
  }, [id])

  const fetchCarDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cars/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setCar(data.car)
      } else {
        throw new Error(data.error || 'Failed to fetch car details')
      }
    } catch (error: any) {
      console.error('Failed to fetch car:', error)
      setError('Failed to fetch car details. Please try again.')
      // Fallback to mock data
      setCar({
        _id: id as string,
        name: 'Tesla Model 3',
        model: 'Model 3',
        year: 2024,
        price: 45000,
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        description: 'Electric sedan with autopilot',
        available: true
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: id,
          car: car,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          paymentMethod: formData.paymentMethod,
          color: formData.color,
          totalAmount: calculateTotal()
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      setOrderId(data.orderId)
      setOrderComplete(true)
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/cars/${id}/order/success?orderId=${data.orderId}`)
      }, 3000)

    } catch (error: any) {
      console.error('Order error:', error)
      setError(error.message || 'Failed to process order. Please try again.')
    } finally {
      setProcessing(false)
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

  const calculateTax = () => {
    const basePrice = car?.price || 0
    return basePrice * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    const basePrice = car?.price || 0
    const tax = calculateTax()
    return basePrice + tax
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-tesla-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-tesla-blue mx-auto mb-4" />
          <p className="text-gray-600 dark:text-tesla-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-tesla-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Order Submitted!
            </h1>
            <p className="text-gray-600 dark:text-tesla-gray-400 mb-6">
              Your order #{orderId} has been received. We're processing it now.
            </p>
            <p className="text-gray-500 dark:text-tesla-gray-500">
              Redirecting to order details...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-tesla-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
              {error}
            </h2>
            <Link
              href={`/cars/${id}`}
              className="inline-flex items-center text-tesla-blue hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Car Details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = calculateTotal()
  const taxAmount = calculateTax()

  return (
    <div className="min-h-screen bg-gradient-to-br from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-tesla-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/cars/${id}`}
          className="inline-flex items-center text-sm text-gray-600 dark:text-tesla-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Car Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-tesla-gray-700 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={car?.image}
                    alt={car?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {car?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-tesla-gray-400">
                    {car?.year} • {car?.model}
                  </p>
                  {formData.color && (
                    <div className="flex items-center gap-2 mt-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 dark:border-tesla-gray-600"
                        style={{ 
                          backgroundColor: formData.color === 'Solid Black' ? '#000000' : 
                                        formData.color === 'Midnight Silver' ? '#5F5F5F' :
                                        formData.color === 'Deep Blue' ? '#1E40AF' :
                                        formData.color === 'Red Multi-Coat' ? '#DC2626' : '#FFFFFF'
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-tesla-gray-400">
                        {formData.color}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-200 dark:border-tesla-gray-700 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-tesla-gray-400">Vehicle Price</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(car?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-tesla-gray-400">Delivery Fee</span>
                  <span className="font-medium text-green-600 dark:text-green-400">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-tesla-gray-400">Taxes & Fees</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-tesla-gray-700 pt-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-tesla-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-tesla-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <span className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Delivery Address
                  </span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-tesla-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </span>
                </h3>
                
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 ${
                    formData.paymentMethod === 'credit_card' 
                      ? 'border-tesla-blue bg-blue-50 dark:bg-tesla-blue/10' 
                      : 'border-gray-300 dark:border-tesla-gray-600 hover:border-tesla-blue'
                  }`}>
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="w-4 h-4 text-tesla-blue"
                    />
                    <label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium text-gray-900 dark:text-white">Credit Card</span>
                      </div>
                    </label>
                  </div>

                  <div className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 ${
                    formData.paymentMethod === 'financing' 
                      ? 'border-tesla-blue bg-blue-50 dark:bg-tesla-blue/10' 
                      : 'border-gray-300 dark:border-tesla-gray-600 hover:border-tesla-blue'
                  }`}>
                    <input
                      type="radio"
                      id="financing"
                      name="paymentMethod"
                      value="financing"
                      checked={formData.paymentMethod === 'financing'}
                      onChange={handleChange}
                      className="w-4 h-4 text-tesla-blue"
                    />
                    <label htmlFor="financing" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium text-gray-900 dark:text-white">Tesla Financing</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-tesla-gray-400 mt-1">0.99% APR for qualified buyers</p>
                    </label>
                  </div>

                  <div className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 ${
                    formData.paymentMethod === 'bank_transfer' 
                      ? 'border-tesla-blue bg-blue-50 dark:bg-tesla-blue/10' 
                      : 'border-gray-300 dark:border-tesla-gray-600 hover:border-tesla-blue'
                  }`}>
                    <input
                      type="radio"
                      id="bank_transfer"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="w-4 h-4 text-tesla-blue"
                    />
                    <label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium text-gray-900 dark:text-white">Bank Transfer</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Credit Card Form */}
                {formData.paymentMethod === 'credit_card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-tesla-gray-300 mb-2">
                          CVC *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-tesla-gray-600 rounded-lg focus:ring-2 focus:ring-tesla-blue focus:border-transparent transition-colors duration-200 bg-white dark:bg-tesla-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                  className="w-4 h-4 mt-1 text-tesla-blue rounded focus:ring-tesla-blue"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-tesla-gray-400">
                  I agree to the Terms of Service and Privacy Policy. I understand that this 
                  order is subject to vehicle availability and final approval. By placing this 
                  order, I authorize Tesla to perform a credit check if I select financing.
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || !formData.termsAccepted}
                className="w-full bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-tesla-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Order Protection
                  </span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        5-Year Warranty
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                        Comprehensive vehicle protection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        30-Day Return
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                        Full refund if unsatisfied
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Free Delivery
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                        Direct to your doorstep
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Estimated Delivery
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">
                        {car?.available ? '2-3 business days' : '2-4 weeks'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-blue-50 dark:bg-tesla-blue/10 rounded-2xl border border-blue-200 dark:border-tesla-blue/20 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-2">
                  <span className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Need Help?
                  </span>
                </h3>
                <p className="text-blue-700 dark:text-tesla-blue mb-4">
                  Our team is available 24/7 to assist with your order.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+18885551234"
                    className="inline-block w-full text-center bg-tesla-blue hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Call Support: (888) 555-1234
                  </a>
                  <a
                    href="mailto:support@tsla.com"
                    className="inline-block w-full text-center border border-tesla-blue text-tesla-blue hover:bg-blue-50 dark:hover:bg-tesla-blue/10 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Email Support
                  </a>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white dark:bg-tesla-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-tesla-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-tesla-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Order Confirmation</h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">Immediate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-tesla-blue text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Vehicle Preparation</h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-tesla-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-tesla-blue text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Delivery</h4>
                      <p className="text-sm text-gray-600 dark:text-tesla-gray-400">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}