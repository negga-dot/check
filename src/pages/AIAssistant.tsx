import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, Calculator, Search, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import type { ChatMessage } from '../contexts/AppContext';

const AIAssistant: React.FC = () => {
  const { state, dispatch } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    {
      icon: HelpCircle,
      question: t('chat.gstQuestion') || 'How to register for GST?',
      category: 'GST & Tax',
    },
    {
      icon: FileText,
      question: t('chat.foodQuestion') || 'What licenses do I need for food business?',
      category: 'Licensing',
    },
    {
      icon: Search,
      question: t('chat.dpiitQuestion') || 'DPIIT recognition benefits?',
      category: 'Startup Policy',
    },
    {
      icon: Calculator,
      question: t('chat.mcaQuestion') || 'How long does MCA approval take?',
      category: 'Company Registration',
    },
  ];

  const quickActions = [
    { icon: Calculator, label: t('chat.calculateFees'), action: 'calculate-fees' },
    { icon: Search, label: t('chat.findSchemes'), action: 'find-schemes' },
    { icon: FileText, label: t('chat.checkStatus'), action: 'check-status' },
  ];

  // Bot responses for different queries
  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('gst') && lowerMessage.includes('register')) {
      return `To register for GST in Delhi:

**Required Documents:**
• PAN Card of business
• Aadhaar Card of authorized signatory
• Business address proof
• Bank account statement
• Digital signature (if company)

**Process:**
1. Visit GST portal (gst.gov.in)
2. Fill GST REG-01 form
3. Upload required documents
4. Submit application with ₹200 fee
5. Verification by GST officer
6. GSTIN issued (usually within 3-7 working days)

**Fee:** ₹200 for most businesses
**Timeline:** 3-7 working days

Would you like help with any specific step?`;
    }

    if (lowerMessage.includes('food') && (lowerMessage.includes('license') || lowerMessage.includes('business'))) {
      return `For starting a food business in Delhi, you need these licenses:

**Primary Licenses:**
• **FSSAI License** - Food safety license (₹7,500 for 5 years)
• **Trade License** - From MCD (₹2,000-₹10,000)
• **GST Registration** - If turnover > ₹20 lakhs
• **Fire NOC** - From Delhi Fire Service

**Additional Requirements:**
• Health permit for food handlers
• Water NOC if using groundwater
• Pollution NOC for certain food processing
• Shop & Establishment registration

**Timeline:** 30-45 days total
**Estimated Cost:** ₹15,000-₹30,000

I can help you track the application process for each of these!`;
    }

    if (lowerMessage.includes('dpiit') && lowerMessage.includes('benefit')) {
      return `DPIIT Recognition offers amazing benefits for startups:

**Tax Benefits:**
• Income tax exemption for 3 consecutive years
• Capital gains tax exemption (Sections 54EE, 54GB)
• No angel tax on funding up to ₹25 crores

**Compliance Benefits:**
• Self-certification for labor and environment laws
• Fast-track patent examination (2-3 months vs 2-3 years)
• 80% reduction in patent filing fees

**Funding Support:**
• Access to Fund of Funds (₹10,000 crores corpus)
• Priority in government tenders
• Access to various government schemes

**Eligibility:**
• Company incorporated < 10 years ago
• Annual turnover < ₹100 crores
• Working on innovation/scalable business model

**Application Fee:** Free!
**Timeline:** 45-60 days

Ready to apply? I can guide you through the process!`;
    }

    if (lowerMessage.includes('mca') && (lowerMessage.includes('approval') || lowerMessage.includes('long'))) {
      return `MCA (Ministry of Corporate Affairs) approval timelines:

**Company Registration:**
• **SPICe+ Form:** 5-7 working days
• **Name approval:** 1-2 days (if available)
• **Certificate of Incorporation:** 7-10 days total

**Other MCA Services:**
• **Director identification:** 1-2 days
• **Annual filing (AOC-4/MGT-7):** Immediate online
• **ROC compliance:** 2-3 days

**Factors affecting timeline:**
• Document completeness ⏰
• Name availability 📝
• RoC workload 🏢
• Any clarifications needed ❓

**Pro Tips for faster approval:**
1. Keep all documents ready
2. Use professional registered address
3. Choose unique company name
4. Submit during weekdays

**Current processing time:** 7-15 days on average

Need help preparing your documents?`;
    }

    if (lowerMessage.includes('calculate') && lowerMessage.includes('fee')) {
      return `I can help calculate registration fees! Here are common costs:

**Company Registration:**
• Government fees: ₹4,000-₹8,000
• Professional fees: ₹5,000-₹15,000
• **Total: ₹9,000-₹23,000**

**GST Registration:**
• Government fee: ₹200
• **Total: ₹200**

**FSSAI License:**
• Basic: ₹100 (turnover < ₹12L)
• State: ₹3,000 (₹12L-₹20Cr)
• Central: ₹7,500 (> ₹20Cr)

**Trade License (MCD):**
• Small shop: ₹2,000-₹5,000
• Restaurant: ₹5,000-₹15,000

Tell me your business type and I'll give you a detailed cost breakdown!`;
    }

    if (lowerMessage.includes('find') && lowerMessage.includes('scheme')) {
      return `I can recommend schemes based on your profile! Popular options:

**For Manufacturing:**
• PMEGP - Up to ₹25L with 25% subsidy
• MSME loans - Collateral-free up to ₹2Cr
• PLI schemes - Production incentives

**For Startups:**
• Delhi Startup Policy - ₹20L grant
• SIDBI Fund of Funds - Equity funding
• Atal Innovation Mission

**For Women/SC/ST:**
• Stand-Up India - ₹10L to ₹1Cr
• Mudra loans - Up to ₹10L
• PMEGP - Extra 10% subsidy

**For Exports:**
• MEIS - Merchandise export incentive
• EPCG - Duty-free imports
• Interest subvention schemes

Visit our Scheme Recommender for personalized suggestions!`;
    }

    if (lowerMessage.includes('check') && lowerMessage.includes('status')) {
      return `You can check application status for various services:

**GST Status:**
• Visit gst.gov.in → Services → Registration → Track Application Status
• Use ARN (Application Reference Number)

**Company Registration:**
• MCA portal → View Company/LLP Master Data
• Use CIN or application number

**FSSAI Status:**
• Visit foscos.fssai.gov.in
• Login with application number

**Trade License:**
• MCD online portal
• Use application reference number

**Pro Tip:** Save all reference numbers in our tracker for easy monitoring!

Need help tracking any specific application?`;
    }

    // Default responses for general queries
    const defaultResponses = [
      "I understand you're looking for information about startup compliance. Could you be more specific about what you need help with?",
      "That's a great question! For detailed guidance on this topic, you might want to check our Setup Wizard or browse the Scheme Recommender.",
      "I'm here to help with your startup compliance questions. You can ask me about licensing, registrations, schemes, or any other business setup queries.",
      "For complex queries like this, I recommend using our interactive tools. Try the Approval Tracker or document generator for specific guidance.",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage });
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'calculate-fees':
        sendMessage('Can you help me calculate registration fees?');
        break;
      case 'find-schemes':
        sendMessage('What funding schemes are available for my business?');
        break;
      case 'check-status':
        sendMessage('How can I check my application status?');
        break;
    }
  };

  const formatMessage = (message: string) => {
    // Convert markdown-style formatting to HTML
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory, isTyping]);

  // Initialize with welcome message if no chat history
  useEffect(() => {
    if (state.chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        message: `👋 Hi! I'm your AI compliance assistant. I can help you with:

• **Licensing & Registration** - GST, Company registration, Trade license
• **Government Schemes** - PMEGP, Mudra, Delhi Startup Policy
• **Documentation** - Required documents, processes, timelines
• **Fee Calculation** - Cost estimates for various registrations
• **Application Status** - How to track your submissions

Ask me anything about starting your business in Delhi!`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('chat.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('chat.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Questions */}
            {state.chatHistory.length <= 1 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('chat.popularQuestions')}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {predefinedQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(item.question)}
                      className="flex items-start space-x-3 p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.question}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Chat Messages */}
            <Card className="h-[600px] flex flex-col overflow-hidden">
            <Card className="min-h-[500px] max-h-[70vh] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-xs lg:max-w-md ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <div 
                          className="text-xs whitespace-pre-wrap break-words"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.message) }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 input-field"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isTyping}
                    icon={Send}
                  >
                    {t('chat.send')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('chat.quickActions')}</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <action.icon className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Help Topics */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('chat.helpTopics')}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.companyRegistration') || 'Company Registration'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.gstRegistration') || 'GST Registration'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.fssaiLicense') || 'FSSAI License'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.tradeLicense') || 'Trade License'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.dpiitRecognition') || 'DPIIT Recognition'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.governmentSchemes') || 'Government Schemes'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.complianceCalendar') || 'Compliance Calendar'}</p>
                <p className="text-gray-600 dark:text-gray-300">• {t('chat.documentRequirements') || 'Document Requirements'}</p>
              </div>
            </Card>

            {/* Contact Support */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('chat.needHumanHelp')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t('chat.complexQueries') || 'For complex queries, reach out to our compliance experts.'}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                {t('chat.contactSupport')}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;