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
        <span>NS / CAL</span>
        <span className="footer-bar" />
        <span>0001</span>
        <span className="footer-bar" />
        <span>{year}</span>
      </div>
    </footer>
  )
}
