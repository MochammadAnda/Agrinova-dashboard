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
  onError,
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
              // Untuk tipe file, Anda mungkin tidak ingin mengisi formData dengan string path file,
              // melainkan mengosongkannya atau menanganinya secara terpisah.
              // Untuk select, pastikan nilai yang diambil sesuai dengan salah satu opsi.
              data[field.name] = res.data[field.name] || ''
            })
            setFormData(data)
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false))
      } else {
        const initial = {}
        fields.forEach((field) => {
          // Untuk tipe file, nilai awal harus null atau objek File
          initial[field.name] = field.type === 'file' ? null : ''
        })
        setFormData(initial)
      }
    }
  }, [visible, isEdit, isDelete, id, fields, endpoint])

  const handleSubmit = () => {
    setSubmitting(true)

    // Penting: Untuk file, Anda perlu menggunakan FormData API
    const dataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      // Jika ada file yang dipilih, tambahkan ke FormData
      if (fields.find((f) => f.name === key && f.type === 'file') && formData[key]) {
        dataToSend.append(key, formData[key])
      } else {
        // Untuk semua field lainnya, termasuk select dan text
        dataToSend.append(key, formData[key])
      }
    })

    let api
    if (isReset) {
      api = axiosInstance.post(`${endpoint}/${id}/reset_password`)
    } else if (isDelete) {
      api = axiosInstance.delete(`${endpoint}/${id}`)
    } else if (isEdit) {
      // Untuk file, pastikan server dapat menangani multipart/form-data untuk PUT
      api = axiosInstance.put(`${endpoint}/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Penting untuk file uploads
        },
      })
    } else {
      // Untuk file, pastikan server dapat menangani multipart/form-data untuk POST
      api = axiosInstance.post(endpoint, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Penting untuk file uploads
        },
      })
    }

    api
      .then(() => {
        onSuccess?.()
        onClose()
      })
      .catch((err) => {
        console.error(err)
        const errorMsg = err?.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.'
        onError?.(errorMsg)
      })
      .finally(() => setSubmitting(false))
  }

  const handleFileChange = (e, name) => {
    // Saat file dipilih, simpan objek File itu sendiri di state
    setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }))
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
        // Form input biasa untuk create/edit
        <div>
          {fields.map(
            (
              { name, label, type = 'text', placeholder, options }, // Tambahkan 'options'
            ) => (
              <div className="mb-3" key={name}>
                <label htmlFor={name} className="form-label">
                  {label}
                </label>
                {type === 'select' ? (
                  <select
                    name={name}
                    id={name}
                    value={formData[name]}
                    className="form-select" // Gunakan form-select dari Bootstrap
                    onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))}
                  >
                    <option value="">Pilih {label}</option> {/* Opsi default */}
                    {options &&
                      options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                ) : type === 'file' ? (
                  <input
                    type="file"
                    name={name}
                    id={name}
                    className="form-control"
                    onChange={(e) => handleFileChange(e, name)} // Gunakan handler terpisah
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
            ),
          )}
        </div>
      )}
    </CenteredModal>
  )
}

export default CrudModal
