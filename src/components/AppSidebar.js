import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import { cilAccountLogout } from '@coreui/icons'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [logoutConfirm, setLogoutConfirm] = useState(false)

  const confirmLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('avatar_url')

    // Redirect ke halaman login
    navigate('/login')
  }

  return (
    <>
      <CSidebar
        className="border-end"
        colorScheme="dark"
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible })
        }}
      >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand to="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
            <img
              src="./public/agrinova-logomark.png"
              alt="Logo"
              style={{ height: 32, marginRight: 10 }}
            />
            <h5 className="d-inline align-middle mb-0">AGRINOVA</h5>
          </CSidebarBrand>
        </CSidebarHeader>

        <AppSidebarNav items={navigation} />

        <CSidebarFooter className="border-top d-none d-lg-flex">
          <CButton
            color="danger"
            className="w-100 text-white"
            onClick={() => setLogoutConfirm(true)}
          >
            <CIcon icon={cilAccountLogout} customClassName="me-2" height={16} />
            Logout
          </CButton>
        </CSidebarFooter>
      </CSidebar>

      {/* Modal Konfirmasi Logout */}
      <CModal visible={logoutConfirm} onClose={() => setLogoutConfirm(false)}>
        <CModalHeader>
          <CModalTitle>Konfirmasi Logout</CModalTitle>
        </CModalHeader>
        <CModalBody>Apakah Anda yakin ingin logout?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setLogoutConfirm(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmLogout}>
            Logout
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default React.memo(AppSidebar)
