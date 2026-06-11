import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <main className="relative z-[2] flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
