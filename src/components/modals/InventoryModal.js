import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'

const InventoryModal = ({
  visible,
  onClose,
  mode = 'store',
  id,
  endpoint,
  titleMap = { store: 'Tambah', edit: 'Edit', delete: 'Hapus' },
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [status, setStatus] = useState('Masuk')
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [stockList, setStockList] = useState([])

  const isDelete = mode === 'delete'

  // Ambil data detail transaksi jika edit
  useEffect(() => {
    if (!visible || mode !== 'edit') return
    setLoading(true)
    axiosInstance
      .get(`${endpoint}/${id}`)
      .then((res) => {
        const d = res.data
        setStatus(d.status)
        setItemName(d.item_name)
        setQuantity(Math.abs(d.quantity))
      })
      .catch(() => onError?.('Gagal memuat data'))
      .finally(() => setLoading(false))
  }, [visible, id, mode])

  // Ambil stok hanya untuk barang keluar
  useEffect(() => {
    if (visible && (status === 'Keluar' || mode === 'store')) {
      axiosInstance.get('/api/inventories/summary').then((res) => setStockList(res.data))
    }
  }, [visible, status, mode])

  const capitalizeWords = (str) => str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  const handleSubmit = () => {
    setError(null)

    if (isDelete) {
      setLoading(true)
      axiosInstance
        .delete(`${endpoint}/${id}`)
        .then(() => onSuccess?.())
        .catch(() => onError?.('Gagal menghapus data'))
        .finally(() => setLoading(false))
      return
    }

    // Validasi input
    if (!itemName || !quantity) {
      setError('Semua field wajib diisi')
      return
    }

    if (status === 'Keluar') {
      const stok = stockList.find((s) => s.item_name === itemName)?.total_quantity || 0
      if (+quantity > stok) {
        setError(`Stok ${itemName} hanya ${stok}`)
        return
      }
    }

    setLoading(true)
    const payload = {
      item_name: itemName,
      quantity: Number(quantity),
      status,
    }

    const req =
      mode === 'edit'
        ? axiosInstance.put(`${endpoint}/${id}`, payload)
        : axiosInstance.post(endpoint, payload)

    req
      .then(() => onSuccess?.())
      .catch(() => onError?.('Terjadi kesalahan'))
      .finally(() => setLoading(false))
  }

  const renderItemField = () => {
    if (status === 'Masuk') {
      return (
        <>
          <CFormInput
            list="barang-list"
            label="Nama Barang"
            value={itemName}
            onChange={(e) => setItemName(capitalizeWords(e.target.value))}
            required
          />
          <datalist id="barang-list">
            {[...new Set(stockList.map((s) => capitalizeWords(s.item_name)))].map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </>
      )
    }

    return (
      <CFormSelect
        label="Nama Barang"
        value={itemName}
        options={[
          { label: 'Pilih…', value: '' },
          ...stockList.map((s) => ({
            label: capitalizeWords(s.item_name),
            value: capitalizeWords(s.item_name),
          })),
        ]}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
    )
  }

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader>
        <h5>{titleMap[mode]}</h5>
      </CModalHeader>

      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        {loading ? (
          <div className="text-center py-4">
            <CSpinner />
          </div>
        ) : isDelete ? (
          <p>Yakin ingin menghapus transaksi ini?</p>
        ) : (
          <CForm className="d-flex flex-column gap-3">
            <CFormSelect
              label="Tipe Transaksi"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Masuk', value: 'Masuk' },
                { label: 'Keluar', value: 'Keluar' },
              ]}
            />
            {renderItemField()}
            <CFormInput
              label="Jumlah"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </CForm>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onClose} disabled={loading}>
          Batal
        </CButton>
        <CButton color={isDelete ? 'danger' : 'primary'} onClick={handleSubmit} disabled={loading}>
          {loading ? <CSpinner component="span" size="sm" /> : isDelete ? 'Hapus' : 'Simpan'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default InventoryModal
