import { CButton, CCard, CCardBody, CCardTitle } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useEffect, useState } from 'react'
import CrudModal from '../components/modals/CrudModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'
import CIcon from '@coreui/icons-react'
import { cilArrowThickFromBottom, cilArrowThickToTop, cilWallet } from '@coreui/icons'

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

  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  })

  useEffect(() => {
    axiosInstance
      .get('/api/finances/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => console.error('Gagal ambil ringkasan:', err))
  }, [reload])

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
      <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        <CCard className="flex-fill shadow-sm" style={{ minWidth: '250px' }}>
          <CCardBody className="d-flex flex-column gap-1">
            <span className="text-muted fw-semibold">Total Pemasukan</span>
            <div className="d-flex align-items-center gap-2">
              <CIcon icon={cilArrowThickFromBottom} className="text-success" />
              <h4 className="m-0 fw-bold text-success">
                Rp {summary.total_income.toLocaleString()}
              </h4>
            </div>
          </CCardBody>
        </CCard>

        <CCard className="flex-fill shadow-sm" style={{ minWidth: '250px' }}>
          <CCardBody className="d-flex flex-column gap-1">
            <span className="text-muted fw-semibold">Total Pengeluaran</span>
            <div className="d-flex align-items-center gap-2">
              <CIcon icon={cilArrowThickToTop} className="text-danger" />
              <h4 className="m-0 fw-bold text-danger">
                Rp {summary.total_expense.toLocaleString()}
              </h4>
            </div>
          </CCardBody>
        </CCard>

        <CCard className="flex-fill shadow-sm" style={{ minWidth: '250px' }}>
          <CCardBody className="d-flex flex-column gap-1">
            <span className="text-muted fw-semibold">Total Keuangan</span>
            <div className="d-flex align-items-center gap-2">
              <CIcon icon={cilWallet} className="text-primary" />
              <h4 className="m-0 fw-bold text-primary">Rp {summary.balance.toLocaleString()}</h4>
            </div>
          </CCardBody>
        </CCard>
      </div>

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
