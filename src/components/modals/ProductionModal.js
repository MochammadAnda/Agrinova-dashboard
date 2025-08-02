import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'

export default function ProductionModal({
  visible,
  onClose,
  editData = null,
  onCreate,
  onUpdate,
  onDelete,
  mode,
}) {
  const [form, setForm] = useState({
    product_name: '',
    quantity: '',
    unit: '',
    harvest_date: '',
    status: 'Masuk',
    notes: '',
  })
  const [productOptions, setProductOptions] = useState([])

  const [loading, setLoading] = useState(false)
  const [maxQuantity, setMaxQuantity] = useState(null)

  useEffect(() => {
    const fetchStock = async () => {
      if (form.status === 'Keluar' && form.product_name) {
        try {
          const res = await axiosInstance.get('/api/productions')
          const data = res.data.data

          const totalMasuk = data
            .filter((item) => item.status === 'Masuk' && item.product_name === form.product_name)
            .reduce((sum, item) => sum + Number(item.quantity), 0)

          const totalKeluar = data
            .filter((item) => item.status === 'Keluar' && item.product_name === form.product_name)
            .reduce((sum, item) => sum + Number(item.quantity), 0)

          const sisa = totalMasuk - totalKeluar
          setMaxQuantity(sisa)
        } catch (err) {
          console.error('Gagal memuat stok:', err)
        }
      } else {
        setMaxQuantity(null)
      }
    }

    fetchStock()
  }, [form.product_name, form.status])

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const res = await axiosInstance.get('/api/productions') // atau ganti sesuai API kamu
        const data = res.data.data

        // Ambil nama produk unik
        const uniqueNames = [...new Set(data.map((item) => item.product_name))]

        setProductOptions(uniqueNames) // Buat state productOptions di atas
      } catch (err) {
        console.error('Gagal memuat nama produk:', err)
      }
    }

    fetchProductNames()
  }, [])

  useEffect(() => {
    if (editData) {
      setForm({
        product_name: editData.product_name || '',
        quantity: editData.quantity || '',
        unit: editData.unit || '',
        harvest_date: editData.harvest_date || '',
        status: editData.status || 'Masuk',
        notes: editData.notes || '',
      })
    } else {
      setForm({
        product_name: '',
        quantity: '',
        unit: '',
        harvest_date: '',
        status: 'Masuk',
        notes: '',
      })
    }
  }, [editData, visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (form.status === 'Keluar' && maxQuantity !== null) {
      if (Number(form.quantity) > maxQuantity) {
        alert(`Stok tidak mencukupi. Maksimum sisa stok: ${maxQuantity}`)
        return
      }
    }

    try {
      setLoading(true)
      if (editData && onUpdate) {
        await onUpdate({ ...form, id: editData.id })
      } else if (onCreate) {
        await onCreate(form)
      }
      onClose()
    } catch (error) {
      console.error('Gagal menyimpan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (onDelete && editData) {
      try {
        setLoading(true)
        await onDelete(editData.id)
        onClose()
      } catch (error) {
        console.error('Gagal menghapus:', error)
      } finally {
        setLoading(false)
      }
    } else {
      console.log('kondisi tidak terpenuhi')
      console.log(onDelete)
      console.log(editData)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>
          {' '}
          {mode === 'edit'
            ? 'Edit Produksi'
            : mode === 'delete'
              ? 'Hapus Produksi'
              : 'Tambah Produksi'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {mode === 'delete' ? (
          <>
            <p>
              Apakah kamu yakin ingin menghapus data produksi{' '}
              <strong>{editData?.product_name}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <CButton color="secondary" onClick={onClose} disabled={loading}>
                Batal
              </CButton>
              <CButton color="danger" onClick={handleDelete} disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Hapus'}
              </CButton>
            </div>
          </>
        ) : (
          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect name="status" value={form.status} onChange={handleChange}>
                  <option value="Masuk">Masuk</option>
                  <option value="Keluar">Keluar</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Nama Produk</CFormLabel>

                {form.status === 'Keluar' ? (
                  <CFormSelect
                    name="product_name"
                    value={form.product_name}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Produk</option>
                    {productOptions.map((name, i) => (
                      <option key={i} value={name}>
                        {name}
                      </option>
                    ))}
                  </CFormSelect>
                ) : (
                  <CFormInput
                    type="text"
                    name="product_name"
                    value={form.product_name}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk baru"
                  />
                )}
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  label="Jumlah"
                  value={form.quantity}
                  onChange={(e) => {
                    const input = e.target.value
                    const value = input === '' ? '' : Number(input)

                    if (
                      form.status === 'Keluar' &&
                      maxQuantity !== null &&
                      value !== '' &&
                      value > maxQuantity
                    ) {
                      alert(`Stok tidak cukup! Maksimal yang bisa dikeluarkan: ${maxQuantity}`)
                      return
                    }

                    setForm({ ...form, quantity: value })
                  }}
                />

                {form.status === 'Keluar' && maxQuantity !== null && (
                  <small className="text-muted">
                    Sisa stok tersedia: <strong>{maxQuantity}</strong>
                  </small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Unit (Kategori)</CFormLabel>
                <CFormSelect name="unit" value={form.unit} onChange={handleChange}>
                  <option value="">Pilih Unit</option>
                  <option value="Sayuran">Sayuran</option>
                  <option value="Buah-buahan">Buah-buahan</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Tanggal Panen</CFormLabel>
                <CFormInput
                  type="date"
                  name="harvest_date"
                  value={form.harvest_date}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol>
                <CFormLabel>Catatan / Deskripsi</CFormLabel>
                <CFormTextarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Keterangan tambahan (opsional)"
                />
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2">
              <CButton color="secondary" onClick={onClose} disabled={loading}>
                Batal
              </CButton>
              <CButton
                color={editData ? 'warning' : 'success'}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CSpinner size="sm" /> : editData ? 'Update' : 'Simpan'}
              </CButton>
            </div>
          </CForm>
        )}
      </CModalBody>
    </CModal>
  )
}
