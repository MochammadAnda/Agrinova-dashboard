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
  transactionType,
  setTransactionType,
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
    const fetchDetail = async () => {
      if (!visible || mode !== 'edit') return
      setLoading(true)
      try {
        const res = await axiosInstance.get(`${endpoint}/${id}`)
        const d = res.data
        setStatus(d.status)
        setItemName(d.item_name)
        setQuantity(Math.abs(d.quantity))
      } catch (err) {
        onError?.('Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [visible, id, mode])

  // Ambil stok hanya untuk barang keluar
  useEffect(() => {
    const fetchStock = async () => {
      if (visible && (status === 'Keluar' || mode === 'store')) {
        try {
          const res = await axiosInstance.get('/api/inventories/summary')
          setStockList(res.data.items || []) // 🛠 pastikan res.data.items
          console.log('Stock list berhasil diambil:', res.data.items)
        } catch (err) {
          console.error('Gagal mengambil stock list:', err)
          setStockList([]) // fallback empty list
        }
      }
    }

    fetchStock()
  }, [visible, status, mode])

  // Reset form saat modal dibuka dalam mode tambah
  useEffect(() => {
    if (visible && mode === 'store') {
      setItemName('')
      setQuantity('')
      setStatus(transactionType === 'Keluar Stok' ? 'Keluar' : 'Masuk')
      setError(null)
    }
  }, [visible, mode, transactionType])

  const capitalizeWords = (str) => str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  useEffect(() => {
    if (transactionType === 'Keluar Stok') {
      setStatus('Keluar')
    } else {
      setStatus('Masuk')
    }
  }, [transactionType])

  const handleSubmit = async () => {
    setError(null)

    if (isDelete) {
      setLoading(true)
      try {
        await axiosInstance.delete(`${endpoint}/${id}`)
        onSuccess?.()
      } catch (err) {
        onError?.('Gagal menghapus data')
      } finally {
        setLoading(false)
      }
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

    try {
      if (mode === 'edit') {
        await axiosInstance.put(`${endpoint}/${id}`, payload)
      } else {
        await axiosInstance.post(endpoint, payload)
      }
      onSuccess?.()
    } catch (err) {
      onError?.('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const renderItemField = () => {
    if (transactionType === 'Masuk Baru') {
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
            {transactionType === 'Masuk Baru' ? (
              <CFormInput label="Tipe Transaksi" value="Masuk" disabled />
            ) : (
              <CFormInput label="Tipe Transaksi" value={status} disabled />
            )}

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
