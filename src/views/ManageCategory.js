import { CButton, CCard, CCardBody } from '@coreui/react'
import { PaginatedTable } from '../components'
import React, { useState } from 'react'
import CategoryModal from '../components/modals/CategoryModal'
import axiosInstance from '../core/axiosInstance'
import { useLocation } from 'react-router-dom'

const ManageCategory = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editId, setEditId] = useState(null)
  const [reload, setReload] = useState(false)

  const handleAdd = () => {
    setEditId(null)
    setModalVisible(true)
  }

  const location = useLocation()

  const getPageFromUrl = () => {
    const params = new URLSearchParams(location.search)
    const page = parseInt(params.get('page')) || 1
    return page
  }

  const handleEdit = (id) => {
    setEditId(id)
    setModalVisible(true)
  }

  const handleSuccess = (messageSuccess) => {
    setModalVisible(false)
    setEditId(null)
    console.log(messageSuccess)
    setReload((prev) => !prev)
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item) => (
        <CButton size="sm" color="warning" onClick={() => handleEdit(item.id)}>
          Edit
        </CButton>
      ),
    },
  ]

  const endpoint = '/dashboard/manage-category/'

  return (
    <>
      <CCard className="mb-4 p-4">
        <CCardBody className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Manage Category</h4>
            <CButton color="primary" className="p-2 px-3 fw-medium" onClick={handleAdd}>
              Tambah Category
            </CButton>
          </div>

          <PaginatedTable columns={columns} endpoint={endpoint} reload={reload} />
        </CCardBody>
      </CCard>

      <CategoryModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditId(null)
        }}
        mode={editId ? 'edit' : 'store'}
        id={editId}
        onSuccess={() =>
          handleSuccess(editId ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan')
        }
      />
    </>
  )
}

export default ManageCategory
