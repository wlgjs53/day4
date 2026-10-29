import { useEffect, useState } from 'react';
import { won } from '../lib/format.js';

// "장바구니 담기"를 누르면 뜨는 창: 수량 선택 + 재확인
export default function AddToCartModal({ product, inCart, onConfirm, onClose }) {
  const MAX = Math.max(1, 99 - inCart);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const clamp = (n) => Math.min(MAX, Math.max(1, Number.isNaN(n) ? 1 : n));

  const confirm = async () => {
    setBusy(true);
    await onConfirm(qty);
    setBusy(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-emoji">{product.emoji}</span>
          <div>
            <strong>{product.name}</strong>
            <div className="muted">개당 {won(product.price)}</div>
          </div>
        </div>

        <label className="modal-label">수량을 선택해 주세요</label>
        <div className="qty qty-lg">
          <button type="button" onClick={() => setQty(clamp(qty - 1))} aria-label="수량 줄이기">
            −
          </button>
          <input
            type="number"
            min={1}
            max={MAX}
            value={qty}
            onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
          />
          <button type="button" onClick={() => setQty(clamp(qty + 1))} aria-label="수량 늘리기">
            +
          </button>
        </div>
        {inCart > 0 && <p className="muted small">이미 장바구니에 {inCart}개 담겨 있어요. (최대 99개)</p>}

        <div className="modal-total">
          합계 <strong>{won(product.price * qty)}</strong>
        </div>

        <p className="modal-confirm">
          <strong>{product.name}</strong> <strong>{qty}개</strong>를 장바구니에 담을까요?
        </p>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn" onClick={confirm} disabled={busy}>
            {busy ? '담는 중…' : `${qty}개 담기`}
          </button>
        </div>
      </div>
    </div>
  );
}
