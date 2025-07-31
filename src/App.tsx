import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import SetupWizard from './pages/SetupWizard';
import ApprovalTracker from './pages/ApprovalTracker';
import ComplianceCalendar from './pages/ComplianceCalendar';
import SchemeRecommender from './pages/SchemeRecommender';
import AIAssistant from './pages/AIAssistant';
import Dashboard from './pages/Dashboard';
import DocumentGenerator from './pages/DocumentGenerator';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wizard" element={<SetupWizard />} />
            <Route path="/tracker" element={<ApprovalTracker />} />
            <Route path="/calendar" element={<ComplianceCalendar />} />
            <Route path="/schemes" element={<SchemeRecommender />} />
            <Route path="/documents" element={<DocumentGenerator />} />
            <Route path="/chat" element={<AIAssistant />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;