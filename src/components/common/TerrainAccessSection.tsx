import { useState } from 'react';
import { Drone, Layers, Route, ArrowUpRight, CheckCircle2, AlertTriangle, ScanLine } from 'lucide-react';
import type { CareMatchResult } from '../../utils/careMatch';
import type { Facility } from '../../data/facilityData';
import './TerrainAccessSection.css';

type Scenario = 'debris' | 'water' | 'clear' | 'unknown';
const scenarios: { id: Scenario; label: string }[] = [
  { id: 'debris', label: 'Road obstruction' },
  { id: 'water', label: 'Flooded crossing' },
  { id: 'clear', label: 'Clear routes' },
  { id: 'unknown', label: 'No survey data' },
];
const observations: Record<Scenario, { road: string; water: string; debris: string; bridge: string; detail: string }> = {
  debris: { road: 'Obstructed', water: 'Not flagged', debris: 'On road', bridge: 'Not flagged', detail: 'A debris observation is assigned to the direct road segment. This scenario excludes that route from the preview.' },
  water: { road: 'Crossing closed', water: 'On crossing', debris: 'Not flagged', bridge: 'Access blocked', detail: 'Water is flagged at the crossing. The direct route is excluded until access is verified; a visible bridge alone does not establish safe passage.' },
  clear: { road: 'Passable in demo', water: 'Not flagged', debris: 'Not flagged', bridge: 'Passable in demo', detail: 'Both illustrated routes are marked passable in this scenario. Existing care suitability determines the preferred candidate.' },
  unknown: { road: 'Unknown', water: 'Unknown', debris: 'Unknown', bridge: 'Unknown', detail: 'Without a usable, georeferenced survey, route access remains unknown. No terrain-based recommendation is issued.' },
};

export function TerrainAccessSection({ matches, origin, onViewFacility }: {
  matches: CareMatchResult[]; origin: string; onViewFacility: (facility: Facility) => void;
}) {
  const [scenario, setScenario] = useState<Scenario>('debris');
  // This preview keeps the existing score order and excludes unsuitable facilities.
  const candidates = matches.filter(m => m.suitability === 'High' && m.facility.acceptingReferrals && m.facility.doctors.some(d => d.status === 'Available'));
  const closest = [...candidates].sort((a, b) => a.facility.distanceKm - b.facility.distanceKm)[0];
  const blocked = scenario === 'debris' || scenario === 'water';
  const recommendation = scenario === 'unknown' ? undefined : candidates.find(m => !blocked || m.facility.id !== closest?.facility.id);
  const alternative = candidates.find(m => m.facility.id !== closest?.facility.id);
  const shown = closest ? [closest, ...(alternative ? [alternative] : [])] : [];
  const observation = observations[scenario];

  return <section className="terrain-access" aria-labelledby="terrain-title">
    <header className="terrain-heading">
      <div><span className="terrain-eyebrow"><Drone size={16} /> PHYSICAL ACCESS INTELLIGENCE</span>
        <h2 id="terrain-title">Care within reach</h2>
        <p>Bring road conditions into the search for appropriate care.</p>
      </div>
      <span className="terrain-demo">Interactive demo · No live drone feed</span>
    </header>
    <div className="terrain-stages" aria-label="Route assessment workflow">
      {[
        [Drone, '01', 'Observe', 'Drone imagery'],
        [ScanLine, '02', 'Detect', 'YOLO object observations'],
        [Layers, '03', 'Assess', 'GIS, terrain & slope'],
        [Route, '04', 'Compare', 'Access + care capability'],
      ].map(([Icon, number, title, detail]) => {
        const StageIcon = Icon as typeof Drone;
        return <div key={String(number)}><StageIcon size={20} /><span><strong>{String(number)} · {String(title)}</strong><small>{String(detail)}</small></span></div>;
      })}
    </div>
    <div className="terrain-scenarios" aria-label="Choose a simulated road condition">
      {scenarios.map(item => <button type="button" key={item.id} aria-pressed={scenario === item.id} onClick={() => setScenario(item.id)}>{item.label}</button>)}
    </div>
    <div className="terrain-grid">
      <div className="terrain-map-panel">
        <div className="terrain-map-title"><strong>Kerala hospital network</strong><span>OpenStreetMap · Online map</span></div>
        <iframe title="Interactive map of Kerala" className="kerala-map" src="https://www.openstreetmap.org/export/embed.html?bbox=74.7%2C8.1%2C77.6%2C12.9&layer=mapnik" loading="lazy" referrerPolicy="no-referrer" />
        <p className="terrain-origin">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · Basemap only; no live obstruction overlay.</p>
        <div className="kerala-hospital-links" aria-label="Find Kerala hospitals on the map">
          {matches.filter(m => m.facility.sourceUrl).map(m => <a key={m.facility.id} href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(m.facility.name + ', Kerala, India')}`} target="_blank" rel="noreferrer">{m.facility.shortName} ↗</a>)}
        </div>
        <p className="terrain-origin">Patient record: {origin || 'No location recorded'} · Demo distances are not routes from this patient’s location.</p>
        <div className="terrain-detections">{Object.entries(observation).filter(([key]) => key !== 'detail').map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div>
        <p className="terrain-note">{observation.detail}</p>
        <div className="terrain-terrain"><Layers size={17} /><span><strong>Terrain check</strong> Terrain and slope data are not connected to this map. Road conditions below are scenario inputs, not detections from Kerala imagery.</span></div>
      </div>
      <div className="terrain-results" aria-live="polite">
        <h3>Compare reachable care</h3>
        {shown.map((match, index) => {
          const obstructed = blocked && match.facility.id === closest?.facility.id;
          const chosen = recommendation?.facility.id === match.facility.id;
          const xray = match.facility.diagnostics.some(d => /x-ray/i.test(d.name) && d.status === 'Available');
          return <article key={match.facility.id} className={`terrain-facility${chosen ? ' terrain-chosen' : ''}`}>
            <div className="terrain-facility-top"><span className="terrain-letter">{index === 0 ? 'A' : 'B'}</span><strong>{match.facility.shortName}</strong><span>{match.facility.distanceKm} km (demo)</span></div>
            <p className={obstructed || scenario === 'unknown' ? 'terrain-blocked' : ''}>{obstructed || scenario === 'unknown' ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}{scenario === 'unknown' ? 'Access not verified' : obstructed ? 'Excluded from route preview' : 'Accessible in this scenario'}</p>
            <div className="terrain-capabilities"><span>X-Ray: {xray ? 'Available' : 'Not available'}</span><span>Doctors available: {match.facility.doctors.filter(d => d.status === 'Available').length}</span><span>Care suitability: {match.suitability}</span></div>
          </article>;
        })}
        <div className="terrain-recommendation"><span className="terrain-eyebrow">{recommendation ? 'SCENARIO RECOMMENDATION' : 'VERIFICATION NEEDED'}</span>
          <h3>{recommendation?.facility.shortName || 'No verified reachable candidate'}</h3>
          <p>{recommendation ? 'Highest-ranked eligible care match after applying this simulated route restriction. Distances are illustrative demo values, not calculated travel routes.' : 'Confirm route access and facility suitability with the care team before choosing a destination.'}</p>
          {recommendation && <button type="button" onClick={() => onViewFacility(recommendation.facility)}>Review facility <ArrowUpRight size={16} /></button>}
        </div>
      </div>
    </div>
    <footer className="terrain-footer"><strong>Appropriate care. A route the patient can actually use.</strong><span>Preview only: no camera inference, GIS routing or live access verification is running. Existing referral rankings stay unchanged.</span></footer>
  </section>;
}
