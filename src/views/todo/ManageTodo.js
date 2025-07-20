import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CSpinner, CBadge } from '@coreui/react'
import axiosInstance from '../../core/axiosInstance'

const ManageTodo = () => {
  const [groupedTodos, setGroupedTodos] = useState({})
  const [loading, setLoading] = useState(true)

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

            const days = Object.entries(responseObject).map(([dayKey, dayDetail]) => ({
              day: dayKey,
              date: dayDetail?.date || '-',
              task: dayDetail?.task || '-',
              status: dayDetail?.status || '-',
            }))

            grouped[firebaseId] = {
              firebaseId,
              programName,
              keyword,
              days,
            }
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

  return (
    <div>
      <h4 className="mb-3">Manage Todo (Grid View)</h4>
      {loading ? (
        <div className="d-flex justify-content-center">
          <CSpinner color="primary" />
        </div>
      ) : Object.keys(groupedTodos).length === 0 ? (
        <p className="text-center">Tidak ada data todo yang tersedia.</p>
      ) : (
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 3 }} className="g-4">
          {Object.values(groupedTodos).map((program) => (
            <CCol key={program.firebaseId}>
              <CCard className="h-100">
                <CCardHeader className="fw-bold">
                  {program.programName}
                  <br />
                  <small className="text-muted">Keyword: {program.keyword}</small>
                </CCardHeader>
                <CCardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {program.days.map((dayItem, index) => (
                    <div key={index} className="mb-3 border-bottom pb-2">
                      <strong>{dayItem.day}</strong> <br />
                      <span className="text-muted">{dayItem.date}</span> <br />
                      <div className="text-dark">{dayItem.task}</div>
                      <CBadge
                        color={
                          dayItem.status.toLowerCase() === 'selesai'
                            ? 'success'
                            : dayItem.status.toLowerCase() === 'proses'
                              ? 'warning'
                              : 'secondary'
                        }
                        className="mt-1"
                      >
                        {dayItem.status}
                      </CBadge>
                    </div>
                  ))}
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </div>
  )
}

export default ManageTodo
