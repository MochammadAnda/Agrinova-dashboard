// src/views/TodoGenerator.jsx (versi lengkap, dengan fallback parsing dan render baik array maupun object)
import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CAlert,
  CCol,
} from '@coreui/react'
import axiosInstance from '../core/axiosInstance'

const TodoGenerator = () => {
  // ------------------- STATE FORM -------------------
  const [plant, setPlant] = useState('')
  const [media, setMedia] = useState('')
  const [size, setSize] = useState('')
  const [unit, setUnit] = useState('m2')
  const [timeMode, setTimeMode] = useState('days') // days | dates
  const [daysCount, setDaysCount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // ------------------- STATE RESPONSE -------------------
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ------------------- HANDLERS -------------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    // validasi tanggal
    if (timeMode === 'dates' && startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('Tanggal selesai harus sesudah tanggal mulai.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const timePart =
      timeMode === 'days'
        ? `Rentang waktu: ${daysCount} hari`
        : `Rentang tanggal: ${startDate} hingga ${endDate}`

    const question = `Tanaman: ${plant}, Media tanam: ${media}, Luas: ${size} ${unit}, ` + timePart

    try {
      const res = await axiosInstance.post('/api/ai-query', {
        question,
        mode: 'todo_generator',
        save: true,
      })

      let data = res.data.answer
      // ---------- Fallback parsing jika masih berupa string ---------
      if (typeof data === 'string') {
        let cleaned = data.replace(/```json|```/gi, '').trim()
        // ubah single quote ke double agar JSON valid
        cleaned = cleaned.replace(/'([^']*)'\s*:/g, '"$1":').replace(/:\s*'([^']*)'/g, ':"$1"')
        try {
          data = JSON.parse(cleaned)
        } catch (_) {
          /* biarkan tetap string jika gagal parse */
        }
      }

      setResult(data)
    } catch (err) {
      setError('Gagal membuat jadwal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // ------------------- RENDER -------------------
  return (
    <CCard className="p-4 shadow-sm">
      <CCardBody>
        <h4 className="fw-bold mb-3">Todo Generator</h4>

        {/* FORM INPUT */}
        <CForm className="row g-3" onSubmit={handleSubmit}>
          <CCol md={4}>
            <CFormLabel>Jenis Tanaman</CFormLabel>
            <CFormInput value={plant} onChange={(e) => setPlant(e.target.value)} required />
          </CCol>

          <CCol md={4}>
            <CFormLabel>Media Tanam</CFormLabel>
            <CFormInput value={media} onChange={(e) => setMedia(e.target.value)} required />
          </CCol>

          <CCol md={2}>
            <CFormLabel>Luas / Jumlah</CFormLabel>
            <CFormInput
              type="number"
              min="0"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </CCol>

          <CCol md={2}>
            <CFormLabel>Satuan</CFormLabel>
            <CFormSelect value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="ha">hektar</option>
              <option value="m2">m²</option>
              <option value="pot">pot</option>
              <option value="polybag">polybag</option>
            </CFormSelect>
          </CCol>

          <CCol md={3}>
            <CFormLabel>Jenis Rentang Waktu</CFormLabel>
            <CFormSelect value={timeMode} onChange={(e) => setTimeMode(e.target.value)}>
              <option value="days">Durasi (hari)</option>
              <option value="dates">Rentang Tanggal</option>
            </CFormSelect>
          </CCol>

          {timeMode === 'days' ? (
            <CCol md={3}>
              <CFormLabel>Durasi (hari)</CFormLabel>
              <CFormInput
                type="number"
                min="1"
                value={daysCount}
                onChange={(e) => setDaysCount(e.target.value)}
                required
              />
            </CCol>
          ) : (
            <>
              <CCol md={3}>
                <CFormLabel>Tanggal Mulai</CFormLabel>
                <CFormInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel>Tanggal Selesai</CFormLabel>
                <CFormInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </CCol>
            </>
          )}

          <CCol xs={12}>
            <CButton type="submit" color="success" disabled={loading}>
              {loading ? 'Membuat…' : 'Buat Jadwal'}
            </CButton>
          </CCol>
        </CForm>

        {/* ERROR */}
        {error && (
          <CAlert color="danger" className="mt-4">
            {error}
          </CAlert>
        )}

        {/* HASIL */}
        {result && (
          <div className="mt-4">
            <h5 className="fw-semibold mb-3">Hasil Jadwal</h5>

            <ul className="list-group">
              {Array.isArray(result) &&
                result.map((item, idx) => {
                  // Jika item adalah string seperti "Senin: Deskripsi"
                  if (typeof item === 'string') {
                    const [day, ...descParts] = item.split(':')
                    const desc = descParts.join(':').trim()
                    return (
                      <li key={idx} className="list-group-item">
                        <strong>{day.trim()}:</strong> {desc}
                      </li>
                    )
                  }

                  // Jika item adalah object seperti { "0": "Deskripsi" }
                  if (typeof item === 'object') {
                    const [day, desc] = Object.entries(item)[0]
                    return (
                      <li key={idx} className="list-group-item">
                        <strong>Hari {day}:</strong> {desc}
                      </li>
                    )
                  }

                  return null
                })}

              {/* Jika result langsung berupa object map */}
              {!Array.isArray(result) &&
                typeof result === 'object' &&
                Object.entries(result)
                  .sort(([a], [b]) => a - b)
                  .map(([day, desc]) => (
                    <li key={day} className="list-group-item">
                      <strong>Hari {day}:</strong> {desc}
                    </li>
                  ))}
            </ul>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default TodoGenerator
