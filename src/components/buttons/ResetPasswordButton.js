import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'

const ResetPasswordButton = ({ onClick }) => {
  return (
    <CButton size="sm" className="d-flex align-items-center gap-2" color="none" onClick={onClick}>
      <CIcon icon={cilLockLocked} className="text-primary" />
      <span className="fw-medium">Reset Password</span>
    </CButton>
  )
}

export default ResetPasswordButton
