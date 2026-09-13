import React from 'react';
import { MapPin, Clock, ChevronRight, Stethoscope, FlaskConical, Video, ShieldCheck, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { CareMatchResult } from '../../utils/careMatch';

interface FacilityCardProps {
  match: CareMatchResult;
  isHeroMatch?: boolean;
  onProceedConsultation?: () => void;
  onCreateReferral?: () => void;
  onViewFacility?: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  match,
  isHeroMatch = false,
  onProceedConsultation,
  onCreateReferral,
  onViewFacility,
}) => {
  const { facility, score, recommendation, reasons, missingCapabilities } = match;
  const best = isHeroMatch || recommendation === 'BEST MATCH';

  return (
    <article className={`hospital-card ${best ? 'recommended' : ''} text-left animate-fade-in-up`}>
      <div className="hospital-card-top">
        <div className="flex items-center gap-2">
          <span className={`hospital-label flex items-center gap-1 ${
            best ? 'bg-blue-100 text-blue-800 border border-blue-200 font-bold' : ''
          }`}>
            {best && <Sparkles className="w-3 h-3 text-blue-600" />}
            <span>{best ? 'Top Recommended Match' : facility.type || 'Care Option'}</span>
          </span>
          {facility.tierLevel === 3 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Tertiary Care
            </span>
          )}
        </div>

        <div className="hospital-score flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
            {score}
          </div>
          <span className="text-xs font-medium text-slate-500">Score</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <h3>{facility.name}</h3>
          <p className="hospital-location">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <span>{facility.location}</span>
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start">
          {facility.distanceKm} km away
        </div>
      </div>

      <div className="hospital-facts">
        <span>
          <Clock size={15} className="text-slate-400" />
          <span>~{facility.estimatedWaitMins} min queue</span>
        </span>
        <span className={facility.acceptingReferrals ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
          <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${facility.acceptingReferrals ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {facility.acceptingReferrals ? 'Referrals Open' : 'Queue Full'}
        </span>
      </div>

      <dl className="hospital-capabilities">
        <div>
          <dt>
            <Stethoscope size={16} className="text-blue-600" />
            <span>Doctor Available</span>
          </dt>
          <dd>{facility.doctors[0]?.speciality || 'General Medicine'}</dd>
        </div>
        <div>
          <dt>
            <FlaskConical size={16} className="text-purple-600" />
            <span>Diagnostics</span>
          </dt>
          <dd className="truncate">
            {facility.diagnostics.filter((d) => d.status === 'Available').map((d) => d.name).slice(0, 2).join(', ') || 'Standard Lab'}
          </dd>
        </div>
        <div>
          <dt>
            <Video size={16} className="text-sky-600" />
            <span>Teleconsult</span>
          </dt>
          <dd>{facility.teleconsultation || 'Available'}</dd>
        </div>
        <div>
          <dt>
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Emergency / ICU</span>
          </dt>
          <dd>{facility.emergency || '24/7 Casualty'}</dd>
        </div>
      </dl>

      <details className="hospital-reasons">
        <summary className="flex items-center gap-1.5 cursor-pointer">
          <span>Clinical match rationale</span>
          <ChevronRight size={14} className="transition-transform duration-200" />
        </summary>
        <ul className="mt-2">
          {reasons.map((r, i) => (
            <li key={i} className="text-xs text-slate-600">{r}</li>
          ))}
        </ul>
        {missingCapabilities.length > 0 && (
          <div className="hospital-missing mt-2">
            <b className="flex items-center gap-1 text-xs">
              <AlertCircle size={13} /> Missing / Pending Capabilities:
            </b>
            <ul className="mt-1">
              {missingCapabilities.map((m, i) => (
                <li key={i} className="text-xs">{m}</li>
              ))}
            </ul>
          </div>
        )}
      </details>

      <div className="hospital-actions">
        <button
          type="button"
          onClick={onCreateReferral}
          disabled={!facility.acceptingReferrals}
          className="btn-lift"
        >
          <span>Create Referral</span>
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={onProceedConsultation}
          className="btn-lift"
        >
          <span>Assisted Consult</span>
          <Video size={16} />
        </button>
      </div>

      <div className="hospital-links">
        <button type="button" onClick={onViewFacility}>
          View facility details & doctors
        </button>
        {facility.website && (
          <a href={facility.website} target="_blank" rel="noreferrer" className="flex items-center gap-1">
            <span>Official Portal</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
};
