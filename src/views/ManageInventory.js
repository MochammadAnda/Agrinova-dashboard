import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useState, useEffect } from 'react'
import InventoryModal from '../components/modals/InventoryModal'
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import { useToast } from '../components/ToastManager'
import axiosInstance from '../core/axiosInstance'
import CIcon from '@coreui/icons-react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { cilStorage } from '@coreui/icons'

// Capitalize each word
const capitalizeWords = (str) => str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

const ManageInventory = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('store') // 'store', 'edit', 'delete'
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)
  const Toast = useToast()
  const [summary, setSummary] = useState(null)
  const [transactionType, setTransactionType] = useState('Masuk Baru')

  useEffect(() => {
    axiosInstance
      .get('/api/inventories/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => console.error('Gagal mengambil summary:', err))
  }, [reload])

  const openModal = (mode, id = null, trxType = 'Masuk Baru') => {
    setModalMode(mode)
    setTransactionType(trxType)
    setSelectedId(id)
    setModalVisible(true)
  }

  const handleAdd = () => openModal('store')
  // const handleEdit = (id) => openModal('edit', id)
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
    {
      key: 'item_name',
      label: 'Nama Barang',
      render: (item) => capitalizeWords(item.item_name),
    },
    { key: 'quantity', label: 'Jumlah' },
    { key: 'status', label: 'Status' },
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

  const endpoint = '/api/inventories'
  const section = 'inventory'

  return (
    <>
      {/* === TOTAL INVENTORY CARD === */}
      {summary?.total_inventory !== undefined && (
        <div className="row mb-3">
          <div className="col-md-4">
            <CCard className="p-3 d-flex flex-row align-items-center gap-3 border-primary border-start border-4 shadow-sm">
              <CIcon icon={cilStorage} size="xxl" className="text-primary" />
              <div>
                <div className="text-medium-emphasis">Total Barang di Inventory</div>
                <h4 className="fw-bold mb-0">{summary.total_inventory}</h4>
              </div>
            </CCard>
          </div>
        </div>
      )}

      {/* === PER ITEM CARDS === */}
      <div className="row">
        {summary?.items?.map((item) => (
          <div className="col-md-4 mb-3" key={item.item_name}>
            <CCard className="p-3 d-flex flex-row align-items-center gap-3">
              <CIcon icon={cilStorage} size="xxl" className="text-primary" />
              <div>
                <div className="text-medium-emphasis">{capitalizeWords(item.item_name)}</div>
                <h4 className="fw-bold mb-0">{item.total_quantity}</h4>
              </div>
            </CCard>
          </div>
        ))}
      </div>

      {/* === TABEL DAN MODAL === */}
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Manage Inventory</h4>
            <CDropdown>
              <CDropdownToggle color="primary">Tambah Inventory</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => openModal('store', null, 'Masuk Baru')}>
                  Barang Masuk Baru
                </CDropdownItem>
                <CDropdownItem onClick={() => openModal('store', null, 'Tambah Stok')}>
                  Tambah Stok
                </CDropdownItem>
                <CDropdownItem onClick={() => openModal('store', null, 'Keluar Stok')}>
                  Keluar Stok
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>

          <PaginatedTable columns={columns} endpoint={endpoint} reload={reload} />
        </CCardBody>
      </CCard>

      <InventoryModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedId(null)
        }}
        mode={modalMode}
        id={selectedId}
        endpoint={endpoint}
        titleMap={{
          store: `Tambah ${section}`,
          delete: `Hapus ${section}`,
        }}
        onSuccess={() => {
          const message =
            modalMode === 'delete'
              ? `${section} berhasil dihapus`
              : `${section} berhasil ditambahkan`
          handleSuccess(message)
        }}
        onError={handleError}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />
    </>
  )
}

export default ManageInventory
