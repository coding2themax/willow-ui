import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './ProgressTracker.css'

interface ProgressTask {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'willow_progress_tasks'

function loadTasks(): ProgressTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ProgressTask[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function ProgressTracker() {
  const [tasks, setTasks] = useState<ProgressTask[]>(() => loadTasks())
  const [title, setTitle] = useState('')

  const saveTasks = (next: ProgressTask[]) => {
    setTasks(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const completed = useMemo(() => tasks.filter(t => t.completed).length, [tasks])
  const percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)

  const addTask = (e: FormEvent) => {
    e.preventDefault()
    const clean = title.trim()
    if (!clean) return

    saveTasks([
      {
        id: Date.now(),
        title: clean,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...tasks,
    ])
    setTitle('')
  }

  const toggleTask = (id: number) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const removeTask = (id: number) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const clearCompleted = () => {
    saveTasks(tasks.filter(t => !t.completed))
  }

  return (
    <div className="progress-page">
      <div className="progress-shell">
        <div className="progress-topbar">
          <Link to="/" className="progress-link">← Listing</Link>
          <Link to="/admin" className="progress-link">Admin</Link>
        </div>

        <div className="progress-card">
          <div className="progress-eyebrow">Project</div>
          <h1 className="progress-title">Progress Tracker</h1>

          <div className="progress-stats">
            <div className="progress-count">{completed} / {tasks.length} complete</div>
            <div className="progress-percent">{percent}%</div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>

          <form className="progress-form" onSubmit={addTask}>
            <input
              className="progress-input"
              placeholder="Add a milestone..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <button className="progress-btn" type="submit">Add</button>
          </form>

          {tasks.length === 0 ? (
            <p className="progress-empty">No milestones yet. Add your first one above.</p>
          ) : (
            <ul className="progress-list">
              {tasks.map(task => (
                <li key={task.id} className="progress-item">
                  <label className="progress-item-left">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className={task.completed ? 'done' : ''}>{task.title}</span>
                  </label>
                  <button className="progress-remove" onClick={() => removeTask(task.id)}>✕</button>
                </li>
              ))}
            </ul>
          )}

          {completed > 0 && (
            <button className="progress-clear" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
