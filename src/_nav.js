import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCog,
  cilInbox,
  cilNotes,
  cilSpeedometer,
  cilIndustry,
  cilWallet,
  cilChatBubble,
  cilListRich,
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
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'AI and Notes',
  },
  {
    component: CNavItem,
    name: 'AI Assistent',
    to: '/chat-bot',
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Todo Generator',
  //   to: '/todo-generator',
  //   icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  // },

  {
    component: CNavItem,
    name: 'Notes',
    to: '/manage-notes',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />, // pilih ikon CoreUI sesuai selera
  },

  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Profile Settings',
    to: '/user-setting',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Todo',
    to: '/todo',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
]

export default _nav
