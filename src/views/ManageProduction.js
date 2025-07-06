import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState, useEffect } from 'react'
import CrudModal from '../components/modals/CrudModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'
import CIcon from '@coreui/icons-react'
import { cilFactory } from '@coreui/icons'

const ManageProduction = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store') // 'store', 'edit', 'delete'
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)
  const Toast = useToast()

  const [summary, setSummary] = useState({ total_quantity: 0 })

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
  const handleEdit = (id) => openModal('edit', id)
  const handleDelete = (id) => openModal('delete', id)

  const handleSuccess = (message) => {
    setModalVisible(false)
    setSelectedId(null)
    Toast.success(message)
    setReload((prev) => !prev)
  }
  const handleError = (message) => {
    Toast.error(message)
  }

  const columns = [
    { key: 'product_name', label: 'Nama Produk' },
    { key: 'quantity', label: 'Jumlah' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          <EditButton onClick={() => handleEdit(item.id)} />
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
  ]

  return (
    <>
      <div className="mb-4">
        <CCard style={{ maxWidth: '300px' }}>
          <CCardBody className="d-flex flex-column gap-1">
            <span className="text-muted fw-semibold">Total Jumlah Produksi</span>
            <div className="d-flex align-items-center gap-2">
              <CIcon icon={cilFactory} className="text-primary" height={20} width={20} />
              <h4 className="m-0 fw-bold">{summary.total_quantity}</h4>
            </div>
          </CCardBody>
        </CCard>
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

      <CrudModal
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
      />
    </>
  )
}

export default ManageProduction
