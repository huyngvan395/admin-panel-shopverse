"use client"

import type React from "react"

import { Outlet } from "react-router-dom"
import { Navbar } from "../common/Navbar"
import { Sidebar } from "../common/Sidebar"
import { Toaster } from "sonner"
import { useState } from "react"

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background W-full">
      <Sidebar open={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="overflow-auto p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default MainLayout
