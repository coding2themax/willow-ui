import { Routes, Route } from 'react-router-dom'
import Listing from './pages/Listing'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Listing />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
