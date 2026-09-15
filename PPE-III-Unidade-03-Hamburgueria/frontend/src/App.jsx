import Menu from './components/Menu';

export default function App() {
  return (
    <div className="page-shell">
      <nav className="topbar" aria-label="Navegação principal">
        <a className="brand" href="/"><span className="brand-mark">H</span><span>Honest<br />Burger</span></a>
        <span className="location"><span className="status-dot" /> Aberto agora · entrega em 25 min</span>
        <a className="nav-link" href="#menu-title">Cardápio <span aria-hidden="true">↘</span></a>
      </nav>
      <Menu />
      <footer className="footer">Feito para matar a fome <span>●</span> Unidade 03</footer>
    </div>
  );
}
