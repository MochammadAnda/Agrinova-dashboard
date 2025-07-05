// ToastManager.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

const ToastManager = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, color = '#007aff', title = 'Info') => {
    const id = Date.now()
    const toast = (
      <CToast key={id} autohide delay={3000} visible>
        <CToastHeader closeButton>
          <svg className="rounded me-2" width="20" height="20">
            <rect width="100%" height="100%" fill={color}></rect>
          </svg>
          <div className="fw-bold me-auto">{title}</div>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
    setToasts((prev) => [...prev, toast])

    // Hapus setelah delay
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.key !== id))
    }, 3100)
  }, [])

  const value = {
    success: (msg) => showToast(msg, 'green', 'Sukses'),
    error: (msg) => showToast(msg, 'red', 'Error'),
    info: (msg) => showToast(msg, '#007aff', 'Info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <CToaster placement="top-end" className="m-4">
        {toasts}
      </CToaster>
    </ToastContext.Provider>
  )
}

export default ToastManager
