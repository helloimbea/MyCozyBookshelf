import { useNavigate } from 'react-router'
import hangingPlant from '../assets/hanging-plant.png'
import { BookForm } from '../components/BookForm'
import { useI18n } from '../i18n/context'
import * as api from '../services/api'

export function AddBook() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <section className="page">
      <img src={hangingPlant} alt="" className="plant plant--hanging-left" />
      <div className="page-head">
        <div>
          <h1>{t.addBook.title}</h1>
          <p>{t.addBook.subtitle}</p>
        </div>
      </div>
      <div className="card">
        <BookForm
          withReflection
          withSearch
          submitLabel={t.addBook.submit}
          onSubmit={async (input, reflection) => {
            const book = await api.createBook(input, reflection)
            navigate('/shelf', { state: { added: book.id } })
          }}
          onCancel={() => navigate(-1)}
        />
      </div>
    </section>
  )
}
