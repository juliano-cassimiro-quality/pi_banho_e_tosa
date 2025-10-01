import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Layout from '../components/Layout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import PetsPage from '../pages/PetsPage'
import SchedulePage from '../pages/SchedulePage'
import AppointmentsPage from '../pages/AppointmentsPage'
import DashboardPage from '../pages/DashboardPage'
import ManagementPage from '../pages/ManagementPage'
import LandingPage from '../pages/LandingPage'
import { getDefaultNestedPath, getDefaultPath } from '../utils/navigation'

function ProtectedRoute ({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function PublicOnlyRoute ({ children }) {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated) {
    const defaultPath = getDefaultPath(user?.role)
    return <Navigate to={defaultPath} replace />
  }
  return children
}

function RoleRoute ({ roles, children }) {
  const { user } = useAuth()
  const allowed = roles.includes(user?.role)
  if (!allowed) {
    return <Navigate to={getDefaultPath(user?.role)} replace />
  }
  return children
}

export default function AppRoutes () {
  const { user, isAuthenticated } = useAuth()
  const defaultNestedPath = getDefaultNestedPath(user?.role)
  const defaultAuthenticatedPath = getDefaultPath(user?.role)
  const fallbackPath = isAuthenticated ? defaultAuthenticatedPath : '/'

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={(
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/cadastro"
        element={(
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/app"
        element={(
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to={defaultNestedPath} replace />} />
        <Route path="agendamentos" element={<AppointmentsPage />} />
        <Route path="agendar" element={<SchedulePage />} />
        <Route path="pets" element={<PetsPage />} />
        <Route
          path="dashboard"
          element={(
            <RoleRoute roles={['admin']}>
              <DashboardPage />
            </RoleRoute>
          )}
        />
        <Route
          path="gestao"
          element={(
            <RoleRoute roles={['profissional', 'admin']}>
              <ManagementPage />
            </RoleRoute>
          )}
        />
      </Route>
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  )
}
