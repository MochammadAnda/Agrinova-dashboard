import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'

const ShowButton = ({ onClick }) => {
  return (
    <CButton size="sm" className="d-flex align-items-center gap-2" color="none" onClick={onClick}>
      <CIcon icon={cilSearch} className="text-primary" />
      <span className="fw-medium">Detail</span>
    </CButton>
  )
}

export default ShowButton
