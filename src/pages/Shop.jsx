import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { won } from '../lib/format.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import SetupNotice from '../components/SetupNotice.jsx';

export default function Shop() {
  const { user, configured } = useAuth();
  const { items, add } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError('상품을 불러오지 못했어요. supabase/shop.sql 을 실행했는지 확인하세요.');
        else setProducts(data);
        setLoading(false);
      });
  }, []);

  const onAdd = async (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/shop' } });
      return;
    }
    const ok = await add(product.id);
    if (ok) {
      setToast(`"${product.name}" 을(를) 장바구니에 담았어요`);
      setTimeout(() => setToast(''), 2000);
    }
  };

  const inCart = (id) => items.find((i) => i.product_id === id)?.quantity ?? 0;

  return (
    <div className="container section">
      <h1>제주 상점</h1>
      <p className="muted">제주의 맛과 상징을 담은 상품이에요. (예시 상품입니다)</p>
      {!configured && <SetupNotice />}
      {loading && <p className="muted">상품을 불러오는 중…</p>}
      {error && <p className="notice">{error}</p>}

      <div className="products">
        {products.map((p) => (
          <article className="product" key={p.id}>
            <div className="product-media">
              {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span>{p.emoji}</span>}
            </div>
            <div className="product-body">
              <small className="muted">{p.category}</small>
              <h3>{p.name}</h3>
              <p className="muted">{p.description}</p>
              <div className="product-foot">
                <strong className="price">{won(p.price)}</strong>
                <button className="btn" onClick={() => onAdd(p)}>
                  {inCart(p.id) ? `담기 (+1, 현재 ${inCart(p.id)})` : '장바구니 담기'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {toast && (
        <div className="toast">
          {toast} · <Link to="/cart">장바구니 보기</Link>
        </div>
      )}
    </div>
  );
}
