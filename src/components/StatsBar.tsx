const STATS = [
  { label: 'Age',      value: '3 Years' },
  { label: 'Breed',    value: 'Draft Cross' },
  { label: 'Color',    value: 'Bay' },
  { label: 'Sex',      value: 'Mare' },
  { label: 'Location', value: 'Chandler, AZ' },
  { label: 'Price',    value: '$3,500 OBO' },
]

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-inner">
        {STATS.map(s => (
          <div key={s.label} className="stat">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
