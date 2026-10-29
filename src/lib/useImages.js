import { useEffect, useState } from 'react';
import { searchImages } from './pixabay.js';

// 검색어가 바뀔 때마다 Pixabay 사진을 불러오는 훅
export function useImages(q, { perPage = 24 } = {}) {
  const [state, setState] = useState({ photos: [], loading: true, error: '' });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: '' }));
    searchImages(q, { perPage })
      .then((data) => !cancelled && setState({ photos: data.hits, loading: false, error: '' }))
      .catch((e) => !cancelled && setState({ photos: [], loading: false, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [q, perPage]);

  return state;
}
