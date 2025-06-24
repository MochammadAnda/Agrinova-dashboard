import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBlind,
  cilCog,
  cilList,
  cilLowVision,
  cilMonitor,
  cilNotes,
  cilSpeedometer,
  cilTag,
  cilUser,
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
    name: 'CMS',
  },
  {
    component: CNavItem,
    name: 'Manage Category',
    to: '/manage-category',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Tag',
    to: '/manage-tag',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Post',
    to: '/manage-post',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'User',
  },
  {
    component: CNavItem,
    name: 'Manage Admin',
    to: '/manage-admin',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Blindstick',
    to: '/manage-blindstick',
    icon: <CIcon icon={cilLowVision} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Pemantau',
    to: '/manage-pemantau',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Penyandang',
    to: '/manage-penyandang',
    icon: <CIcon icon={cilBlind} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'User Settings',
    to: '/profile',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
]

export default _nav
