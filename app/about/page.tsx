import { Target, Shield, Zap, Users, Globe, Award } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'Democratizing access to investment opportunities and sustainable transportation.'
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Bank-level security protocols protecting all user assets and data.'
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'Constantly evolving our platform with cutting-edge technology.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Building a community of informed investors and EV enthusiasts.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving customers in over 50 countries with localized solutions.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Commitment to excellence in every aspect of our platform.'
    }
  ]

  const team = [
    {
      name: 'Alex Morgan',
      role: 'CEO & Founder',
      bio: 'Former Tesla executive with 10+ years in fintech.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Blockchain expert and software architect.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
    },
    {
      name: 'Marcus Rivera',
      role: 'Head of Investments',
      bio: '15+ years in asset management and trading.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Product Lead',
      bio: 'Product design specialist focused on user experience.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b786d49d?w=400&h=400&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-tesla-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://teslaevpartners.com/images/tesla-hero.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-tesla font-bold mb-6">
              Reimagining Investment & Mobility
            </h1>
            <p className="text-xl text-tesla-gray-300 mb-8">
              We're building the future of finance and sustainable transportation 
              through innovative technology and user-centric design.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-tesla-gray-300">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">$1B+</div>
                <div className="text-sm text-tesla-gray-300">Assets Traded</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-tesla-gray-300">Trading</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="bg-white dark:bg-tesla-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-tesla font-bold text-black dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-tesla-gray-600 dark:text-tesla-gray-400 mb-6">
                Founded in 2023 by former Tesla executives and fintech experts, 
                TSLA Platform was born from a simple idea: why should investing 
                in innovation and sustainable technology be complicated?
              </p>
              <p className="text-lg text-tesla-gray-600 dark:text-tesla-gray-400">
                We saw a gap in the market for a platform that seamlessly 
                integrates investment opportunities with the products shaping 
                our future. Our mission is to make sophisticated investment 
                tools and premium EV inventory accessible to everyone.
              </p>
            </div>
            <div className="bg-gradient-to-br from-tesla-blue to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-tesla font-bold mb-4">Vision</h3>
              <p className="text-lg mb-6">
                To become the leading platform for investment and sustainable 
                technology adoption worldwide.
              </p>
              <h3 className="text-2xl font-tesla font-bold mb-4">Purpose</h3>
              <p className="text-lg">
                Empowering individuals to build wealth while contributing to 
                a sustainable future through accessible investment opportunities 
                and clean technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-tesla-gray-50 dark:bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-tesla font-bold text-black dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-tesla-gray-600 dark:text-tesla-gray-400">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white dark:bg-tesla-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-tesla-blue/10 mb-4">
                  <value.icon className="w-6 h-6 text-tesla-blue" />
                </div>
                <h3 className="text-xl font-tesla font-semibold text-black dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-tesla-gray-600 dark:text-tesla-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white dark:bg-tesla-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-tesla font-bold text-black dark:text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-tesla-gray-600 dark:text-tesla-gray-400">
              Experienced professionals driving our vision forward
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="group bg-tesla-gray-50 dark:bg-tesla-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-tesla font-semibold text-black dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-tesla-blue font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-tesla-gray-600 dark:text-tesla-gray-400">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-tesla-blue to-blue-600 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-tesla font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of the revolution in investment and sustainable technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-tesla-blue font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/careers"
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              View Careers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}