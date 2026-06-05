import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AlertScreen from './pages/AlertScreen'
import CitizenApp from './pages/CitizenApp'
import MayorApp from './pages/MayorApp'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-full max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<AlertScreen />} />
          <Route path="/citizen/:personaId" element={<CitizenApp />} />
          <Route path="/citizen" element={<Navigate to="/citizen/1" replace />} />
          <Route path="/mayor" element={<MayorApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
