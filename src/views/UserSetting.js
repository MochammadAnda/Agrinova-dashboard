import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CButton, CFormInput, CFormLabel, CSpinner } from '@coreui/react'
import axiosInstance from '../core/axiosInstance'
import { useToast } from '../components/ToastManager'

const UserSetting = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    job_role: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const Toast = useToast()
  const [photoFile, setPhotoFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    axiosInstance
      .get('/api/user/profile')
      .then((res) => {
        setFormData(res.data)
        setAvatarUrl(res.data.avatar)
      })
      .catch(
        (err) => console.error('Gagal ambil data user:', err),
        Toast.error('Gagal mengambil data profil.'),
      )
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
      Toast.success('Profil berhasil diperbarui.')
    } catch (err) {
      console.error('Gagal update profil:', err)
      Toast.error('Gagal memperbarui profil. Pastikan semua field terisi dengan benar.')
    } finally {
      setSubmitting(false)
    }
  }
  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0])
  }

  const handlePhotoUpload = async () => {
    if (!photoFile) return Toast.error('Pilih file terlebih dahulu.')

    const formData = new FormData()
    formData.append('photo', photoFile)

    try {
      const res = await axiosInstance.post('/api/user/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      Toast.success('Foto berhasil diunggah.')
      setAvatarUrl(res.data.avatar)
      setPhotoFile(null)
    } catch (err) {
      console.error('Upload gagal:', err)
      Toast.error('Gagal upload foto.')
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
          <div className="mb-5 d-flex justify-content-left align-items-center gap-5">
            {/* Avatar */}
            <div
              className="rounded-circle overflow-hidden border shadow"
              style={{ width: 160, height: 160, flexShrink: 0 }}
            >
              <img
                src={avatarUrl || 'https://via.placeholder.com/160'}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Form Upload, ditengah vertikal */}
            <div className="d-flex flex-column align-items-center gap-3">
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ maxWidth: 220 }}
              />
              <CButton type="button" color="info" onClick={handlePhotoUpload}>
                Upload New
              </CButton>
            </div>
          </div>

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
