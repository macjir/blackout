import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AlertScreen from './pages/AlertScreen'
import CitizenApp from './pages/CitizenApp'
import MayorApp from './pages/MayorApp'
import { getRole } from './lib/session'

function RoleGuard() {
  const role = getRole()
  if (role === 'mayor') return <Navigate to="/mayor" replace />
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-full max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<AlertScreen />} />
          <Route path="/citizen" element={<CitizenApp />} />
          <Route path="/mayor" element={<MayorApp />} />
          <Route path="*" element={<RoleGuard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
