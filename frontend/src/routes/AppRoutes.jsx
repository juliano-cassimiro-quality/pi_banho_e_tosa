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
    const defaultPath = user?.role === 'profissional' ? '/app/gestao' : '/app/agendamentos'
    return <Navigate to={defaultPath} replace />
  }
  return children
}

export default function AppRoutes () {
  const { user, isAuthenticated } = useAuth()
  const defaultNestedPath = user?.role === 'profissional' ? 'gestao' : 'agendamentos'
  const defaultAuthenticatedPath = `/app/${defaultNestedPath}`
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
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="gestao" element={<ManagementPage />} />
      </Route>
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  )
}
