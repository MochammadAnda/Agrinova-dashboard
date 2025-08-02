import React, { use, useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../../public/profile.jpg'
import axiosInstance from '../../core/axiosInstance'

const AppHeaderDropdown = () => {
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar_url') || avatar8)

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar_url')
    if (savedAvatar) {
      setAvatar(savedAvatar)
    } else {
      axiosInstance
        .get('/api/user/profile')
        .then((res) => {
          const url = res.data.photo_profile || avatar8
          setAvatar(url)
          localStorage.setItem('avatar_url', url)
        })
        .catch((err) => console.error('Gagal mengambil foto profil:', err))
    }

    // 🔥 Dengarkan event avatar diubah
    const handleAvatarChange = (e) => {
      setAvatar(e.detail)
    }

    window.addEventListener('avatar-updated', handleAvatarChange)

    // Bersihkan event listener saat komponen dibongkar
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarChange)
    }
  }, [])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <div
          className="rounded-circle overflow-hidden border shadow"
          style={{ width: 40, height: 40, flexShrink: 0 }} // kecilkan sesuai ukuran avatar dropdown
        >
          <img
            src={avatar}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </CDropdownToggle>
      {/* <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>

        <CDropdownItem href="#/user-setting">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
      </CDropdownMenu> */}
    </CDropdown>
  )
}

export default AppHeaderDropdown
