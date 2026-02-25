import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import TransactionModal from '../transactions/TransactionModal'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showModal, setShowModal]     = useState(false)

  return (
    <div className="flex h-screen bg-[#0b0f1a] text-slate-200 overflow-hidden font-sans">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar
          onAdd={() => setShowModal(true)}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <TransactionModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />

    </div>
  )
}