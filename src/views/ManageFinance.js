import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState } from 'react'
import CrudModal from '../components/modals/CrudModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useToast } from '../components/ToastManager'

const ManageFinance = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store') // 'store', 'edit', 'delete'
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)
  const Toast = useToast()

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
    { key: 'title', label: 'Judul' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'amount', label: 'Jumlah' },
    { key: 'type', label: 'Tipe' },
    { key: 'date', label: 'Tanggal' },
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

  const endpoint = '/api/finances'
  const section = 'finance'
  const fields = [
    { name: 'title', label: 'Judul', type: 'text' },
    { name: 'description', label: 'Deskripsi', type: 'text' },
    { name: 'amount', label: 'Jumlah', type: 'integer' },
    {
      name: 'type',
      label: 'Tipe',
      type: 'select',
      options: [
        { value: 'income', label: 'Pemasukan' },
        { value: 'expense', label: 'Pengeluaran' },
      ],
    },
    { name: 'date', label: 'Tanggal', type: 'date' },
  ]

  return (
    <>
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Manage Finance</h4>
            <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
              Tambah Finance
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

export default ManageFinance
