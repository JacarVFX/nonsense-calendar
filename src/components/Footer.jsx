// Footer con statement de marca. Presencia constante del lema "sense in nonsense."

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-mark">Ø</span>
        <span className="footer-statement">sense in nonsense.</span>
      </div>
      <div className="footer-right">
        <a href="/contratos" className="footer-link" title="Editor de contratos">CONTRATOS</a>
        <span className="footer-bar" />
        <a href="/llave" className="footer-link" title="Llave 3D">LLAVE</a>
        <span className="footer-bar" />
        <span>NS / CAL · 0001 · {year}</span>
      </div>
    </footer>
  )
}
