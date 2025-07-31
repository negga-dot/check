import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Users, Zap, Shield, TrendingUp, FileText } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Setup Guide',
      description: 'Step-by-step wizard to identify and track all required licenses and approvals',
      color: 'text-blue-500',
    },
    {
      icon: Clock,
      title: 'Approval Tracker',
      description: 'Real-time tracking of your application status across multiple departments',
      color: 'text-green-500',
    },
    {
      icon: TrendingUp,
      title: 'Scheme Finder',
      description: 'Discover government schemes and funding opportunities tailored to your business',
      color: 'text-orange-500',
    },
    {
      icon: FileText,
      title: 'Compliance Calendar',
      description: 'Never miss deadlines with automated reminders for renewals and filings',
      color: 'text-purple-500',
    },
  ];

  const stats = [
    { number: '8000+', label: 'Delhi Startups' },
    { number: '₹50,000+', label: 'Average Savings' },
    { number: '15+', label: 'Departments Unified' },
    { number: '72%', label: 'Faster Approvals' },
  ];

  const benefits = [
    'Save 3-6 months in setup time',
    'Reduce compliance costs by 60%',
    'Access to ₹10L+ funding schemes',
    'Expert guidance at every step',
    'Single dashboard for all approvals',
    'Automated deadline tracking',
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 sm:py-24">
        <div className="container">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Simplify Your{' '}
              <span className="text-blue-500">Startup Journey</span>{' '}
              in Delhi
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get all licenses, track compliance, discover schemes - all in one place. 
              Turn months of bureaucracy into weeks of progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/wizard">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  Start Setup Wizard
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From registration to compliance, we've got every aspect of your startup journey covered
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                hover 
                className="text-center animate-slide-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-blue-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Delhi Entrepreneurs Choose LaunchMate
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of successful startups who've streamlined their compliance journey with our platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-scale-in">
              <Card className="bg-white">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted Platform</h3>
                    <p className="text-gray-600">
                      Government-recognized partner with 99.9% uptime and bank-grade security
                    </p>
                  </div>
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>8000+ Users</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1" />
                        <span>ISO Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="container text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've simplified their compliance journey with LaunchMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/wizard">
              <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                Start Your Journey Today
              </Button>
            </Link>
            <Link to="/schemes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100">
                Explore Funding Schemes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;