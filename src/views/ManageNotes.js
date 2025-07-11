// src/views/ManageNotes.jsx
import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormTextarea,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilNoteAdd, cilPencil, cilTrash } from '@coreui/icons'
import axiosInstance from '../core/axiosInstance'
import { useToast } from '../components/ToastManager'

const ManageNotes = () => {
  /* ───────── State ───────── */
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ id: null, title: '', content: '' })

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const Toast = useToast()

  /* ───────── Fetch Notes ───────── */
  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/api/notes')
      setNotes(res.data)
    } catch (err) {
      Toast.error('Gagal memuat catatan.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  /* ───────── Handlers ───────── */
  const openAddModal = () => {
    setIsEditing(false)
    setFormData({ id: null, title: '', content: '' })
    setModalVisible(true)
  }

  const openEditModal = (note) => {
    setIsEditing(true)
    setFormData(note)
    setModalVisible(true)
  }

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axiosInstance.put(`/api/notes/${formData.id}`, formData)
        Toast.success('Catatan berhasil diperbarui.')
      } else {
        await axiosInstance.post('/api/notes', formData)
        Toast.success('Catatan berhasil ditambahkan.')
      }
      setModalVisible(false)
      fetchNotes()
    } catch (err) {
      Toast.error('Gagal menyimpan catatan.')
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/notes/${deleteConfirm.id}`)
      Toast.success('Catatan berhasil dihapus.')
      setDeleteConfirm(null)
      fetchNotes()
    } catch (err) {
      Toast.error('Gagal menghapus catatan.')
      console.error(err)
    }
  }

  /* ───────── UI ───────── */
  return (
    <>
      {/* Tombol Tambah */}
      <div className="d-flex justify-content-end mb-3">
        <CButton color="primary" onClick={openAddModal}>
          <CIcon icon={cilNoteAdd} className="me-2" />
          Tambah Catatan
        </CButton>
      </div>

      {/* Grid Card */}
      {loading ? (
        <div className="text-center py-5">
          <CSpinner />
        </div>
      ) : (
        <CRow className="g-4">
          {notes.map((note) => (
            <CCol xs={12} md={6} lg={4} key={note.id}>
              <CCard className="shadow-sm h-100">
                <CCardHeader className="fw-bold">{note.title}</CCardHeader>
                <CCardBody className="d-flex flex-column">
                  <p style={{ whiteSpace: 'pre-line', flexGrow: 1 }}>{note.content}</p>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <CButton
                      color="info"
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(note)}
                    >
                      <CIcon icon={cilPencil} className="me-1" />
                      Edit
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirm(note)}
                    >
                      <CIcon icon={cilTrash} className="me-1" />
                      Hapus
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}

          {/* Jika belum ada catatan */}
          {notes.length === 0 && !loading && (
            <div className="text-center w-100 py-5 text-muted">Belum ada catatan.</div>
          )}
        </CRow>
      )}

      {/* ───────── Modal Tambah / Edit ───────── */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Edit Catatan' : 'Tambah Catatan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Judul"
            className="mb-3"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <CFormTextarea
            label="Isi Catatan"
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            {isEditing ? 'Update' : 'Simpan'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ───────── Modal Konfirmasi Hapus ───────── */}
      <CModal visible={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <CModalHeader>
          <CModalTitle>Hapus Catatan</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Apakah kamu yakin ingin menghapus catatan "<strong>{deleteConfirm?.title}</strong>"?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(null)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ManageNotes
