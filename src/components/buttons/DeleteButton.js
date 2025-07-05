import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'

const DeleteButton = ({ onClick }) => {
  return (
    <CButton size="sm" className="d-flex align-items-center gap-2" color="none" onClick={onClick}>
      <CIcon icon={cilTrash} className="text-primary" />
      <span className="fw-medium">Delete</span>
    </CButton>
  )
}

export default DeleteButton
