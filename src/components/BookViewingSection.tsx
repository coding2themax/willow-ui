import { useMemo, useState } from 'react'
import { createInquiry } from '../api/inquiries'
import Spinner from './ui/Spinner'
import ErrorBanner from './ui/ErrorBanner'

const IS_SOLD = import.meta.env.VITE_SOLD === 'true'

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM']
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

interface DayCell {
  date: Date
  inMonth: boolean
  available: boolean
}

function buildMonthGrid(viewMonth: Date, today: Date): DayCell[] {
  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay())

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    const inMonth = date.getMonth() === viewMonth.getMonth()
    const available = inMonth && date >= today && date.getDay() !== 0
    return { date, inMonth, available }
  })
}

export default function BookViewingSection() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const grid = useMemo(() => buildMonthGrid(viewMonth, today), [viewMonth, today])
  const canGoPrev = viewMonth.getFullYear() > today.getFullYear() || viewMonth.getMonth() > today.getMonth()

  const selectDay = (day: DayCell) => {
    if (!day.available) return
    setSelectedDate(day.date)
    setSelectedTime(null)
  }

  const goToMonth = (delta: number) => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  const formattedSelection = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get('bv-name') as string,
      email: fd.get('bv-email') as string,
      phone: fd.get('bv-phone') as string | undefined,
      message: `Requested viewing: ${formattedSelection}, ${selectedDate.getFullYear()} at ${selectedTime}.`,
    }

    setLoading(true)
    setError(null)

    try {
      await createInquiry(data)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="book-viewing" className="book-viewing-section">
      <div className="section-inner">
        <div className="fade-up">
          <div className="section-eyebrow">Book a Viewing</div>
          <div className="section-title">Come Meet Willow</div>
          <div className="rule" />
        </div>

        <div className="booking-card fade-up">
          <div className="booking-info">
            <img className="booking-photo" src="/uploads/IMG_6728.jpeg" alt="Willow" />
            <div className="booking-info-head">
              <div className="section-eyebrow">Book a Viewing</div>
              <div className="booking-name">Willow</div>
              <div className="booking-sub">Bay Draft Cross &middot; 3 yrs</div>
            </div>
            <div className="rule" />
            <ul className="booking-facts">
              <li>45-minute visit</li>
              <li>Chandler, Arizona</li>
              <li>PPE welcome</li>
            </ul>
          </div>

          <div className="booking-panel">
            {IS_SOLD ? (
              <div className="form-success">
                <div className="form-success-title">Willow Has Been Sold</div>
                <div className="form-success-text">
                  Thank you for your interest. Willow has found her new home.
                </div>
              </div>
            ) : submitted ? (
              <div className="form-success">
                <div className="form-success-title">Request Sent!</div>
                <div className="form-success-text">
                  We've received your request for {formattedSelection} at {selectedTime} and will
                  confirm within 24&ndash;48 hours.
                </div>
              </div>
            ) : (
              <form className="booking-form" onSubmit={handleSubmit}>
                {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

                <div className="booking-picker">
                  <div className="booking-calendar">
                    <div className="booking-cal-head">
                      <button
                        type="button"
                        className="booking-cal-nav"
                        onClick={() => goToMonth(-1)}
                        disabled={!canGoPrev}
                        aria-label="Previous month"
                      >
                        &larr;
                      </button>
                      <span className="form-label">
                        {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        className="booking-cal-nav"
                        onClick={() => goToMonth(1)}
                        aria-label="Next month"
                      >
                        &rarr;
                      </button>
                    </div>
                    <div className="booking-cal-weekdays">
                      {WEEKDAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                    <div className="booking-cal-grid">
                      {grid.map((day, i) => {
                        const isSelected = selectedDate !== null && day.date.getTime() === selectedDate.getTime()
                        const classes = ['booking-day']
                        if (!day.inMonth) classes.push('mut')
                        else if (isSelected) classes.push('sel')
                        else if (day.available) classes.push('av')
                        return (
                          <button
                            type="button"
                            key={i}
                            className={classes.join(' ')}
                            disabled={!day.available}
                            onClick={() => selectDay(day)}
                          >
                            {day.date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="booking-times">
                    <div className="form-label">{selectedDate ? formattedSelection : 'Pick a day'}</div>
                    {TIME_SLOTS.map(time => (
                      <button
                        type="button"
                        key={time}
                        className={`booking-chip${selectedTime === time ? ' on' : ''}`}
                        disabled={!selectedDate}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="booking-divider" />

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="bv-name">Name *</label>
                    <input className="form-input" id="bv-name" name="bv-name" type="text" required placeholder="Your full name" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="bv-phone">Phone</label>
                    <input className="form-input" id="bv-phone" name="bv-phone" type="tel" placeholder="(555) 000-0000" />
                  </div>
                </div>
                <div className="form-field full">
                  <label className="form-label" htmlFor="bv-email">Email *</label>
                  <input className="form-input" id="bv-email" name="bv-email" type="email" required placeholder="you@example.com" />
                </div>

                <button type="submit" className="form-submit" disabled={loading || !selectedDate || !selectedTime}>
                  {loading ? <Spinner size={14} /> : null}
                  {loading
                    ? 'Sending…'
                    : selectedDate && selectedTime
                      ? `Confirm · ${formattedSelection}, ${selectedTime} →`
                      : 'Select a Day & Time'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
