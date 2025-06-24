import React, { useEffect, useState } from 'react'
import { CForm, CFormInput, CFormLabel, CSpinner } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'
import CenteredModal from '../CenteredModal'

const CategoryModal = ({ visible, onClose, mode = 'store', id = null, onSuccess }) => {
  const isEdit = mode === 'edit'

  const [formData, setFormData] = useState({ name: '' })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      if (isEdit && id) {
        setLoading(true)
        axiosInstance
          .get(`/dashboard/manage-category/${id}`)
          .then((res) => setFormData({ name: res.data.name || '' }))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false))
      } else {
        setFormData({ name: '' }) // Reset saat tambah
      }
    }
  }, [visible, isEdit, id])

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value })
  }

  const handleSubmit = () => {
    setSubmitting(true)
    const api = isEdit
      ? axiosInstance.put(`/dashboard/manage-category/${id}`, formData)
      : axiosInstance.post(`/dashboard/manage-category/`, formData)

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
      title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
      onSave={handleSubmit}
      loading={submitting || loading}
    >
      {loading ? (
        <div className="text-center py-3">
          <CSpinner color="primary" />
        </div>
      ) : (
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="name">Nama Kategori</CFormLabel>
            <CFormInput
              id="name"
              type="text"
              placeholder="Masukkan nama kategori"
              value={formData.name}
              onChange={handleChange}
              className="p-2"
            />
          </div>
        </CForm>
      )}
    </CenteredModal>
  )
}

export default CategoryModal
