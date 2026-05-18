import { useEffect, useState } from 'react'
import AppCard from '../../components/AppCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { getAdminUsers } from '../../services/adminApi.js'

function AdminUsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getAdminUsers().then((response) => setUsers(response.data.users)).catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppCard>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Admin users</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900">Akun user biasa.</h1>
        <div className="mt-6">
          <AdminTable columns={[{ key: 'name', label: 'Nama' }, { key: 'email', label: 'Email' }, { key: 'address', label: 'Alamat', render: (row) => row.address?.address || '-' }, { key: 'district', label: 'Kecamatan', render: (row) => row.address?.district?.name || '-' }]} rows={users} emptyText="Belum ada user." />
        </div>
      </AppCard>
    </div>
  )
}

export default AdminUsersPage
