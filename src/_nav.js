import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBlind,
  cilCog,
  cilInbox,
  cilList,
  cilNotes,
  cilSpeedometer,
  cilTag,
  cilUser,
  cilDollar,
  cilWallet,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'WMS',
  },
  {
    component: CNavItem,
    name: 'Manage Finance',
    to: '/manage-finance',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Inventory',
    to: '/manage-inventory',
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Production',
    to: '/manage-production',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'AI',
  },
  {
    component: CNavItem,
    name: 'AI Assistent',
    to: '/manage-admin',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'User Settings',
    to: '/user-setting',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
]

export default _nav
