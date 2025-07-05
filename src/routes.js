import React from 'react'

// Views
const Dashboard = React.lazy(() => import('./views/Dashboard'))
const ManageCategory = React.lazy(() => import('./views/ManageCategory'))
const ManageTag = React.lazy(() => import('./views/ManageTag'))
const ManageAdmin = React.lazy(() => import('./views/ManageAdmin'))
const ManagePemantau = React.lazy(() => import('./views/ManagePemantau'))
const ManagePenyandang = React.lazy(() => import('./views/ManagePenyandang'))
const ManageBlindstick = React.lazy(() => import('./views/ManageBlindstick'))
const ManageFinance = React.lazy(() => import('./views/ManageFinance'))
const ManageInventory = React.lazy(() => import('./views/ManageInventory'))
const ManageProduction = React.lazy(() => import('./views/ManageProduction'))
const UserSetting = React.lazy(() => import('./views/UserSetting'))
// const Login = React.lazy(() => import('./views/Login'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manage-category', name: 'Manage Category', element: ManageCategory },
  { path: '/manage-tag', name: 'Manage Tag', element: ManageTag },
  { path: '/manage-post', name: 'Manage Post', element: Dashboard },
  { path: '/manage-admin', name: 'Manage Admin', element: ManageAdmin },
  { path: '/manage-pemantau', name: 'Manage Pemantau', element: ManagePemantau },
  { path: '/manage-penyandang', name: 'Manage Penyandang', element: ManagePenyandang },
  { path: '/manage-blindstick', name: 'Manage Blindstick', element: ManageBlindstick },
  { path: '/profile', name: 'Profile', element: Dashboard },
  { path: '/manage-finance', name: 'Manage Finance', element: ManageFinance },
  { path: '/manage-inventory', name: 'Manage Inventory', element: ManageInventory },
  { path: '/manage-production', name: 'Manage Production', element: ManageProduction },
  { path: '/user-setting', name: 'User Setting', element: UserSetting },
  // { path: '/login', name: 'login', element: Login },
]

export default routes
