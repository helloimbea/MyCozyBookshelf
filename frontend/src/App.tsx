import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth'
import { DemoBanner } from './components/DemoBanner'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ScrollToTop } from './components/ScrollToTop'
import { AddBook } from './pages/AddBook'
import { BookDetail } from './pages/BookDetail'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Shelf } from './pages/Shelf'
import { Signup } from './pages/Signup'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <DemoBanner />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shelf" element={<RequireAuth><Shelf /></RequireAuth>} />
          <Route path="/add" element={<RequireAuth><AddBook /></RequireAuth>} />
          <Route path="/book/:id" element={<RequireAuth><BookDetail /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
