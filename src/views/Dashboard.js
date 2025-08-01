import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilLocationPin,
  cilBriefcase,
  cilPencil,
  cilWallet,
  cilStorage,
  cilIndustry,
  cilCloudDownload,
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import avatarPlaceholder from '../../public/profile.jpg'
import axiosInstance from '../core/axiosInstance'
import MainChart from './MainChart'
import axios from 'axios'

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [summary, setSummary] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [production, setProduction] = useState(null)
  const [notes, setNotes] = useState(null)
  const [recentNotes, setRecentNotes] = useState([])

  const navigate = useNavigate()

  const handleEditProfile = () => {
    navigate('/user-setting')
  }

  useEffect(() => {
    axiosInstance.get('/api/profile').then((res) => {
      setProfile(res.data)
    })
    axiosInstance.get('/api/finances/summary').then((res) => {
      setSummary(res.data)
    })
    axiosInstance.get('/api/productions/summary').then((res) => {
      setProduction(res.data)
    })
    axiosInstance
      .get('/api/notes/latest') // endpoint sesuai backend
      .then((res) => setNotes(res.data))
      .catch((err) => console.error('Gagal ambil notes:', err))
    axiosInstance.get('/api/notes/latest').then((res) => {
      setRecentNotes(res.data)
    })
  }, [])

  useEffect(() => {
    const fetchInventorySummary = async () => {
      try {
        const res = await axiosInstance.get('/api/inventories/summary')
        setInventory(res.data)
        console.log('Ringkasan inventory:', res.data)
      } catch (err) {
        console.error('Gagal mengambil ringkasan inventory:', err)
        setInventory(null)
      }
    }

    fetchInventorySummary()
  }, [])

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  return (
    <>
      {/* Profile Card */}
      {profile && (
        <CCard className="mb-4 shadow-sm">
          <CCardBody className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-4">
              <CAvatar
                src={profile.avatar || avatarPlaceholder}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  overflow: 'hidden',
                }}
                className="border border-white shadow-sm"
              />

              <div>
                <h5 className="mb-1 fw-bold">{profile.name}</h5>
                <div className="text-muted medium p-1">
                  <CIcon icon={cilUser} className="me-1" />
                  {profile.email}
                </div>
                <div className="text-muted medium p-1">
                  <CIcon icon={cilLocationPin} className="me-1" />
                  {profile.location || '-'}
                </div>
              </div>
            </div>
            <div>
              <CButton color="green" variant="outline" size="sm" onClick={handleEditProfile}>
                <CIcon icon={cilPencil} className="me-2" /> Edit Profile
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      )}
      <CCard className="mb-4 shadow-sm border-0" style={{ background: '#f8f9fa' }}>
        <CCardHeader className="fw-bold bg-white border-bottom">
          📊 Ringkasan Warehouse Management System (WMS)
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            {summary && (
              <CCol md={4}>
                <CCard className="text-white bg-primary">
                  <CCardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-white text-opacity-75">Total Keuangan</div>
                        <h4 className="mb-0">Rp {summary.balance.toLocaleString()}</h4>
                      </div>
                      <CIcon icon={cilWallet} size="xxl" className="opacity-50" />
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            )}

            {inventory?.total_inventory !== undefined && (
              <CCol md={4}>
                <CCard className="text-white bg-info">
                  <CCardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-white text-opacity-75">Total Stok Barang</div>
                        <h4 className="mb-0">{inventory.total_inventory} unit</h4>
                      </div>
                      <CIcon icon={cilStorage} size="xxl" className="opacity-50" />
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            )}

            {production?.total_akhir !== undefined && (
              <CCol md={4}>
                <CCard className="text-white bg-secondary">
                  <CCardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-white text-opacity-75">Total Produksi</div>
                        <h4 className="mb-0">{production.total_akhir} unit</h4>
                      </div>
                      <CIcon icon={cilIndustry} size="xxl" style={{ color: 'white' }} />
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            )}
          </CRow>

          <div className="text-end">
            <CButton
              color="danger"
              variant="outline"
              onClick={() => window.open('http://localhost:8000/export-wms', '_blank')}
            >
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export PDF WMS
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {recentNotes.length > 0 && (
        <CCard className="mb-4 shadow-sm border-0" style={{ background: '#f8f9fa' }}>
          <CCardHeader className="fw-bold bg-white border-bottom">Catatan Terbaru</CCardHeader>
          <CCardBody className="p-3">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="mb-3 pb-3 border-bottom"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/manage-notes')} // atau tampilkan modal detail
              >
                <h5 className="fw-semibold mb-1">{note.title}</h5>
                <div className="mb-1 text-dark text-opacity-75">{note.content}</div>
                <small className="text-muted">{new Date(note.updated_at).toLocaleString()}</small>
                <p className="mb-0 text-dark text-opacity-75">{note.excerpt}</p>
              </div>
            ))}
            <div className="text-end mt-3">
              <CButton
                size="sm"
                color="primary"
                variant="outline"
                onClick={() => navigate('/manage-notes')}
              >
                Lihat Semua Catatan
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default Dashboard
