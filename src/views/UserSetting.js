import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CButton, CFormInput, CFormLabel, CSpinner } from '@coreui/react'
import axiosInstance from '../core/axiosInstance'

const UserSetting = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    job_role: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axiosInstance
      .get('/api/user/profile')
      .then((res) => setFormData(res.data))
      .catch((err) => console.error('Gagal ambil data user:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await axiosInstance.put('/api/user/update', formData)
      alert('Profil berhasil diperbarui!')
    } catch (err) {
      console.error('Gagal update profil:', err)
      alert('Terjadi kesalahan saat memperbarui profil.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    )

  return (
    <CCard className="p-4">
      <CCardBody>
        <h4 className="mb-4">User Setting</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="name">Nama</CFormLabel>
            <CFormInput name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="location">Lokasi</CFormLabel>
            <CFormInput name="location" value={formData.location || ''} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="job_role">Pekerjaan</CFormLabel>
            <CFormInput name="job_role" value={formData.job_role || ''} onChange={handleChange} />
          </div>
          <CButton type="submit" color="primary" disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </CButton>
        </form>
      </CCardBody>
    </CCard>
  )
}

export default UserSetting
