import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { LoginPage } from './features/auth/pages/LoginPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { NotificationsPage } from './features/notifications/pages/NotificationsPage';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

const AuthBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen flex items-center justify-center font-body-md text-body-md overflow-hidden bg-background-deep">
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(89,216,224,0.08),transparent_70%)]"></div>
      <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#59d8e0" stopOpacity="0"></stop>
            <stop offset="50%" stopColor="#59d8e0" stopOpacity="0.5"></stop>
            <stop offset="100%" stopColor="#59d8e0" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#lineGrad)" strokeWidth="1.5">
          <path className="network-line" d="M-100 200 Q 200 100 500 300 T 1200 150" style={{ animationDuration: '15s' }}></path>
          <path className="network-line" d="M-200 600 Q 400 400 800 600 T 1500 400" style={{ animationDuration: '22s' }}></path>
          <path className="network-line" d="M-50 800 Q 300 900 600 700 T 1300 850" style={{ animationDuration: '18s' }}></path>
        </g>
        <circle className="animate-pulse" cx="500" cy="300" fill="#59d8e0" r="4"></circle>
        <circle className="animate-pulse" cx="800" cy="600" fill="#59d8e0" r="3" style={{ animationDelay: '1s' }}></circle>
        <circle className="animate-pulse" cx="600" cy="700" fill="#59d8e0" r="5" style={{ animationDelay: '2s' }}></circle>
      </svg>
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-secondary/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }}></div>
    </div>
    {children}
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/login" element={<AuthBackground><LoginPage /></AuthBackground>} />
          <Route path="/workflows" element={<div className="p-8 text-on-surface">Workflows coming soon</div>} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/reporting" element={<div className="p-8 text-on-surface">Reporting coming soon</div>} />
          <Route path="/users" element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={<Navigate to="/users" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
