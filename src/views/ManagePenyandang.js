import { CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'

const ManagePenyandang = () => {
  const columns = [
    { key: 'nomor', label: 'No.', _props: { scope: 'col' } },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Nama' },
  ]
  const endpoint = '/dashboard/manage-penyandang/'

  return (
    <CCard className="mb-4 p-4">
      <CCardBody className="d-flex flex-column gap-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Manage Penyandang</h4>
          <button className="btn btn-primary p-2 px-3 fw-medium">Tambah Penyandang</button>
        </div>

        <PaginatedTable columns={columns} endpoint={endpoint} />
      </CCardBody>
    </CCard>
  )
}

export default ManagePenyandang
