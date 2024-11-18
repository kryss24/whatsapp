// import React from 'react';
import { Auth } from './pages/Auth';
import { ChatApp } from './components/ChatApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, /*Route, Routes*/ } from 'react-router-dom';

function AppContent() {
  const { user } = useAuth();
  return user ? <ChatApp /> : <Auth />;
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;