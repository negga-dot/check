import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.wizard': 'Setup Wizard',
    'nav.tracker': 'Tracker',
    'nav.calendar': 'Calendar',
    'nav.schemes': 'Schemes',
    'nav.documents': 'Documents',
    'nav.chat': 'AI Assistant',
    
    // Landing Page
    'landing.hero.title': 'Simplify Your Startup Journey in Delhi',
    'landing.hero.subtitle': 'Get all licenses, track compliance, discover schemes - all in one place. Turn months of bureaucracy into weeks of progress.',
    'landing.hero.cta': 'Start Setup Wizard',
    'landing.hero.demo': 'View Demo',
    
    // Features
    'features.title': 'Everything You Need to Launch',
    'features.subtitle': 'From registration to compliance, we\'ve got every aspect of your startup journey covered',
    'features.setup.title': 'Setup Guide',
    'features.setup.desc': 'Step-by-step wizard to identify and track all required licenses and approvals',
    'features.tracker.title': 'Approval Tracker',
    'features.tracker.desc': 'Real-time tracking of your application status across multiple departments',
    'features.schemes.title': 'Scheme Finder',
    'features.schemes.desc': 'Discover government schemes and funding opportunities tailored to your business',
    'features.calendar.title': 'Compliance Calendar',
    'features.calendar.desc': 'Never miss deadlines with automated reminders for renewals and filings',
    
    // Wizard
    'wizard.title': 'Setup Wizard',
    'wizard.step1.title': 'What type of business are you starting?',
    'wizard.step2.title': 'Tell us about your business',
    'wizard.step3.title': 'Required Approvals',
    'wizard.step4.title': 'Your Setup Plan is Ready!',
    'wizard.business.manufacturing': 'MSME Manufacturing',
    'wizard.business.service': 'Service Company',
    'wizard.business.food': 'Food Business',
    'wizard.business.export': 'Export Business',
    'wizard.business.retail': 'Retail Store',
    
    // Calendar
    'calendar.title': 'Compliance Calendar',
    'calendar.subtitle': 'Never miss a deadline or renewal date',
    'calendar.today': 'Today\'s Tasks',
    'calendar.upcoming': 'Upcoming (7 days)',
    'calendar.month': 'Month',
    'calendar.week': 'Week',
    'calendar.add': 'Add Event',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.backup': 'Backup',
    
    // Footer
    'footer.copyright': '© LaunchMate 2025',
    'footer.made_by': 'Made by Team XYZ for Industrial Ideathon 2025',
    'footer.newsletter.title': 'Stay Updated',
    'footer.newsletter.subtitle': 'Get the latest updates on compliance and schemes',
    'footer.newsletter.placeholder': 'Enter your email',
    'footer.newsletter.subscribe': 'Subscribe',
    'footer.links.home': 'Home',
    'footer.links.features': 'Features',
    'footer.links.contact': 'Contact',
    'footer.links.privacy': 'Privacy',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.wizard': 'सेटअप विज़ार्ड',
    'nav.tracker': 'ट्रैकर',
    'nav.calendar': 'कैलेंडर',
    'nav.schemes': 'योजनाएं',
    'nav.documents': 'दस्तावेज़',
    'nav.chat': 'AI सहायक',
    
    // Landing Page
    'landing.hero.title': 'दिल्ली में अपनी स्टार्टअप यात्रा को सरल बनाएं',
    'landing.hero.subtitle': 'सभी लाइसेंस प्राप्त करें, अनुपालन ट्रैक करें, योजनाओं की खोज करें - सब एक ही स्थान पर। महीनों की नौकरशाही को हफ्तों की प्रगति में बदलें।',
    'landing.hero.cta': 'सेटअप विज़ार्ड शुरू करें',
    'landing.hero.demo': 'डेमो देखें',
    
    // Features
    'features.title': 'लॉन्च के लिए आवश्यक सब कुछ',
    'features.subtitle': 'पंजीकरण से अनुपालन तक, हमारे पास आपकी स्टार्टअप यात्रा के हर पहलू का समाधान है',
    'features.setup.title': 'सेटअप गाइड',
    'features.setup.desc': 'सभी आवश्यक लाइसेंस और अनुमोदन की पहचान और ट्रैकिंग के लिए चरणबद्ध विज़ार्ड',
    'features.tracker.title': 'अनुमोदन ट्रैकर',
    'features.tracker.desc': 'कई विभागों में आपकी आवेदन स्थिति की वास्तविक समय ट्रैकिंग',
    'features.schemes.title': 'योजना खोजकर्ता',
    'features.schemes.desc': 'आपके व्यवसाय के अनुकूल सरकारी योजनाओं और फंडिंग अवसरों की खोज करें',
    'features.calendar.title': 'अनुपालन कैलेंडर',
    'features.calendar.desc': 'नवीनीकरण और फाइलिंग के लिए स्वचालित रिमाइंडर के साथ कभी भी समय सीमा न चूकें',
    
    // Wizard
    'wizard.title': 'सेटअप विज़ार्ड',
    'wizard.step1.title': 'आप किस प्रकार का व्यवसाय शुरू कर रहे हैं?',
    'wizard.step2.title': 'हमें अपने व्यवसाय के बारे में बताएं',
    'wizard.step3.title': 'आवश्यक अनुमोदन',
    'wizard.step4.title': 'आपकी सेटअप योजना तैयार है!',
    'wizard.business.manufacturing': 'MSME विनिर्माण',
    'wizard.business.service': 'सेवा कंपनी',
    'wizard.business.food': 'खाद्य व्यवसाय',
    'wizard.business.export': 'निर्यात व्यवसाय',
    'wizard.business.retail': 'खुदरा स्टोर',
    
    // Calendar
    'calendar.title': 'अनुपालन कैलेंडर',
    'calendar.subtitle': 'कभी भी समय सीमा या नवीनीकरण तिथि न चूकें',
    'calendar.today': 'आज के कार्य',
    'calendar.upcoming': 'आगामी (7 दिन)',
    'calendar.month': 'महीना',
    'calendar.week': 'सप्ताह',
    'calendar.add': 'इवेंट जोड़ें',
    
    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.loading': 'लोड हो रहा है...',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.export': 'निर्यात',
    'common.import': 'आयात',
    'common.backup': 'बैकअप',
    
    // Footer
    'footer.copyright': '© लॉन्चमेट 2025',
    'footer.made_by': 'टीम XYZ द्वारा इंडस्ट्रियल आइडियाथॉन 2025 के लिए बनाया गया',
    'footer.newsletter.title': 'अपडेट रहें',
    'footer.newsletter.subtitle': 'अनुपालन और योजनाओं पर नवीनतम अपडेट प्राप्त करें',
    'footer.newsletter.placeholder': 'अपना ईमेल दर्ज करें',
    'footer.newsletter.subscribe': 'सब्सक्राइब करें',
    'footer.links.home': 'होम',
    'footer.links.features': 'फीचर्स',
    'footer.links.contact': 'संपर्क',
    'footer.links.privacy': 'प्राइवेसी',
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};