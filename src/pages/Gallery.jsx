import { useState } from 'react';
import { useImages } from '../lib/useImages.js';
import PhotoGrid from '../components/PhotoGrid.jsx';

const CATEGORIES = [
  { label: '제주 풍경', q: 'jeju island' },
  { label: '한라산', q: 'hallasan mountain' },
  { label: '성산일출봉', q: 'seongsan ilchulbong' },
  { label: '해변·바다', q: 'jeju beach' },
  { label: '유채꽃', q: 'canola flowers jeju' },
  { label: '한라봉·감귤', q: 'hallabong tangerine' },
];

export default function Gallery() {
  const [active, setActive] = useState(CATEGORIES[0]);
  const { photos, loading, error } = useImages(active.q, { perPage: 24 });

  return (
    <div className="container section">
      <h1>제주 갤러리</h1>
      <p className="muted">마음에 드는 사진에 ♡를 눌러 보세요. 로그인하면 마이페이지에 저장돼요.</p>

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button
            key={c.q}
            className={`chip ${c.q === active.q ? 'active' : ''}`}
            onClick={() => setActive(c)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="muted">사진을 불러오는 중…</p>}
      {error && <p className="notice">{error}</p>}
      {!loading && !error && photos.length === 0 && <p className="muted">검색 결과가 없어요.</p>}
      <PhotoGrid photos={photos} />
    </div>
  );
}
