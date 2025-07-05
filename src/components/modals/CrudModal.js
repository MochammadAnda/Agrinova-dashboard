import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'
import CenteredModal from '../CenteredModal'

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
}) => {
  const isEdit = mode === 'edit'
  const isDelete = mode === 'delete'
  const isReset = mode === 'resetPassword'

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      if ((isEdit || isDelete) && id) {
        setLoading(true)
        axiosInstance
          .get(`${endpoint}/${id}`)
          .then((res) => {
            const data = {}
            fields.forEach((field) => {
              data[field.name] = res.data[field.name] || ''
            })
            setFormData(data)
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false))
      } else {
        const initial = {}
        fields.forEach((field) => {
          initial[field.name] = ''
        })
        setFormData(initial)
      }
    }
  }, [visible, isEdit, isDelete, id, fields, endpoint])

  const handleSubmit = () => {
    setSubmitting(true)

    let api
    if (isReset) {
      api = axiosInstance.post(`${endpoint}/${id}/reset_password`)
    } else if (isDelete) {
      api = axiosInstance.delete(`${endpoint}/${id}`)
    } else if (isEdit) {
      api = axiosInstance.put(`${endpoint}/${id}`, formData)
    } else {
      api = axiosInstance.post(endpoint, formData)
    }

    api
      .then(() => {
        onSuccess?.()
        onClose()
      })
      .catch((err) => console.error(err))
      .finally(() => setSubmitting(false))
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
        <div className="text-center py-3">
          <CSpinner color="primary" />
        </div>
      ) : isDelete ? (
        <p>
          Apakah Anda yakin ingin menghapus <strong>{formData[fields?.[0]?.name]}</strong>?
        </p>
      ) : isReset ? (
        <p>
          Apakah Anda yakin ingin me-reset password user <strong>{formData.name}</strong> ke{' '}
          <code>password</code>?
        </p>
      ) : (
        <div>
          {fields.map(({ name, label, type = 'text', placeholder, options }) => (
            <div className="mb-3" key={name}>
              <label htmlFor={name} className="form-label">
                {label}
              </label>

              {type === 'select' ? (
                <select
                  name={name}
                  id={name}
                  value={formData[name]}
                  className="form-control"
                  onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))}
                >
                  <option value="">Pilih {label.toLowerCase()}</option>
                  {(options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : type === 'textarea' ? (
                <textarea
                  name={name}
                  id={name}
                  value={formData[name]}
                  placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
                  className="form-control"
                  onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name]}
                  placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
                  className="form-control"
                  onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))}
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
