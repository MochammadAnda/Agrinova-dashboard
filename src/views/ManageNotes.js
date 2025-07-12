// src/views/ManageNotes.jsx
import React, { useEffect, useState, useRef } from 'react'
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
import '../scss/style.scss'

const ManageNotes = () => {
  /* ───────── State ───────── */
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ id: null, title: '', content: '' })
  const [originalNote, setOriginalNote] = useState(null)

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const Toast = useToast()
  const inputRef = useRef(null)

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

  /* Autofocus ketika modal terbuka */
  useEffect(() => {
    if (modalVisible) setTimeout(() => inputRef.current?.focus(), 100)
  }, [modalVisible])

  /* ───────── Handlers ───────── */
  const openAddModal = () => {
    setIsEditing(false)
    setOriginalNote(null)
    setFormData({ id: null, title: '', content: '' })
    setModalVisible(true)
  }

  const openEditModal = (note) => {
    setIsEditing(true)
    setOriginalNote(note)
    setFormData(note)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setFormData({ id: null, title: '', content: '' })
    setOriginalNote(null)
  }

  const handleCloseModal = () => {
    // Konfirmasi jika data belum disimpan
    if (
      (formData.title || formData.content) &&
      (formData.title !== originalNote?.title || formData.content !== originalNote?.content)
    ) {
      if (!window.confirm('Catatan belum disimpan, tutup tanpa menyimpan?')) return
    }
    closeModal()
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
      closeModal()
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

  const formatIndoDateTime = (isoDateStr) => {
    const date = new Date(isoDateStr)

    const tanggal = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'long',
    }).format(date)

    const jam = date.getHours().toString().padStart(2, '0')
    const menit = date.getMinutes().toString().padStart(2, '0')

    return `${tanggal} pukul ${jam}:${menit} WIB`
  }

  /* ───────── Derived State ───────── */
  const isFormChanged = isEditing
    ? formData.title !== originalNote?.title || formData.content !== originalNote?.content
    : formData.title || formData.content

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
              <CCard className="shadow-sm h-100 card-note">
                <CCardHeader className="fw-bold">{note.title}</CCardHeader>
                <CCardBody className="d-flex flex-column">
                  <p style={{ whiteSpace: 'pre-line', flexGrow: 1 }}>{note.content}</p>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <div className="mt-auto">
                      <small className="text-muted d-block">
                        Dibuat: {formatIndoDateTime(note.created_at)}
                      </small>
                      <small className="text-muted d-block">
                        Diperbarui: {formatIndoDateTime(note.updated_at)}
                      </small>
                    </div>
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
      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Edit Catatan' : 'Tambah Catatan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Judul"
            placeholder="Judul catatan"
            className="mb-3"
            maxLength={255}
            value={formData.title}
            ref={inputRef}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <CFormTextarea
            label="Isi Catatan"
            rows={6}
            placeholder="Tulis isi catatan…"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Batal
          </CButton>
          <CButton
            color="primary"
            onClick={handleSave}
            disabled={!formData.title || !formData.content || !isFormChanged}
          >
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
