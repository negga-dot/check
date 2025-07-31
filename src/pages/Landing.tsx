import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Users, Zap, Shield, TrendingUp, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Landing: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('features.setup.title'),
      description: t('features.setup.desc'),
      color: 'text-blue-500',
    },
    {
      icon: Clock,
      title: t('features.tracker.title'),
      description: t('features.tracker.desc'),
      color: 'text-green-500',
    },
    {
      icon: TrendingUp,
      title: t('features.schemes.title'),
      description: t('features.schemes.desc'),
      color: 'text-orange-500',
    },
    {
      icon: FileText,
      title: t('features.calendar.title'),
      description: t('features.calendar.desc'),
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
    <div className="bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 sm:py-24">
        <div className="container">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('landing.hero.title').split(' ').map((word, index) => 
                word === 'Startup' ? (
                  <span key={index} className="text-blue-500">{word} </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/wizard">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  {t('landing.hero.cta')}
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('landing.hero.demo')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 dark:bg-gray-950">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
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
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-blue-50 dark:bg-gray-800">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Delhi Entrepreneurs Choose LaunchMate
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of successful startups who've streamlined their compliance journey with our platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-scale-in">
              <Card className="bg-white dark:bg-gray-900">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trusted Platform</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Government-recognized partner with 99.9% uptime and bank-grade security
                    </p>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>8000+ Users</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
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
      <section className="py-16 sm:py-24 bg-gray-900 dark:bg-gray-950">
        <div className="container text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-gray-100 mb-6">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've simplified their compliance journey with LaunchMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/wizard">
              <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                {t('landing.hero.cta')}
              </Button>
            </Link>
            <Link to="/schemes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
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