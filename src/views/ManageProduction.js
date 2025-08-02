import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState, useEffect } from 'react'
import ProductionModal from '../components/modals/ProductionModal' // ganti import
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'
import CIcon from '@coreui/icons-react'
import { cilFactory } from '@coreui/icons'

const ManageProduction = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store')
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)
  const Toast = useToast()
  const [editData, setEditData] = useState(null)

  const [summary, setSummary] = useState({
    total_masuk: 0,
    total_keluar: 0,
    total_akhir: 0,
  })

  useEffect(() => {
    axiosInstance
      .get('/api/productions/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => console.error('Gagal ambil ringkasan produksi:', err))
  }, [reload])

  const openModal = (mode, id = null) => {
    setModalMode(mode)
    setSelectedId(id)
    setModalVisible(true)
  }

  const handleAdd = () => openModal('store')
  //const handleEdit = (id) => openModal('edit', id)

  useEffect(() => {
    if (editData) {
      console.log('Edit data baru masuk:', editData)
    }
  }, [editData])

  const handleDelete = async (id) => {
    const response = await axiosInstance.get(`/api/productions/${id}`)
    setEditData(response.data)
    console.log(response.data)
    openModal('delete', id)
  }

  const handleSuccess = (message) => {
    setModalVisible(false)
    setSelectedId(null)
    Toast.success(message)
    setReload((prev) => !prev)
  }

  const handleError = (message) => {
    Toast.error(message)
  }

  const handleCreateProduction = async (data) => {
    try {
      await axiosInstance.post('/api/productions', data)
      handleSuccess('Produksi berhasil ditambahkan')
    } catch (error) {
      handleError('Gagal menambahkan produksi')
    }
  }

  const handleEdit = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/productions/${id}`)
      setEditData(response.data.data)
      openModal('edit')
    } catch (error) {
      handleError('Gagal mengambil data untuk edit')
    }
  }
  const handleUpdateProduction = async (data) => {
    try {
      await axiosInstance.put(`/api/productions/${data.id}`, data)
      handleSuccess('Produksi berhasil diupdate')
    } catch (error) {
      handleError('Gagal mengupdate produksi')
    }
  }

  const handleDeleteProduction = async (id) => {
    try {
      await axiosInstance.delete(`/api/productions/${id}`)
      handleSuccess('Produksi berhasil dihapus')
      setEditData(null)
    } catch (error) {
      handleError('Gagal menghapus produksi')
    }
  }

  const columns = [
    { key: 'product_name', label: 'Nama Produk' },
    { key: 'quantity', label: 'Jumlah' },
    { key: 'unit', label: 'Unit' },
    { key: 'harvest_date', label: 'Tanggal Panen' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Catatan' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          {/* <EditButton onClick={() => handleEdit(item.id)} /> */}
          <DeleteButton onClick={() => handleDelete(item.id)} />
        </div>
      ),
    },
  ]

  const endpoint = '/api/productions'
  const section = 'production'

  const fields = [
    { name: 'product_name', label: 'Nama Produk', type: 'text' },
    { name: 'quantity', label: 'Jumlah', type: 'integer' },
    {
      name: 'unit',
      label: 'Unit (Kategori)',
      type: 'select',
      options: [
        { label: 'Sayuran', value: 'Sayuran' },
        { label: 'Buah-buahan', value: 'Buah-buahan' },
      ],
    },
    { name: 'harvest_date', label: 'Tanggal Panen', type: 'date' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Masuk', value: 'Masuk' },
        { label: 'Keluar', value: 'Keluar' },
      ],
    },
    { name: 'notes', label: 'Catatan / Deskripsi', type: 'textarea' },
  ]

  return (
    <>
      <div className="row mb-4">
        <div className="col-12 col-md-4">
          <CCard className="p-3 d-flex flex-column gap-1  border-4 shadow-sm">
            <span className="text-muted fw-semibold">Total Masuk</span>
            <strong className="fs-4">{summary.total_masuk}</strong>
          </CCard>
        </div>

        <div className="col-12 col-md-4">
          <CCard className="p-3 d-flex flex-column gap-1  border-4 shadow-sm">
            <span className="text-muted fw-semibold">Total Keluar</span>
            <strong className="fs-4">{summary.total_keluar}</strong>
          </CCard>
        </div>

        <div className="col-12 col-md-4">
          <CCard className="p-3 d-flex flex-column gap-1 border-start border-success border-4 shadow-sm">
            <span className="text-muted fw-semibold">Sisa Akhir</span>
            <strong className="fs-4">{summary.total_akhir}</strong>
          </CCard>
        </div>
      </div>

      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Manage Production</h4>
            <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
              Tambah production
            </CButton>
          </div>

          <PaginatedTable columns={columns} endpoint={endpoint} reload={reload} />
        </CCardBody>
      </CCard>

      <ProductionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedId(null)
        }}
        mode={modalMode}
        id={selectedId}
        endpoint={endpoint}
        fields={fields}
        titleMap={{
          store: `Tambah ${section}`,
          edit: `Edit ${section}`,
          delete: `Hapus ${section}`,
        }}
        onSuccess={() => {
          const message =
            modalMode === 'edit'
              ? `${section} berhasil diupdate`
              : modalMode === 'delete'
                ? `${section} berhasil dihapus`
                : `${section} berhasil ditambahkan`
          handleSuccess(message)
        }}
        onError={handleError}
        onCreate={handleCreateProduction}
        onUpdate={handleUpdateProduction}
        onDelete={handleDeleteProduction}
        editData={editData}
      />
    </>
  )
}

export default ManageProduction
