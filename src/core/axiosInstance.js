// src/api/axiosInstance.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // ← ganti sesuai kebutuhan
})

// Tambahkan interceptor agar Authorization otomatis
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // atau dari cookies / context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
