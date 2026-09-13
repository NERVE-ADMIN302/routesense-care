import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { getOfflineQueue, addToOfflineQueue, clearOfflineQueue, getLastSyncTime } from '../utils/offlineSync';

export type UserRole = 'health_worker' | 'doctor' | 'facility' | 'admin';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'urgent' | 'warning' | 'info';
  link?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['en']) => string;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  toggleOffline: () => void;
  offlineQueueCount: number;
  lastSyncTime: string;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  selectedFacility: string;
  setSelectedFacility: (fac: string) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Urgent Vitals Alert: Ravi Kumar (CL-02491)',
    message: 'SpO₂ 91% & BP 154/92 recorded at Triage Desk. Matched to Pollachi Rural Hospital.',
    time: '10 mins ago',
    read: false,
    priority: 'urgent',
    link: '/care-match',
  },
  {
    id: 'n2',
    title: 'Referral Accepted: CL-1042',
    message: 'Rural Hospital Pollachi accepted respiratory care referral for Ravi Kumar.',
    time: '25 mins ago',
    read: false,
    priority: 'info',
    link: '/referrals',
  },
  {
    id: 'n3',
    title: 'High-Risk Follow-up: Lakshmi S. (CL-04118)',
    message: 'ANC 2nd trimester anemia review due today with ASHA Meena.',
    time: '45 mins ago',
    read: false,
    priority: 'warning',
    link: '/follow-ups',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('carelink_lang') as Language) || 'en';
  });

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(() => getOfflineQueue().length);
  const [lastSyncTime, setLastSyncTime] = useState<string>(getLastSyncTime);
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('carelink_role') as UserRole) || 'health_worker';
  });

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem('carelink_role', role);
  };

  const [selectedFacility, setSelectedFacility] = useState<string>('Government Medical College, Thrissur');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [demoStep, setDemoStep] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem('carelink_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : prev === 'ta' ? 'hi' : 'en'));
  };

  const t = (key: keyof typeof translations['en']): string => {
    return (translations[language] && translations[language][key]) || translations['en'][key] || String(key);
  };

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  const toggleOffline = () => {
    setIsOffline((prev) => {
      const nextState = !prev;
      if (nextState) {
        // Turning offline
        addToOfflineQueue('assessment', 'Offline session initiated', { time: new Date().toISOString() });
        setOfflineQueueCount(getOfflineQueue().length);
        showToast(
          language === 'ta'
            ? 'ஆஃப்லைன் முறை செயலில் உள்ளது. விவரங்கள் உள்ளூரில் சேமிக்கப்பட்டு பின்னர் ஒத்திசைக்கப்படும்.'
            : language === 'hi'
            ? 'ऑफलाइन मोड सक्रिय: डेटा स्थानीय रूप से सुरक्षित रहेगा और ऑनलाइन आने पर सिंक होगा।'
            : 'Offline Mode Active: Essential field workflows remain available offline. Records will sync when connected.',
          'warning'
        );
      } else {
        // Turning online - sync simulation
        const syncedCount = clearOfflineQueue() || 4;
        setOfflineQueueCount(0);
        const syncTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(syncTime);
        showToast(
          language === 'ta'
            ? `இணைப்பு மீட்டமைக்கப்பட்டது: ${syncedCount} பதிவுகள் மாவட்ட சுகாதார தளத்துடன் ஒத்திசைக்கப்பட்டது.`
            : language === 'hi'
            ? `कनेक्टिविटी पुनः स्थापित: ${syncedCount} रिकॉर्ड्स जिला स्वास्थ्य नेटवर्क से सिंक हुए।`
            : `Connection restored: Syncing... ✓ Patients ✓ Assessments ✓ Referrals (${syncedCount} records synced)`,
          'success'
        );
      }
      return nextState;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isOffline,
        setIsOffline,
        toggleOffline,
        offlineQueueCount,
        lastSyncTime,
        activeRole,
        setActiveRole,
        selectedFacility,
        setSelectedFacility,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsRead,
        toast,
        showToast,
        demoStep,
        setDemoStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
