import { CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import { useLocation, useNavigate } from 'react-router-dom'

const ManageBlindstick = () => {
  const columns = [
    { key: 'nomor', label: 'No.', _props: { scope: 'col' } },
    { key: 'mac_address', label: 'Mac Address' },
    { key: 'is_used', label: 'Status' },
  ]
  const endpoint = '/dashboard/manage-blindstick/'

  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const isUsed = params.get('is_used')

  const handleFilterChange = (e) => {
    const value = e.target.value
    const newParams = new URLSearchParams(location.search)
    if (value === '') {
      newParams.delete('is_used')
    } else {
      newParams.set('is_used', value)
    }
    newParams.set('page', 1) // reset to page 1
    navigate({ search: newParams.toString() })
  }

  return (
    <CCard className="mb-4 p-4">
      <CCardBody className="d-flex flex-column gap-4">
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* Left Side: Filter */}
          <h4>Manage Blindstick</h4>

          <div className="d-flex align-items-center gap-2">
            <select
              id="filterStatus"
              className="form-select p-2 px-3"
              style={{ width: '200px' }}
              value={isUsed || ''}
              onChange={handleFilterChange}
            >
              <option value="">Semua Status</option>
              <option value="0">Sudah Digunakan</option>
              <option value="1">Belum Digunakan</option>
            </select>
            <button className="btn btn-primary p-2 px-3 fw-medium">Tambah Blindstick</button>
          </div>
        </div>

        {/* Table */}
        <PaginatedTable columns={columns} endpoint={endpoint} />
      </CCardBody>
    </CCard>
  )
}

export default ManageBlindstick
