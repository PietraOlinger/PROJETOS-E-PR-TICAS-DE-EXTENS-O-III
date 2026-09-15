import { useEffect, useState } from 'react';
import { loadMenu } from '../services/api.js';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadMenu().then(setItems).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando cardápio...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main>
      <section className="hero-section" aria-labelledby="menu-title">
        <div className="hero-copy">
          <p className="eyebrow">Hambúrguer sem conversa fiada</p>
          <h1>Grande sabor.<br /><em>Zero pose.</em></h1>
          <p className="hero-description">Carne na brasa, pão macio e combinações que fazem sentido. Seu próximo favorito está aqui.</p>
          <a className="hero-action" href="#menu-title">Ver o cardápio <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-badge" aria-hidden="true"><span>feito<br />na brasa</span><strong>100%</strong></div>
      </section>
      <section className="menu-section" aria-labelledby="menu-title">
        <div className="section-heading">
          <div><p className="eyebrow dark-eyebrow">Escolha seu lado</p><h2 id="menu-title" aria-label="Hamburgueria">O cardápio</h2></div>
          <div className="cart-pill" aria-live="polite"><span className="sr-only">Itens no carrinho: {cart.length}</span><span className="cart-icon">＋</span> {cart.length} {cart.length === 1 ? 'item' : 'itens'} no pedido</div>
        </div>
        {items.length === 0 && <p className="empty-state">Nenhum produto disponível.</p>}
        <div className="menu-grid">
          {items.map((item, index) => (
            <article className={`menu-item menu-item-${index + 1}`} key={item.id}>
              <div className="product-image" style={item.image ? { backgroundImage: `url(${item.image})` } : undefined} aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
              <div className="product-info">
                <div className="product-topline"><span className="product-tag">da casa</span><span className="product-price">R$ {item.price.toFixed(2).replace('.', ',')}</span></div>
                <h3>{item.name}</h3>
                <p>{item.description || 'Ingredientes frescos, molho especial e muito sabor em cada mordida.'}</p>
                <button type="button" onClick={() => setCart((current) => [...current, item])}>Adicionar {item.name} <span aria-hidden="true">＋</span></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
