import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { won } from '../lib/format.js';

export default function Cart() {
  const { items, total, count, error, setQuantity, remove, clear } = useCart();

  return (
    <div className="container section">
      <h1>장바구니 🛒</h1>
      {error && <p className="notice">{error}</p>}

      {items.length === 0 ? (
        <p className="muted">
          장바구니가 비어 있어요. <Link to="/shop">상점</Link>에서 상품을 담아 보세요.
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((i) => (
              <li className="cart-row" key={i.id}>
                <div className="cart-thumb">
                  {i.product.image_url ? <img src={i.product.image_url} alt="" /> : <span>{i.product.emoji}</span>}
                </div>
                <div className="cart-info">
                  <strong>{i.product.name}</strong>
                  <span className="muted">{won(i.product.price)}</span>
                </div>
                <div className="qty">
                  <button onClick={() => setQuantity(i.product_id, i.quantity - 1)} aria-label="수량 줄이기">
                    −
                  </button>
                  <span>{i.quantity}</span>
                  <button onClick={() => setQuantity(i.product_id, i.quantity + 1)} aria-label="수량 늘리기">
                    +
                  </button>
                </div>
                <strong className="line-total">{won(i.quantity * i.product.price)}</strong>
                <button className="btn btn-ghost" onClick={() => remove(i.product_id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div>
              총 <strong>{count}</strong>개
            </div>
            <div className="cart-total">
              합계 <strong>{won(total)}</strong>
            </div>
            <div className="cart-actions">
              <button className="btn btn-ghost" onClick={clear}>
                비우기
              </button>
              <button className="btn btn-lg" disabled title="결제 기능은 준비 중이에요">
                주문하기 (준비 중)
              </button>
            </div>
          </div>
          <p className="muted">※ 결제 기능은 아직 없어요. 지금은 장바구니 담기까지만 동작해요.</p>
        </>
      )}
    </div>
  );
}
