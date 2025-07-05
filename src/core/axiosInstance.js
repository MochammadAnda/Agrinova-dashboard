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
    } else {
      config.headers.Authorization = `Bearer 1|j6LD9XFWq92JePGN9a9bzllstZ31gw01A7MPJE6yb3119e71`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
