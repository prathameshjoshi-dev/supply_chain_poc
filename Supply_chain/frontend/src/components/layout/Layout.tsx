import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../features/auth/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  tabs?: { label: string; active?: boolean; onClick?: () => void }[];
}

export const Layout: React.FC<LayoutProps> = ({ children, pageTitle = 'Dashboard', tabs = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="font-body-md text-body-md selection:bg-primary/30 bg-background-deep min-h-screen text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-surface-container-low backdrop-blur-xl border-r border-border-subtle w-64 shadow-xl">
        <div className="p-6">
          <h1 className="font-headline-sm text-headline-sm font-black text-primary tracking-tight">Nexus Control</h1>
          <p className="text-[10px] font-label-md text-on-surface-variant/60 uppercase tracking-widest mt-1">Enterprise Logistics</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <button onClick={() => navigate('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-all rounded-lg group ${location.pathname.includes('dashboard') ? 'text-on-surface bg-surface-variant' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined ${location.pathname.includes('dashboard') ? 'text-primary' : 'text-primary/70 group-hover:text-primary'}`}>dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </button>
          <button onClick={() => navigate('/users')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-all rounded-lg group ${location.pathname.includes('users') ? 'text-on-surface bg-surface-variant' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined ${location.pathname.includes('users') ? 'text-primary' : 'text-primary/70 group-hover:text-primary'}`}>group</span>
            <span className="font-label-md text-label-md">Users</span>
          </button>
          <a 
            className={`flex items-center gap-3 px-4 py-3 transition-all ${location.pathname.startsWith('/inventory') ? 'text-primary bg-primary/10 border-l-4 border-primary rounded-r-lg group' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg group'}`} 
            href="/inventory"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={location.pathname.startsWith('/inventory') ? { fontVariationSettings: "'FILL' 1" } : {}}>inventory_2</span>
            <span className="font-label-md text-label-md">Inventory</span>
          </a>
          <button onClick={() => navigate('/shipments')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-all rounded-lg group ${location.pathname.includes('shipments') ? 'text-on-surface bg-surface-variant' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined ${location.pathname.includes('shipments') ? 'text-primary' : 'text-primary/70 group-hover:text-primary'}`}>local_shipping</span>
            <span className="font-label-md text-label-md">Shipments</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg group">
            <span className="material-symbols-outlined text-primary/70 group-hover:text-primary">account_tree</span>
            <span className="font-label-md text-label-md">Workflows</span>
          </button>
        </nav>
        <div className="p-4 border-t border-border-subtle space-y-1">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 transition-all rounded-lg group">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 min-h-screen relative overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 flex justify-between items-center px-margin-desktop bg-surface-glass backdrop-blur-md border-b border-border-subtle sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary">{pageTitle}</h2>
            {tabs.length > 0 && <div className="h-6 w-[1px] bg-border-subtle hidden md:block"></div>}
            
            {tabs.length > 0 && (
              <nav className="hidden md:flex gap-6">
                {tabs.map((tab, idx) => (
                  <button 
                    key={idx}
                    onClick={tab.onClick}
                    className={`py-5 transition-colors ${tab.active ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
              <input className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64 transition-all text-on-surface placeholder-on-surface-variant" placeholder="Global search..." type="text"/>
            </div>
            <button onClick={() => navigate('/notifications')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-variant hover:bg-surface-variant/80 transition-transform active:scale-90 relative text-on-surface">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface-variant"></span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center bg-primary/20 text-primary font-bold">
              {user?.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 <span className="uppercase">{user?.email?.charAt(0) || 'U'}</span>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Container */}
        <div className="p-margin-desktop space-y-gutter max-w-container-max mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
