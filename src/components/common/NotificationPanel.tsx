import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, AlertCircle, FileText, Pill } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, language } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Panel Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ta' ? 'சுகாதார அறிவிப்புகள்' : 'Healthcare Alerts'}
                </h3>
                <p className="text-xs text-slate-500">
                  {notifications.filter((n) => !n.read).length} unread updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold p-1 hover:bg-emerald-50 rounded"
                title="Mark all as read"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.map((item) => {
              const iconMap = {
                urgent: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
                info: <FileText className="w-4 h-4 text-sky-600 shrink-0" />,
                warning: <Pill className="w-4 h-4 text-amber-600 shrink-0" />,
              };

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationAsRead(item.id);
                    if (item.link) {
                      navigate(item.link);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                    !item.read ? 'bg-emerald-50/40 font-medium' : ''
                  }`}
                >
                  <div className="mt-0.5">{iconMap[item.priority]}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      {item.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-xs text-slate-500">
              Coimbatore District Health Informatics Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
