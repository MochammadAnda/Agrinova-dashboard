import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'

const FinanceModal = ({ visible, onClose, mode, id, onSuccess }) => {
  const isEdit = mode === 'edit'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'income',
    date: '',
  })
  const [errors, setErrors] = useState({})

  // Ambil data saat edit
  useEffect(() => {
    if (isEdit && id && visible) {
      axiosInstance.get(`/api/finances/${id}`).then((res) => {
        const { title, description, amount, type, date } = res.data
        setFormData({ title, description, amount, type, date })
      })
    }
  }, [id, isEdit, visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      setErrors({})
      if (isEdit) {
        await axiosInstance.put(`/api/finances/${id}`, formData)
      } else {
        await axiosInstance.post('/api/finances', formData)
      }
      onSuccess()
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        console.error('Terjadi kesalahan:', error)
      }
    }
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <label className="form-label">Judul</label>
            <CFormInput
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Pembelian atau transaksi"
              invalid={!!errors.title}
            />
            {errors.title && <div className="text-danger">{errors.title[0]}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <CFormInput
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Contoh: Penjualan sayur"
              invalid={!!errors.description}
            />
            {errors.description && <div className="text-danger">{errors.description[0]}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Jumlah</label>
            <CFormInput
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Contoh: 50000"
              invalid={!!errors.amount}
            />
            {errors.amount && <div className="text-danger">{errors.amount[0]}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Tipe</label>
            <CFormSelect
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { label: 'Pemasukan', value: 'income' },
                { label: 'Pengeluaran', value: 'expense' },
              ]}
              invalid={!!errors.type}
            />
            {errors.type && <div className="text-danger">{errors.type[0]}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal</label>
            <CFormInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              invalid={!!errors.date}
            />
            {errors.date && <div className="text-danger">{errors.date[0]}</div>}
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Batal
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Simpan'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default FinanceModal
