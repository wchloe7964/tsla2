export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-tesla font-semibold text-black dark:text-white mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-tesla-gray-600 dark:text-tesla-gray-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-tesla-gray-600 dark:text-tesla-gray-400">
                By accessing and using TSLA Platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                2. Description of Service
              </h2>
              <p className="text-tesla-gray-600 dark:text-tesla-gray-400">
                TSLA Platform provides users with access to investment tools, stock market data, and premium EV inventory information.
              </p>
            </section>
            
            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  )
}