import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'
import CenteredModal from '../CenteredModal'

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)
}

const CrudModal = ({
  visible,
  onClose,
  mode = 'store',
  id = null,
  onSuccess,
  titleMap = {
    store: 'Tambah Data',
    edit: 'Edit Data',
    delete: 'Hapus Data',
    resetPassword: 'Reset Password',
  },
  endpoint,
  fields = [],
  onError,
  customHandleChange,
  customHandleSubmit,
  isSubmit = false,
}) => {
  const isEdit = mode === 'edit'
  const isDelete = mode === 'delete'
  const isReset = mode === 'resetPassword'

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(isSubmit)

  useEffect(() => {
    if (!visible) {
      setFormData({})
      return
    }

    if ((isEdit || isDelete || isReset) && id) {
      setLoading(true)
      axiosInstance
        .get(`${endpoint}/${id}`)
        .then((res) => {
          const data = {}
          fields.forEach((field) => {
            data[field.name] = getNestedValue(res.data, field.name)
          })
          setFormData(data)
        })
        .catch((err) => {
          console.error('Failed to fetch data:', err)
          onError?.('Gagal memuat data. Silakan coba lagi.')
        })
        .finally(() => setLoading(false))
    } else {
      const initial = {}
      fields.forEach((field) => {
        initial[field.name] = ''
      })
      setFormData(initial)
    }
  }, [visible, isEdit, isDelete, isReset, id, fields, endpoint, onError])

  useEffect(() => {
    setSubmitting(isSubmit)
  }, [isSubmit])

  const buildPayload = (flatObj) => {
    const payload = {}
    Object.keys(flatObj).forEach((path) => {
      const keyParts = path.split('.')
      const finalKey = keyParts[keyParts.length - 1]
      payload[finalKey] = flatObj[path]
    })
    return payload
  }

  const defaultHandleSubmit = async () => {
    if ((isEdit || mode === 'store') && fields.some((f) => !formData[f.name])) {
      onError?.('Semua field wajib diisi.')
      return
    }

    setSubmitting(true)
    let api
    const payload = isEdit || mode === 'store' ? buildPayload(formData) : {}

    if (isReset) {
      api = axiosInstance.post(`${endpoint}/${id}/reset_password`)
    } else if (isDelete) {
      api = axiosInstance.delete(`${endpoint}/${id}`)
    } else if (isEdit) {
      api = axiosInstance.put(`${endpoint}/${id}`, payload)
    } else {
      api = axiosInstance.post(endpoint, payload)
    }

    api
      .then(() => {
        onSuccess?.()
        onClose()
      })
      .catch((err) => {
        console.error('Submission failed:', err)
        const errorMsg = err?.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.'
        onError?.(errorMsg)
      })
      .finally(() => setSubmitting(false))
  }

  const handleSubmit = () => {
    if (customHandleSubmit) {
      customHandleSubmit(formData, setSubmitting)
    } else {
      defaultHandleSubmit()
    }
  }

  const defaultHandleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <CenteredModal
      visible={visible}
      onClose={onClose}
      title={titleMap[mode]}
      onSave={handleSubmit}
      loading={submitting || loading}
      saveButtonText={isDelete ? 'Hapus' : isReset ? 'Reset' : undefined}
      saveButtonColor={isDelete ? 'danger' : isReset ? 'warning' : undefined}
    >
      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : isDelete ? (
        <div>
          <p>Apakah Anda yakin ingin menghapus data ini?</p>
          {submitting && (
            <div className="text-center mt-3">
              <CSpinner color="danger" />
            </div>
          )}
        </div>
      ) : isReset ? (
        <div>
          <p>
            Apakah Anda yakin ingin me-reset password user{' '}
            <strong>{formData['blindstick.mac_address'] || ''}</strong> ke <code>password</code>?
          </p>
          {submitting && (
            <div className="text-center mt-3">
              <CSpinner color="warning" />
            </div>
          )}
        </div>
      ) : (
        <div>
          {fields.map(({ name, label, type = 'text', placeholder, options, accept }) => (
            <div className="mb-3" key={name}>
              <label htmlFor={name} className="form-label">
                {label}
              </label>
              {type === 'select' ? (
                <select
                  name={name}
                  id={name}
                  value={formData[name] ?? ''}
                  className="form-select"
                  onChange={(e) => {
                    if (customHandleChange) {
                      customHandleChange(e, setFormData)
                    } else {
                      defaultHandleChange(e)
                    }
                  }}
                >
                  <option value="">Pilih {label}</option>
                  {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={type === 'file' ? undefined : (formData[name] ?? '')}
                  placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
                  className="form-control"
                  onChange={(e) => {
                    if (customHandleChange) {
                      customHandleChange(e, setFormData)
                    } else {
                      defaultHandleChange(e)
                    }
                  }}
                  {...(type === 'file' ? { accept } : {})}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </CenteredModal>
  )
}

export default CrudModal
