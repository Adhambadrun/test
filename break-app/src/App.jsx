import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './store'
import BackgroundShader from './shader/BackgroundShader'
import Toasts from './components/Toasts'
import GlobalActions from './components/GlobalActions'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import Supervisor from './screens/Supervisor'
import Admin from './screens/Admin'
import Developer from './screens/Developer'
import Settings from './screens/Settings'
import Messages from './screens/Messages'
import Profile from './screens/Profile'
import Unauthorized from './screens/Unauthorized'

const ROLES = { supervisor: ['supervisor', 'admin', 'developer'], admin: ['admin', 'developer'], developer: ['developer'] }

function Guard({ roles, children }) {
  const { session } = useApp()
  const loc = useLocation()
  if (!session) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (roles && !roles.includes(session.role)) return <Navigate to="/unauthorized" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BackgroundShader />
      <HashRouter>
        <Shell />
      </HashRouter>
      <GlobalActions />
      <Toasts />
    </AppProvider>
  )
}

function Shell() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
      <Route path="/supervisor" element={<Guard roles={ROLES.supervisor}><Supervisor /></Guard>} />
      <Route path="/admin" element={<Guard roles={ROLES.admin}><Admin /></Guard>} />
      <Route path="/developer" element={<Guard roles={ROLES.developer}><Developer /></Guard>} />
      <Route path="/settings" element={<Guard><Settings /></Guard>} />
      <Route path="/messages" element={<Guard><Messages /></Guard>} />
      <Route path="/profile" element={<Guard><Profile /></Guard>} />
      <Route path="/unauthorized" element={<Guard><Unauthorized /></Guard>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
