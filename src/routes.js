import React from 'react'

// Views
const Dashboard = React.lazy(() => import('./views/Dashboard'))
const ManageAdmin = React.lazy(() => import('./views/ManageAdmin'))
const ManageFinance = React.lazy(() => import('./views/ManageFinance'))
const ManageInventory = React.lazy(() => import('./views/ManageInventory'))
const ManageProduction = React.lazy(() => import('./views/ManageProduction'))
const UserSetting = React.lazy(() => import('./views/UserSetting'))
const ChatBot = React.lazy(() => import('./views/ChatBot'))
const Notes = React.lazy(() => import('./views/ManageNotes'))
const TodoGenerator = React.lazy(() => import('./views/TodoGenerator'))
// const Login = React.lazy(() => import('./views/Login'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manage-post', name: 'Manage Post', element: Dashboard },
  { path: '/manage-admin', name: 'Manage Admin', element: ManageAdmin },
  { path: '/profile', name: 'Profile', element: Dashboard },
  { path: '/manage-finance', name: 'Manage Finance', element: ManageFinance },
  { path: '/manage-inventory', name: 'Manage Inventory', element: ManageInventory },
  { path: '/manage-production', name: 'Manage Production', element: ManageProduction },
  { path: '/user-setting', name: 'Profile Setting', element: UserSetting },
  { path: '/chat-bot', name: 'Chat Bot', element: ChatBot },
  { path: '/manage-notes', name: 'Manage Notes', element: Notes },
  { path: '/todo-generator', name: 'Todo Generator', element: TodoGenerator },
  // { path: '/login', name: 'login', element: Login },
]

export default routes
