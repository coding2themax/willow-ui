import { Inquiry, STATUS_BADGE } from './types'

const THIS_WEEK = ['May 2', 'May 3', 'May 1', 'Apr 30']

interface Props {
  inquiries: Inquiry[]
}

export default function AnalyticsTab({ inquiries }: Props) {
  const sources:  Record<string, number> = {}
  const exps:     Record<string, number> = {}
  const statuses: Record<string, number> = { New: 0, Contacted: 0, 'Visit Scheduled': 0, 'Visit Complete': 0 }

  inquiries.forEach(i => {
    if (i.source)     sources[i.source]  = (sources[i.source]  ?? 0) + 1
    if (i.experience) exps[i.experience] = (exps[i.experience] ?? 0) + 1
    if (i.status in statuses) statuses[i.status]++
  })

  const maxS    = Math.max(...Object.values(sources), 1)
  const maxE    = Math.max(...Object.values(exps), 1)
  const topSrc  = Object.entries(sources).sort((a, b) => b[1] - a[1])[0]
  const weekCnt = inquiries.filter(i => THIS_WEEK.includes(i.date)).length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Analytics</div>
        </div>
      </div>

      <div className="stat-cards" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Inquiries</div>
          <div className="stat-card-value">{inquiries.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">This Week</div>
          <div className="stat-card-value">{weekCnt}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Avg Response</div>
          <div className="stat-card-value">—</div>
          <div className="stat-card-sub">Set manually</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Top Source</div>
          <div className="stat-card-value" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
            {topSrc ? topSrc[0] : '—'}
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-title">Inquiries by Source</div>
          <div className="bar-chart">
            {Object.keys(sources).length === 0
              ? <p className="analytics-empty">Submit an inquiry to see data.</p>
              : Object.entries(sources).map(([k, v]) => (
                <div key={k} className="bar-row">
                  <div className="bar-label">{k}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(v / maxS * 100)}%` }} /></div>
                  <div className="bar-val">{v}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-title">Inquiries by Experience Level</div>
          <div className="bar-chart">
            {Object.keys(exps).length === 0
              ? <p className="analytics-empty">Submit an inquiry to see data.</p>
              : Object.entries(exps).map(([k, v]) => (
                <div key={k} className="bar-row">
                  <div className="bar-label">{k}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(v / maxE * 100)}%`, background: '#8a6545' }} /></div>
                  <div className="bar-val">{v}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
          <div className="analytics-card-title">Status Breakdown</div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {inquiries.length === 0
              ? <p className="analytics-empty">Submit an inquiry to see data.</p>
              : Object.entries(statuses).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${STATUS_BADGE[k]}`}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text)' }}>{v}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
