import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import axiosInstance from '../../core/axiosInstance'

const LoginForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axiosInstance.post('/api/login', formData)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login')
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <h1 className="h4 fw-bold">Welcome to Agrinova!</h1>
          <p className="text-muted">Login to your account to continue urban farming.</p>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 mb-2">
            Login
          </button>
        </form>
        <div className="mt-3 text-center">
          <p className="text-muted mb-1">
            Don't have an account?{' '}
            <a href="#" className="text-success fw-medium">
              Sign up
            </a>
          </p>
          <a href="#" className="text-success fw-medium">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
