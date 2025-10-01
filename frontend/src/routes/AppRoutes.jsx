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

function ProtectedRoute ({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function PublicOnlyRoute ({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/agendamentos" replace />
  }
  return children
}

export default function AppRoutes () {
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
        <Route index element={<Navigate to="/agendamentos" replace />} />
        <Route path="agendamentos" element={<AppointmentsPage />} />
        <Route path="agendar" element={<SchedulePage />} />
        <Route path="pets" element={<PetsPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/agendamentos" replace />} />
    </Routes>
  )
}
