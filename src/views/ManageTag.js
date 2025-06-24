import { CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'

const ManageTag = () => {
  const columns = [
    { key: 'nomor', label: 'No.', _props: { scope: 'col' } },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
  ]
  const endpoint = '/dashboard/manage-tag/'

  return (
    <CCard className="mb-4 p-4">
      <CCardBody className="d-flex flex-column gap-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Manage Tag</h4>
          <button className="btn btn-primary p-2 px-3 fw-medium">Tambah Tag</button>
        </div>

        <PaginatedTable columns={columns} endpoint={endpoint} />
      </CCardBody>
    </CCard>
  )
}

export default ManageTag
