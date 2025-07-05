import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { cilAccountLogout } from '@coreui/icons'

const AppSidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Redirect ke halaman login
    navigate('/login')
  }

  return (
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
        <CSidebarBrand
          style={{
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
          to="/"
        >
          <h5>AGRINOVA</h5>
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CButton color="danger" className="w-100 text-white" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} customClassName="me-2" height={16} />
          Logout
        </CButton>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
