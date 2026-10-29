import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function MyPage() {
  const { user } = useAuth();
  const { items, error, toggle } = useFavorites();
  const name = user.user_metadata?.name || user.email.split('@')[0];

  return (
    <div className="container section">
      <h1>{name}님의 마이페이지</h1>
      <p className="muted">
        {user.email} · 가입일 {new Date(user.created_at).toLocaleDateString('ko-KR')}
      </p>

      <h2>내가 저장한 제주 사진 ♥ {items.length}</h2>
      {error && <p className="notice">{error}</p>}
      {items.length === 0 && !error && (
        <p className="muted">
          아직 저장한 사진이 없어요. <Link to="/gallery">갤러리</Link>에서 ♡를 눌러 보세요.
        </p>
      )}
      <div className="grid">
        {items.map((f) => (
          <figure className="photo" key={f.id}>
            <img src={f.preview_url} alt={f.tags} loading="lazy" />
            <button
              className="heart on"
              onClick={() => toggle({ id: f.image_id })}
              aria-label="즐겨찾기 해제"
            >
              ♥
            </button>
            <figcaption>
              <span>{f.tags}</span>
              <small>
                by{' '}
                <a href={f.page_url} target="_blank" rel="noreferrer">
                  {f.photographer}
                </a>
              </small>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
