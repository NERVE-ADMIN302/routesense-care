import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, HeartPulse, CalendarDays, Grid2X2, Bell, ArrowLeft } from 'lucide-react';
import { App as NativeApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { BrandLogo } from '../common/BrandLogo';
import { Toast } from '../common/Toast';
import { useApp } from '../../context/AppContext';

const tabs = [
  { path: '/dashboard', name: 'Home', icon: Home },
  { path: '/patients', name: 'Patients', icon: Users },
  { path: '/care-match', name: 'Care', icon: HeartPulse },
  { path: '/appointments', name: 'Visits', icon: CalendarDays },
  { path: '/services', name: 'Services', icon: Grid2X2 },
];
export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = useRef<HTMLElement>(null);
  const { unreadNotificationCount, isOffline } = useApp();
  useEffect(() => {
    content.current?.scrollTo(0, 0);
    if (location.hash) {
      const frame = requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
      return () => cancelAnimationFrame(frame);
    }
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const listener = NativeApp.addListener('backButton', () => {
      if (location.pathname === '/' || location.pathname === '/dashboard') NativeApp.minimizeApp();
      else if (window.history.state?.idx > 0) navigate(-1);
      else navigate('/dashboard');
    });
    return () => { listener.then(handle => handle.remove()); };
  }, [location.pathname, navigate]);
  const landing = location.pathname === '/';
  const primary = tabs.some(t => t.path === location.pathname);
  const activeTab = location.pathname.startsWith('/patient') || location.pathname === '/register' ? '/patients' : location.pathname === '/triage' ? '/care-match' : tabs.some(t => t.path === location.pathname) ? location.pathname : '/services';
  return <div className={`mobile-app ${landing ? 'is-welcome' : ''}`} data-page={location.pathname.split('/')[1]}>
    {!landing && <header className="mobile-header">
      <div className="mobile-brand-group">
        {!primary && <button className="circle-button" aria-label="Go back" onClick={() => window.history.state?.idx > 0 ? navigate(-1) : navigate('/dashboard')}><ArrowLeft size={20}/></button>}
        <button className="mobile-brand" aria-label="CareMizhi welcome page" onClick={() => navigate('/')}><BrandLogo subtitle={isOffline ? 'Offline mode' : 'Connected care'}/></button>
      </div>
      <button className="circle-button notification-button" aria-label={`Notifications, ${unreadNotificationCount} unread`} onClick={() => navigate('/notifications')}><Bell size={20}/>{unreadNotificationCount > 0 && <i/>}</button>
    </header>}
    <main ref={content} id="main-content" className={`mobile-content ${landing ? '' : 'app-pages'}`}><Outlet/></main>
    {!landing && <nav className="mobile-dock" aria-label="Main navigation">{tabs.map(({path,name,icon:Icon}) => <NavLink key={path} to={path} className={() => `dock-item ${activeTab === path ? 'selected' : ''}`} aria-current={activeTab === path ? 'page' : undefined}><span><Icon size={21}/></span><small>{name}</small></NavLink>)}</nav>}
    <Toast/>
  </div>;
};
