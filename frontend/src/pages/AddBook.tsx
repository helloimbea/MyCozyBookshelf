import { useNavigate } from 'react-router'
import plantar from '../assets/plantar.png'
import { BookForm } from '../components/BookForm'
import * as api from '../services/api'

export function AddBook() {
  const navigate = useNavigate()

  return (
    <section className="page">
      <img src={plantar} alt="" className="plant plant--hanging-left" />
      <div className="page-head">
        <div>
          <h1>adicionar livro</h1>
          <p>só o título é obrigatório, o resto pode vir depois.</p>
        </div>
      </div>
      <div className="card">
        <BookForm
          withReflection
          withSearch
          submitLabel="colocar na estante"
          onSubmit={async (input, reflection) => {
            const book = await api.createBook(input, reflection)
            navigate('/estante', { state: { added: book.id } })
          }}
          onCancel={() => navigate(-1)}
        />
      </div>
    </section>
  )
}
