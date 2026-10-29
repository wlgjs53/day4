import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

// 장바구니: cart_items 테이블 + RLS (supabase/shop.sql)
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // [{ id, product_id, quantity, product }]
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setItems([]);
      return;
    }
    const { data, error: err } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity, product:products(*)')
      .order('created_at', { ascending: true });
    if (err) {
      setError('장바구니를 불러오지 못했어요. supabase/shop.sql 을 실행했는지 확인하세요.');
    } else {
      setError('');
      setItems(data.filter((row) => row.product)); // 판매 중지된 상품은 제외
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // 수량 설정 (없으면 새로 담기, 0 이하이면 삭제)
  const setQuantity = async (productId, quantity) => {
    if (!supabase || !user) return false;
    const q = Math.min(99, quantity);
    if (q <= 0) {
      const { error: err } = await supabase.from('cart_items').delete().eq('product_id', productId);
      if (err) {
        setError(err.message);
        return false;
      }
    } else {
      const { error: err } = await supabase
        .from('cart_items')
        .upsert({ product_id: productId, quantity: q }, { onConflict: 'user_id,product_id' });
      if (err) {
        setError(err.message);
        return false;
      }
    }
    await load();
    return true;
  };

  // 이미 담긴 수량에 quantity 만큼 더합니다 (최대 99개)
  const add = (productId, quantity = 1) => {
    const current = items.find((i) => i.product_id === productId)?.quantity ?? 0;
    return setQuantity(productId, current + quantity);
  };

  const remove = (productId) => setQuantity(productId, 0);

  const clear = async () => {
    if (!supabase || !user) return;
    const { error: err } = await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (err) setError(err.message);
    else setItems([]);
  };

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
    }),
    [items],
  );

  return (
    <CartContext.Provider value={{ items, count, total, error, add, setQuantity, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
