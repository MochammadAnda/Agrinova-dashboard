import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowRoles }) => {
  const token = localStorage.getItem('token')
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowRoles && !roles.some((r) => allowRoles.includes(r))) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
