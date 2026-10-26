import camaleao from '../assets/camaleao.png'
import './Footer.css'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={camaleao} alt="" className="footer__logo" />
          <span>my cozy bookshelf</span>
        </div>
        <p className="footer__note">um cantinho pra guardar o que os livros deixaram em você.</p>
        <p className="footer__copy">© {YEAR}</p>
      </div>
    </footer>
  )
}
