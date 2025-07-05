import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'

const EditButton = ({ onClick }) => {
  return (
    <CButton size="sm" className="d-flex align-items-center gap-2" color="none" onClick={onClick}>
      <CIcon icon={cilPencil} className="text-primary" />
      <span className="fw-medium">Edit</span>
    </CButton>
  )
}

export default EditButton
