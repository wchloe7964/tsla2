export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tesla-gray-50 to-white dark:from-tesla-gray-900 dark:to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-tesla font-semibold text-black dark:text-white mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-tesla-gray-600 dark:text-tesla-gray-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="text-tesla-gray-600 dark:text-tesla-gray-400">
                We collect information you provide directly to us, such as when you create an account, update your profile, or use our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-tesla-gray-600 dark:text-tesla-gray-400">
                We use the information we collect to provide, maintain, and improve our services, and to develop new ones.
              </p>
            </section>
            
            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  )
}