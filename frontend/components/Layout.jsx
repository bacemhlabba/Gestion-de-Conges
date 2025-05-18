"use client"
import Head from "next/head"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { useAuth } from "../contexts/AuthContext"
import { Toaster } from "react-hot-toast"

const Layout = ({ children, title = "Gestion de Congés" }) => {
  const { user } = useAuth()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Application de gestion de congés" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex">
          {user && <Sidebar />}

          <main className="flex-1 p-6">{children}</main>
        </div>

        <Toaster position="top-right" />
      </div>
    </>
  )
}

export default Layout
