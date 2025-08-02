import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CSpinner,
  CBadge,
  CButton,
  CCollapse,
} from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'

// Fungsi format tanggal: dari '2025-07-24' => '24 Juli 2025'
const formatTanggalIndo = (tanggalString) => {
  if (!tanggalString || tanggalString === '-') return '-'
  const bulanIndo = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  const [tahun, bulan, hari] = tanggalString.split('-')
  return `${parseInt(hari)} ${bulanIndo[parseInt(bulan) - 1]} ${tahun}`
}

const ManageTodo = () => {
  const [groupedTodos, setGroupedTodos] = useState({})
  const [loading, setLoading] = useState(true)
  const [openDetails, setOpenDetails] = useState({})
  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user?.id

  useEffect(() => {
    const fetchTodoFromFirebase = async () => {
      try {
        const response = await axiosInstance.get('/api/todo-from-firebase')
        const rawData = response.data

        if (rawData && typeof rawData === 'object') {
          const grouped = {}

          Object.entries(rawData).forEach(([firebaseId, item]) => {
            const programName = item.program_name || 'Tanpa Nama Program'
            const keyword = item.keyword || '-'
            const responseObject = item.response || {}
            const weekNumber = item.week_number || '-'

            const days = Object.entries(responseObject).map(([dayKey, dayDetail]) => ({
              day: dayKey,
              date: dayDetail?.date || '-',
              task: dayDetail?.task || '-',
              status: dayDetail?.status || '-',
            }))

            const startDate = days[0]?.date || '-'
            const endDate = days[days.length - 1]?.date || '-'

            if (!grouped[programName]) grouped[programName] = []

            grouped[programName].push({
              firebaseId,
              keyword,
              weekNumber,
              days,
              startDate,
              endDate,
            })
          })

          setGroupedTodos(grouped)
        } else {
          setGroupedTodos({})
        }
      } catch (error) {
        console.error('Gagal mengambil data todo dari Firebase:', error)
        setGroupedTodos({})
      } finally {
        setLoading(false)
      }
    }

    fetchTodoFromFirebase()
  }, [])

  const toggleDetail = (firebaseId) => {
    setOpenDetails((prev) => ({
      ...prev,
      [firebaseId]: !prev[firebaseId],
    }))
  }

  return (
    <div>
      <h4 className="mb-3">View Schedule</h4>
      {loading ? (
        <div className="d-flex justify-content-center">
          <CSpinner color="primary" />
        </div>
      ) : Object.keys(groupedTodos).length === 0 ? (
        <p className="text-center">Tidak ada data todo yang tersedia.</p>
      ) : (
        Object.entries(groupedTodos).map(([programName, todos]) => (
          <CCard className="mb-4" key={programName}>
            <CCardHeader className="text-white fw-bold" style={{ backgroundColor: '#4CAF50' }}>
              <strong>{programName}</strong>
            </CCardHeader>
            <CCardBody>
              {todos.map((program) => (
                <div key={program.firebaseId} className="mb-4 border-bottom pb-3">
                  <CRow className="align-items-center mb-2">
                    <CCol md={9}>
                      <p className="mb-1 text-muted">
                        <strong>Keyword:</strong> {program.keyword}
                      </p>
                      <p className="mb-1">
                        <strong>Minggu ke-{program.weekNumber}</strong> – program dari tanggal{' '}
                        <strong>{formatTanggalIndo(program.startDate)}</strong> sampai{' '}
                        <strong>{formatTanggalIndo(program.endDate)}</strong>
                      </p>
                    </CCol>
                    <CCol md={3} className="text-end">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '6px',
                        }}
                      >
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => toggleDetail(program.firebaseId)}
                        >
                          {openDetails[program.firebaseId] ? 'Sembunyikan' : 'Detail'}
                        </CButton>
                        <CButton
                          size="sm"
                          color="success"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `http://localhost:8000/export-todo/${userId}/${program.firebaseId}`,
                              '_blank',
                            )
                          }
                        >
                          Export PDF
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>

                  <CCollapse visible={openDetails[program.firebaseId]}>
                    <div className="table-responsive mt-3">
                      <table className="table table-bordered table-striped mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Hari</th>
                            <th>Tanggal</th>
                            <th>Tugas</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {program.days.map((dayItem, index) => (
                            <tr key={`${program.firebaseId}-${index}`}>
                              <td>{dayItem.day}</td>
                              <td>{formatTanggalIndo(dayItem.date)}</td>
                              <td>{dayItem.task}</td>
                              <td>
                                <CBadge
                                  color={
                                    dayItem.status.toLowerCase() === 'selesai'
                                      ? 'success'
                                      : dayItem.status.toLowerCase() === 'proses'
                                        ? 'warning'
                                        : 'secondary'
                                  }
                                >
                                  {dayItem.status}
                                </CBadge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CCollapse>
                </div>
              ))}
            </CCardBody>
          </CCard>
        ))
      )}
    </div>
  )
}

export default ManageTodo
