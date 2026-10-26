import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AddBook } from './pages/AddBook'
import { BookDetail } from './pages/BookDetail'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Shelf } from './pages/Shelf'
import { Signup } from './pages/Signup'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/estante" element={<RequireAuth><Shelf /></RequireAuth>} />
          <Route path="/adicionar" element={<RequireAuth><AddBook /></RequireAuth>} />
          <Route path="/livro/:id" element={<RequireAuth><BookDetail /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
