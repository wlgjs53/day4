import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const FavoritesContext = createContext(null);

// 즐겨찾기(하트): favorites 테이블 + RLS (supabase/schema.sql)
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setItems([]);
      return;
    }
    const { data, error: err } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError('즐겨찾기를 불러오지 못했습니다. supabase/schema.sql 을 실행했는지 확인하세요.');
    } else {
      setError('');
      setItems(data);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const isFavorite = (imageId) => items.some((f) => f.image_id === imageId);

  // 반환값: true 성공 / false 실패
  const toggle = async (img) => {
    if (!supabase || !user) return false;
    if (isFavorite(img.id)) {
      const { error: err } = await supabase.from('favorites').delete().eq('image_id', img.id);
      if (err) {
        setError(err.message);
        return false;
      }
      setItems((cur) => cur.filter((f) => f.image_id !== img.id));
    } else {
      const { data, error: err } = await supabase
        .from('favorites')
        .insert({
          image_id: img.id,
          preview_url: img.preview,
          large_url: img.large,
          tags: img.tags,
          photographer: img.user,
          page_url: img.pageURL,
        })
        .select()
        .single();
      if (err) {
        setError(err.message);
        return false;
      }
      setItems((cur) => [data, ...cur]);
    }
    return true;
  };

  return (
    <FavoritesContext.Provider value={{ items, error, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
