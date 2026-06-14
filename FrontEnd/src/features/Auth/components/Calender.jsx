import React, { useState, useCallback, useEffect } from 'react';
import './styles/calender.scss';

const LS_KEY = 'roadmap-calendar-events';

// ─── Constants ───────────────────────────────────────────────────────────────
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const PRIORITIES = [
  { key: 'start',     label: 'Start Day' },
  { key: 'end',       label: 'End Day'   },
  { key: 'milestone', label: 'Milestone' },
  { key: 'high',      label: 'High'      },
  { key: 'medium',    label: 'Medium'    },
  { key: 'low',       label: 'Low'       },
  { key: 'default',   label: 'Default'   },
  { key: 'clear',     label: 'Clear'     },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon … 6=Sun for first day of month */
function getFirstDayOfWeek(year, month) {
  const jsDay = new Date(year, month, 1).getDay(); // 0=Sun
  return (jsDay + 6) % 7; // shift so Mon=0
}

function buildGrid(year, month) {
  const totalDays   = getDaysInMonth(year, month);
  const startOffset = getFirstDayOfWeek(year, month);

  // Previous month fill
  const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: prevMonthDays - startOffset + 1 + i, outside: true });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, outside: false });
  }
  // Fill remainder to complete last row (always 6 rows = 42 cells)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, outside: true });
  }

  return cells;
}

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadEvents() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  // First-run seed (matches screenshot)
  const now = new Date();
  const y   = now.getFullYear();
  const m   = now.getMonth();
  return {
    [toKey(y, m, 1)]:  [{ label: 'System Audit',    priority: 'default' }],
    [toKey(y, m, 9)]:  [{ label: 'Skill Gap Review', priority: 'medium'  }],
    [toKey(y, m, 14)]: [{ label: 'Protocol Update',  priority: 'low'     }],
  };
}

function saveEvents(eventsMap) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(eventsMap)); } catch (_) {}
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function EventModal({ date, existing, onSave, onClose }) {
  const [label,    setLabel]    = useState(existing?.label    ?? '');
  const [priority, setPriority] = useState(existing?.priority ?? 'default');

  const handleSave = () => {
    if (priority === 'clear') { onSave(null); return; }
    if (!label.trim()) return;
    onSave({ label: label.trim(), priority });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Mark Target {date}</h2>

        <div className="modal-field">
          <label>Label</label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="e.g. Sprint kickoff"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="modal-field">
          <label>Priority / Type</label>
          <div className="priority-grid">
            {PRIORITIES.map(p => (
              <button
                key={p.key}
                className={`priority-btn${priority === p.key ? ' priority-btn--selected' : ''}`}
                data-p={p.key}
                onClick={() => setPriority(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save"   onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RoadmapCalendar() {
  const now = new Date();

  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [events,    setEvents]    = useState(loadEvents);
  const [modal,     setModal]     = useState(null); // { key, dateStr, existing }

  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  // Persist to localStorage on every change
  useEffect(() => { saveEvents(events); }, [events]);
  const grid     = buildGrid(viewYear, viewMonth);

  const prevMonth = () => {
    setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
  };
  const nextMonth = () => {
    setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });
  };

  const openModal = useCallback((cell) => {
    if (cell.outside) return;
    const key     = toKey(viewYear, viewMonth, cell.day);
    const dateStr = `${MONTH_NAMES[viewMonth]} ${cell.day}, ${viewYear}`;
    setModal({ key, dateStr, existing: events[key]?.[0] ?? null });
  }, [viewYear, viewMonth, events]);

  const handleSave = useCallback((payload) => {
    setEvents(prev => {
      const next = { ...prev };
      if (!payload) { delete next[modal.key]; }
      else          { next[modal.key] = [payload]; }
      return next;
    });
    setModal(null);
  }, [modal]);

  return (
    <div className="roadmap-wrapper">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="roadmap-header">
        <h1>Roadmap Tracker &amp; Event Calendar</h1>
        <div className="nav-controls">
          <button onClick={prevMonth}>PREV</button>
          <div className="nav-divider" />
          <span className="month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <div className="nav-divider" />
          <button onClick={nextMonth}>NEXT</button>
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────── */}
      <div className="roadmap-legend">
        {PRIORITIES.filter(p => p.key !== 'clear').map(p => (
          <div key={p.key} className="legend-item">
            <span className="legend-dot" style={{ background: getLegendColor(p.key) }} />
            {p.label}
          </div>
        ))}
      </div>

      {/* ── Calendar ───────────────────────────────────────────── */}
      <div className="calendar-shell">
        {/* Day headers */}
        <div className="cal-head">
          {DAYS.map(d => (
            <div key={d} className="cal-head-cell">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="cal-body">
          {grid.map((cell, idx) => {
            const key      = cell.outside ? null : toKey(viewYear, viewMonth, cell.day);
            const isToday  = key === todayKey;
            const cellEvts = key ? (events[key] ?? []) : [];

            let cls = 'cal-cell';
            if (cell.outside) cls += ' cal-cell--outside';
            if (isToday)      cls += ' cal-cell--today';

            return (
              <div
                key={idx}
                className={cls}
                onClick={() => openModal(cell)}
              >
                <div className="cal-cell-num">{cell.day}</div>
                {isToday && <span className="today-pill">Today</span>}

                {cellEvts.length > 0 && (
                  <div className="cal-events">
                    {cellEvts.map((ev, i) => (
                      <span key={i} className="event-tag" data-priority={ev.priority}>
                        {ev.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────── */}
      {modal && (
        <EventModal
          date={modal.dateStr}
          existing={modal.existing}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// Color lookup for legend dots (mirrors SCSS variables)
function getLegendColor(key) {
  const map = {
    start:     '#7ab8f5',
    end:       '#6dd4b0',
    milestone: '#f5c96d',
    high:      '#f57ab8',
    medium:    '#9b8ff5',
    low:       '#f4a09a',
    default:   '#111111',
  };
  return map[key] ?? '#aab0bc';
}