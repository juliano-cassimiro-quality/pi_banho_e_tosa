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
    return <Navigate to={user?.role === 'profissional' ? '/gestao' : '/agendamentos'} replace />
  }
  return children
}

export default function AppRoutes () {
  const { user } = useAuth()
  const defaultAuthenticatedPath = user?.role === 'profissional' ? '/gestao' : '/agendamentos'

  return (
    <Routes>
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
        path="/"
        element={(
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to={defaultAuthenticatedPath} replace />} />
        <Route path="agendamentos" element={<AppointmentsPage />} />
        <Route path="agendar" element={<SchedulePage />} />
        <Route path="pets" element={<PetsPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="gestao" element={<ManagementPage />} />
      </Route>
      <Route path="*" element={<Navigate to={defaultAuthenticatedPath} replace />} />
    </Routes>
  )
}
