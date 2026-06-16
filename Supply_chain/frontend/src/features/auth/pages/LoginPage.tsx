import React, { useState } from 'react';
import { useLoginMutation, useSsoLoginMutation } from '../api/authApi';
import { useGoogleLogin } from '@react-oauth/google';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const [ssoLogin, { isLoading: isSsoLoading }] = useSsoLoginMutation();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await ssoLogin({ provider: 'google', code: tokenResponse.access_token }).unwrap();
        console.log('Google login successful:', result);
        // Store token, redirect
      } catch (err) {
        console.error('Google login failed:', err);
      }
    },
    onError: () => {
      console.error('Google login failed');
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      console.log('Login successful:', result);
      // Store token, redirect
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <main className="relative z-10 w-full max-w-[480px] px-margin-mobile md:px-0">
      <div className="glass-card p-8 md:p-12 rounded-xl shadow-xl transition-all duration-300">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight">Nexus Logistics</h1>
          <p className="font-body-md text-on-surface-variant">Intelligence Platform Access</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm">Login failed. Please check your credentials.</div>}
          
          <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="email">Corporate Email</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[20px]">alternate_email</span>
              <input 
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 input-focus-ring transition-all" 
                id="email" 
                placeholder="operator@nexus.logistics" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="password">Access Key</label>
              <a className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors" href="#">Forgot password?</a>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[20px]">lock</span>
              <input 
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-3.5 pl-12 pr-12 text-on-surface placeholder:text-outline/50 input-focus-ring transition-all" 
                id="password" 
                placeholder="••••••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input 
              className="w-4 h-4 rounded border-border-subtle bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-background-deep" 
              id="remember" 
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="ml-3 font-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember this station</label>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary py-4 rounded-lg font-label-md text-label-md text-on-primary-container uppercase tracking-widest font-bold shadow-lg shadow-primary/20 hover:bg-primary-fixed-dim active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle"></div>
          </div>
          <div className="relative flex justify-center text-label-md font-label-md uppercase tracking-widest text-outline/60 bg-transparent px-4">
            <span className="bg-[#1e293b]/50 px-4">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => handleGoogleLogin()}
            disabled={isSsoLoading}
            className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-high border border-border-subtle rounded-lg hover:bg-surface-variant transition-colors group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-on-surface-variant font-label-md group-hover:text-on-surface">
              {isSsoLoading ? 'Connecting...' : 'Google'}
            </span>
          </button>
          <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-high border border-border-subtle rounded-lg hover:bg-surface-variant transition-colors group">
            <svg className="w-5 h-5" viewBox="0 0 23 23">
              <path d="M0 0h11v11H0z" fill="#f3f3f3"></path>
              <path d="M12 0h11v11H12z" fill="#f3f3f3"></path>
              <path d="M0 12h11v11H0z" fill="#f3f3f3"></path>
              <path d="M12 12h11v11H12z" fill="#f3f3f3"></path>
            </svg>
            <span className="text-on-surface-variant font-label-md group-hover:text-on-surface">Azure AD</span>
          </button>
        </div>
      </div>
      
      <footer className="mt-8 flex justify-between px-2">
        <div className="flex gap-6">
          <a className="font-label-md text-label-md text-outline hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-md text-label-md text-outline hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
        <div className="font-label-md text-label-md text-outline/40">
            v2.4.0-Stable
        </div>
      </footer>
    </main>
  );
};
