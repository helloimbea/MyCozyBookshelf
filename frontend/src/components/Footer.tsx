import chameleon from '../assets/chameleon.png'
import { useI18n } from '../i18n/context'
import './Footer.css'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={chameleon} alt="" className="footer__logo" />
          <span>my cozy bookshelf</span>
        </div>
        <p className="footer__note">{t.footer.motto}</p>
        <p className="footer__copy">© {YEAR}</p>
      </div>
    </footer>
  )
}
