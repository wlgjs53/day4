import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

// 사진 목록 + 하트(즐겨찾기) + 크게 보기
export default function PhotoGrid({ photos }) {
  const { user, configured } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const onHeart = async (e, photo) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: '/gallery' } });
      return;
    }
    await toggle(photo);
  };

  return (
    <>
      <div className="grid">
        {photos.map((p) => (
          <figure className="photo" key={p.id} onClick={() => setSelected(p)}>
            <img src={p.preview} alt={p.tags} loading="lazy" />
            {configured && (
              <button
                className={`heart ${isFavorite(p.id) ? 'on' : ''}`}
                onClick={(e) => onHeart(e, p)}
                aria-label={isFavorite(p.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                {isFavorite(p.id) ? '♥' : '♡'}
              </button>
            )}
            <figcaption>
              <span>{p.tags}</span>
              <small>by {p.user}</small>
            </figcaption>
          </figure>
        ))}
      </div>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
            <img src={selected.large} alt={selected.tags} />
            <p>
              {selected.tags} · by{' '}
              <a href={selected.pageURL} target="_blank" rel="noreferrer">
                {selected.user} (Pixabay)
              </a>
            </p>
            <button className="btn btn-ghost" onClick={() => setSelected(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
