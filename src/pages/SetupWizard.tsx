import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Building, Store, Utensils, Package, Briefcase } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import type { UserData, Approval } from '../contexts/AppContext';

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    companyName: '',
    address: '',
    sector: '',
    investment: '',
    foundersCount: 1,
  });

  const businessTypes = [
    {
      id: 'manufacturing',
      title: 'MSME Manufacturing',
      description: 'Product manufacturing, assembly, or production business',
      icon: Building,
      approvals: ['Udyam Registration', 'DPCC NOC', 'Factory License', 'GST Registration', 'Fire NOC', 'Labor License'],
    },
    {
      id: 'service',
      title: 'Service Company',
      description: 'IT, consulting, professional services, or digital business',
      icon: Briefcase,
      approvals: ['Company Registration', 'GST Registration', 'DPIIT Recognition', 'Professional Tax', 'ESI/PF Registration'],
    },
    {
      id: 'food',
      title: 'Food Business',
      description: 'Restaurant, food processing, or catering business',
      icon: Utensils,
      approvals: ['FSSAI License', 'Trade License', 'GST Registration', 'Fire NOC', 'Health Permit', 'Water NOC'],
    },
    {
      id: 'export',
      title: 'Export Business',
      description: 'Import/export or international trade business',
      icon: Package,
      approvals: ['IEC Code', 'GST Registration', 'Company Registration', 'RCMC Certificate', 'Bank Certificate'],
    },
    {
      id: 'retail',
      title: 'Retail Store',
      description: 'Physical retail, e-commerce, or wholesale business',
      icon: Store,
      approvals: ['Trade License', 'GST Registration', 'Shop & Establishment', 'Fire NOC', 'Signage Permit'],
    },
  ];

  const getApprovalsByBusinessType = (businessType: string): Approval[] => {
    const type = businessTypes.find(t => t.id === businessType);
    if (!type) return [];

    return type.approvals.map((approval, index) => ({
      id: `${businessType}-${index}`,
      name: approval,
      department: getDepartmentByApproval(approval),
      status: 'not-started' as const,
      timeline: getTimelineByApproval(approval),
      priority: index < 3 ? 'high' as const : 'medium' as const,
      requiredDocs: getDocsByApproval(approval),
      estimatedDays: getEstimatedDays(approval),
    }));
  };

  const getDepartmentByApproval = (approval: string): string => {
    const deptMap: Record<string, string> = {
      'Udyam Registration': 'MSME Ministry',
      'DPCC NOC': 'Delhi Pollution Control Committee',
      'Factory License': 'Directorate of Industries',
      'GST Registration': 'GST Department',
      'Fire NOC': 'Delhi Fire Service',
      'Labor License': 'Labor Department',
      'Company Registration': 'Ministry of Corporate Affairs',
      'DPIIT Recognition': 'DPIIT',
      'Professional Tax': 'Delhi Government',
      'ESI/PF Registration': 'EPFO',
      'FSSAI License': 'Food Safety Authority',
      'Trade License': 'Municipal Corporation',
      'Health Permit': 'Health Department',
      'Water NOC': 'DJB',
      'IEC Code': 'DGFT',
      'RCMC Certificate': 'Export Promotion Council',
      'Bank Certificate': 'RBI',
      'Shop & Establishment': 'Labor Department',
      'Signage Permit': 'Municipal Corporation',
    };
    return deptMap[approval] || 'Government Department';
  };

  const getTimelineByApproval = (approval: string): string => {
    const timelineMap: Record<string, string> = {
      'Udyam Registration': '1-2 days',
      'GST Registration': '3-7 days',
      'Company Registration': '10-15 days',
      'FSSAI License': '15-30 days',
      'Factory License': '30-45 days',
      'Fire NOC': '15-30 days',
      'Trade License': '7-15 days',
      'DPIIT Recognition': '45-60 days',
    };
    return timelineMap[approval] || '7-15 days';
  };

  const getDocsByApproval = (approval: string): string[] => {
    const docsMap: Record<string, string[]> = {
      'Udyam Registration': ['Aadhaar Card', 'PAN Card', 'Bank Statement'],
      'GST Registration': ['PAN Card', 'Aadhaar Card', 'Bank Certificate', 'Business Address Proof'],
      'Company Registration': ['PAN Card', 'Aadhaar Card', 'Address Proof', 'MOA/AOA'],
      'FSSAI License': ['Form B', 'ID Proof', 'Address Proof', 'NOC from Owner'],
    };
    return docsMap[approval] || ['Basic Documents Required'];
  };

  const getEstimatedDays = (approval: string): number => {
    const daysMap: Record<string, number> = {
      'Udyam Registration': 2,
      'GST Registration': 7,
      'Company Registration': 15,
      'FSSAI License': 30,
      'Factory License': 45,
      'Fire NOC': 21,
      'Trade License': 10,
      'DPIIT Recognition': 60,
    };
    return daysMap[approval] || 14;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const userData: UserData = {
      id: Date.now().toString(),
      name: 'Entrepreneur',
      email: 'user@example.com',
      company: formData.companyName,
      businessType: formData.businessType,
      sector: formData.sector,
      investment: formData.investment,
      foundersCount: formData.foundersCount,
      address: formData.address,
      setupComplete: true,
    };

    const approvals = getApprovalsByBusinessType(formData.businessType);

    dispatch({ type: 'SET_USER', payload: userData });
    dispatch({ type: 'SET_APPROVALS', payload: approvals });

    navigate('/tracker');
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        What type of business are you starting?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessTypes.map((type) => (
          <Card
            key={type.id}
            hover
            className={`cursor-pointer transition-all ${
              formData.businessType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setFormData({ ...formData, businessType: type.id })}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className={`p-3 rounded-xl ${
                  formData.businessType === type.id ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <type.icon className={`h-8 w-8 ${
                    formData.businessType === type.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
              <div className="text-xs text-gray-500">
                <span className="font-medium">{type.approvals.length} approvals required</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Tell us about your business
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            className="input-field"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Enter your company name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address *
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter your business address in Delhi"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Sector
            </label>
            <select
              className="input-field"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            >
              <option value="">Select sector</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="food">Food & Beverage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Investment
            </label>
            <select
              className="input-field"
              value={formData.investment}
              onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
            >
              <option value="">Select range</option>
              <option value="under-10l">Under ₹10 Lakhs</option>
              <option value="10l-1cr">₹10 Lakhs - ₹1 Crore</option>
              <option value="1cr-5cr">₹1 Crore - ₹5 Crores</option>
              <option value="above-5cr">Above ₹5 Crores</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Founders
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="input-field"
            value={formData.foundersCount}
            onChange={(e) => setFormData({ ...formData, foundersCount: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedType = businessTypes.find(t => t.id === formData.businessType);
    if (!selectedType) return null;

    return (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Required Approvals for {selectedType.title}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {selectedType.approvals.map((approval, index) => (
              <Card key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{approval}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {getDepartmentByApproval(approval)}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">⏱️ {getTimelineByApproval(approval)}</span>
                    <span>📄 {getDocsByApproval(approval).length} docs</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Estimated Total Timeline
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                2-4 months
              </p>
              <p className="text-sm text-blue-700">
                With LaunchMate's guidance, you can reduce this by 60% and track everything in real-time
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="animate-fade-in text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Setup Plan is Ready!
        </h2>
        <p className="text-lg text-gray-600">
          We've created a personalized compliance roadmap for your {businessTypes.find(t => t.id === formData.businessType)?.title.toLowerCase()}.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="text-left">
          <h3 className="font-semibold text-gray-900 mb-4">Next Steps:</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-green-600">1</span>
              </div>
              <span className="text-gray-700">Review your approval tracker dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <span className="text-gray-700">Start gathering required documents</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-orange-600">3</span>
              </div>
              <span className="text-gray-700">Explore funding schemes and apply</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleComplete} className="flex-1" icon={ArrowRight} iconPosition="right">
            Go to Approval Tracker
          </Button>
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessType !== '';
      case 2:
        return formData.companyName && formData.address;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <ProgressBar current={currentStep} total={4} className="max-w-md mx-auto" />
        </div>

        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {currentStep < 4 && (
          <div className="flex justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              icon={ArrowLeft}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              icon={ArrowRight}
              iconPosition="right"
            >
              {currentStep === 3 ? 'Create Plan' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;