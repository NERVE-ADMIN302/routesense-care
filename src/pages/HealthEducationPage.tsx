import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Baby,
  Activity,
  AlertTriangle,
  Clock,
  ChevronRight,
  Globe,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';
import { HEALTH_EDUCATION_ARTICLES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const HealthEducationPage: React.FC = () => {
  const { language, toggleLanguage, showToast } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Hypertension', 'Maternal Health', 'Diabetes', 'Emergency Awareness'];

  const filteredArticles = HEALTH_EDUCATION_ARTICLES.filter((art) => {
    return categoryFilter === 'All' || art.category === categoryFilter;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-200 shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'ta' ? 'சுகாதார விழிப்புணர்வு & கல்வி' : 'Community Health Education'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'ta'
                ? 'கிராமப்புற நோயாளிகளுக்கான எளிய தமிழ் வழிகாட்டல்கள் மற்றும் ஆலோசனைகள்'
                : 'Accessible, culturally adapted preventative health guides for rural families'}
            </p>
          </div>
        </div>

        {/* Language quick switcher pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Language:
          </span>
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-900 text-white shadow-xs hover:bg-emerald-950 transition-all cursor-pointer btn-lift"
          >
            {language === 'ta' ? 'English பதிப்பு' : 'தமிழ் பதிப்பு'}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer btn-lift ${
              categoryFilter === cat
                ? 'bg-emerald-900 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art, idx) => {
          const title = language === 'ta' ? art.titleTa : art.title;
          const description = language === 'ta' ? art.descriptionTa : art.description;
          const category = language === 'ta' ? art.categoryTa : art.category;

          return (
            <div
              key={art.id}
              className={`bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover-lift transition-all flex flex-col justify-between group animate-fade-in-up delay-${Math.min((idx + 1) * 100, 400)} hover:border-emerald-300`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Verified by NHM
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(art)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer btn-lift"
                >
                  <span>{language === 'ta' ? 'முழுவதும் வாசிக்க' : 'Read Article'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-scale-up">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {language === 'ta' ? selectedArticle.categoryTa : selectedArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  {language === 'ta' ? selectedArticle.titleTa : selectedArticle.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="prose prose-sm text-slate-700 leading-relaxed text-xs sm:text-sm space-y-3 whitespace-pre-line">
              {language === 'ta' ? selectedArticle.contentTa : selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  showToast('Pamphlet sent to patient mobile number via WhatsApp SMS', 'success');
                  setSelectedArticle(null);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold border border-emerald-700 text-emerald-900 hover:bg-emerald-50 flex items-center gap-1.5 cursor-pointer btn-lift"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Patient (SMS / WhatsApp)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
