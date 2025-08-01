import React, { useState } from 'react';
import { Search, Filter, Star, ExternalLink, Save, CheckCircle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import type { Scheme } from '../contexts/AppContext';

const SchemeRecommender: React.FC = () => {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState({
    sector: '',
    founderProfile: '',
    investmentRange: '',
    businessStage: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allSchemes: Scheme[] = [
    {
      id: '1',
      name: 'PMEGP (Prime Minister Employment Generation Programme)',
      description: 'Credit-linked subsidy for setting up micro enterprises',
      loanAmount: '₹10 Lakhs - ₹25 Lakhs',
      interestRate: '8-12%',
      eligibility: true,
      category: 'Manufacturing',
      benefits: ['25% subsidy for general category', '35% subsidy for SC/ST/Women', 'No collateral up to ₹10L'],
      applyLink: 'https://kviconline.gov.in/pmegpeportal/',
    },
    {
      id: '2',
      name: 'Mudra Loan - Shishu',
      description: 'Collateral-free loans for micro businesses',
      loanAmount: 'Up to ₹50,000',
      interestRate: '10-12%',
      eligibility: true,
      category: 'General',
      benefits: ['No collateral required', 'Quick processing', 'Flexible repayment'],
      applyLink: 'https://www.mudra.org.in/',
    },
    {
      id: '3',
      name: 'Stand-Up India',
      description: 'Bank loans for SC/ST and Women entrepreneurs',
      loanAmount: '₹10 Lakhs - ₹1 Crore',
      interestRate: '9-11%',
      eligibility: false,
      category: 'Manufacturing',
      benefits: ['Dedicated for SC/ST/Women', 'Handholding support', '7-year repayment'],
      applyLink: 'https://www.standupmitra.in/',
    },
    {
      id: '4',
      name: 'SIDBI Fund of Funds',
      description: 'Funding support for startups through registered VCs',
      loanAmount: '₹5 Lakhs - ₹5 Crores',
      interestRate: 'Equity participation',
      eligibility: true,
      category: 'Startup',
      benefits: ['DPIIT recognized startups', 'Through registered VCs', 'No debt burden'],
      applyLink: 'https://www.sidbi.in/',
    },
    {
      id: '5',
      name: 'Delhi Startup Policy',
      description: 'Delhi government support for startups',
      loanAmount: '₹20 Lakhs grant',
      interestRate: 'Grant (No repayment)',
      eligibility: true,
      category: 'Startup',
      benefits: ['Up to ₹20L grant', 'Incubation support', 'Mentorship programs'],
      applyLink: 'https://www.delhi.gov.in/startup',
    },
    {
      id: '6',
      name: 'MSME Cluster Development Programme',
      description: 'Support for MSME clusters development',
      loanAmount: '₹80% funding',
      interestRate: 'Subsidy based',
      eligibility: true,
      category: 'Manufacturing',
      benefits: ['80% government funding', 'Infrastructure development', 'Technology upgradation'],
      applyLink: 'https://dcmsme.gov.in/',
    },
    {
      id: '7',
      name: 'Credit Guarantee Trust for Micro and Small Enterprises',
      description: 'Collateral-free credit guarantee for MSMEs',
      loanAmount: 'Up to ₹2 Crores',
      interestRate: 'Market rates',
      eligibility: true,
      category: 'General',
      benefits: ['No collateral required', '85% guarantee coverage', 'Quick approval'],
      applyLink: 'https://www.cgtmse.in/',
    },
    {
      id: '8',
      name: 'Atal Innovation Mission',
      description: 'Innovation and entrepreneurship support',
      loanAmount: 'Grant funding',
      interestRate: 'Grant based',
      eligibility: false,
      category: 'Innovation',
      benefits: ['Grant support', 'Incubation facilities', 'Mentorship network'],
      applyLink: 'https://aim.gov.in/',
    },
  ];

  const updateEligibility = (schemes: Scheme[]): Scheme[] => {
    return schemes.map(scheme => {
      let eligible = true;

      // Sector-based eligibility
      if (filters.sector === 'manufacturing' && !['Manufacturing', 'General'].includes(scheme.category)) {
        eligible = false;
      }
      if (filters.sector === 'service' && scheme.category === 'Manufacturing') {
        eligible = false;
      }

      // Founder profile based eligibility
      if (filters.founderProfile === 'sc-st-minority' && scheme.name === 'Stand-Up India') {
        eligible = true;
      } else if (filters.founderProfile === 'female' && scheme.name === 'Stand-Up India') {
        eligible = true;
      } else if (filters.founderProfile === 'general' && scheme.name === 'Stand-Up India') {
        eligible = false;
      }

      // Business stage based eligibility
      if (filters.businessStage === 'idea' && !['Startup', 'Innovation', 'General'].includes(scheme.category)) {
        eligible = false;
      }

      return { ...scheme, eligibility: eligible };
    });
  };

  const filteredSchemes = updateEligibility(allSchemes).filter(scheme => {
    if (searchTerm && !scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !scheme.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const eligibleSchemes = filteredSchemes.filter(s => s.eligibility);
  const ineligibleSchemes = filteredSchemes.filter(s => !s.eligibility);

  const handleSaveScheme = (scheme: Scheme) => {
    const savedSchemes = [...state.schemes];
    const existingIndex = savedSchemes.findIndex(s => s.id === scheme.id);
    
    if (existingIndex >= 0) {
      savedSchemes.splice(existingIndex, 1);
    } else {
      savedSchemes.push(scheme);
    }
    
    dispatch({ type: 'SET_SCHEMES', payload: savedSchemes });
  };

  const isSchemesSaved = (schemeId: string) => {
    return state.schemes.some(s => s.id === schemeId);
  };

  const renderSchemeCard = (scheme: Scheme) => (
    <Card key={scheme.id} hover className={`w-full ${scheme.eligibility ? '' : 'opacity-60'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">{scheme.name}</h3>
            {scheme.eligibility ? (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-red-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 break-words">{scheme.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Loan Amount</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{scheme.loanAmount}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Interest Rate</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{scheme.interestRate}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleSaveScheme(scheme)}
          className={`p-2 rounded-lg transition-colors ${
            isSchemesSaved(scheme.id)
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Star className={`h-5 w-5 ${isSchemesSaved(scheme.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Benefits:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {scheme.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex space-x-3">
        <Button
          variant={scheme.eligibility ? 'primary' : 'outline'}
          size="sm"
          className="flex-1"
          icon={ExternalLink}
          iconPosition="right"
          onClick={() => window.open(scheme.applyLink, '_blank')}
        >
          {scheme.eligibility ? 'Apply Now' : 'View Details'}
        </Button>
        <Button variant="outline" size="sm">
          Learn More
        </Button>
      </div>
    </Card>
  );

  const hasFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('schemes.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('schemes.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('schemes.findPerfectScheme')}</h2>
            <Button
              variant="outline"
              size="sm"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Sector
                </label>
                <select
                  className="input-field"
                  value={filters.sector}
                  onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                >
                  <option value="">Select sector</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="service">Service</option>
                  <option value="food">Food & Beverage</option>
                  <option value="tech">Technology</option>
                  <option value="export">Export/Import</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founder Profile
                </label>
                <select
                  className="input-field"
                  value={filters.founderProfile}
                  onChange={(e) => setFilters({ ...filters, founderProfile: e.target.value })}
                >
                  <option value="">Select profile</option>
                  <option value="general">General</option>
                  <option value="female">Female</option>
                  <option value="sc-st-minority">SC/ST/Minority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Range
                </label>
                <select
                  className="input-field"
                  value={filters.investmentRange}
                  onChange={(e) => setFilters({ ...filters, investmentRange: e.target.value })}
                >
                  <option value="">Select range</option>
                  <option value="under-10l">Under ₹10 Lakhs</option>
                  <option value="10l-1cr">₹10L - ₹1 Crore</option>
                  <option value="above-1cr">Above ₹1 Crore</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Stage
                </label>
                <select
                  className="input-field"
                  value={filters.businessStage}
                  onChange={(e) => setFilters({ ...filters, businessStage: e.target.value })}
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea Stage</option>
                  <option value="setup">Setup Phase</option>
                  <option value="running">Running Business</option>
                  <option value="scaling">Scaling Up</option>
                </select>
              </div>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('common.search') + ' schemes...'}
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {value}
                    <button
                      onClick={() => setFilters({ ...filters, [key]: '' })}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => setFilters({ sector: '', founderProfile: '', investmentRange: '', businessStage: '' })}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </Card>

        {/* Results Summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{eligibleSchemes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Eligible Schemes</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{state.schemes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Saved Schemes</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{filteredSchemes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Available</div>
            </div>
          </Card>
        </div>

        {/* Eligible Schemes */}
        {eligibleSchemes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              {t('schemes.eligibleSchemes')} ({eligibleSchemes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleSchemes.map(renderSchemeCard)}
            </div>
          </div>
        )}

        {/* Other Schemes */}
        {ineligibleSchemes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <X className="h-6 w-6 text-gray-400 mr-2" />
              {t('schemes.otherSchemes')} ({ineligibleSchemes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ineligibleSchemes.map(renderSchemeCard)}
            </div>
          </div>
        )}

        {filteredSchemes.length === 0 && (
          <Card className="text-center py-16">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('schemes.noSchemesFound')}</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find relevant schemes.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ sector: '', founderProfile: '', investmentRange: '', businessStage: '' });
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SchemeRecommender;