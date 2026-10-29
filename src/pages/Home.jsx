import { Link } from 'react-router-dom';
import { useImages } from '../lib/useImages.js';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  { icon: '🗿', title: '돌하르방', text: '제주를 지키는 돌 할아버지. 큰 눈과 벙거지가 트레이드마크예요.' },
  { icon: '🍊', title: '한라봉', text: '꼭지가 볼록한 제주 대표 감귤. 상큼한 오렌지빛 마스코트 후보 1순위!' },
  { icon: '🌊', title: '해녀', text: '숨비소리와 함께 바다를 일구는 제주의 강인한 이야기.' },
];

export default function Home() {
  const { user } = useAuth();
  const { photos, loading, error } = useImages('jeju island', { perPage: 6 });
  const hero = photos[0];

  return (
    <>
      <section className="hero" style={hero ? { backgroundImage: `url(${hero.large})` } : undefined}>
        <div className="hero-overlay">
          <div className="container">
            <p className="eyebrow">JEJU IP LOUNGE</p>
            <h1>제주의 상징을 만나다</h1>
            <p className="lead">
              돌하르방 · 한라봉 · 해녀 · 조랑말 · 동백.
              <br />
              제주 IP 캐릭터와 아름다운 사진을 한곳에서 둘러보세요.
            </p>
            <div className="hero-actions">
              <Link to="/gallery" className="btn btn-lg">
                사진 둘러보기
              </Link>
              {!user && (
                <Link to="/signup" className="btn btn-lg btn-outline">
                  무료 회원가입
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>제주 IP 캐릭터</h2>
        <div className="cards">
          {FEATURES.map((f) => (
            <article className="card" key={f.title}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
        <p className="center">
          <Link to="/characters" className="link">
            캐릭터 더 보기 →
          </Link>
        </p>
      </section>

      <section className="container section">
        <h2>오늘의 제주</h2>
        {loading && <p className="muted">사진을 불러오는 중…</p>}
        {error && <p className="notice">{error}</p>}
        <div className="strip">
          {photos.slice(1).map((p) => (
            <img key={p.id} src={p.preview} alt={p.tags} loading="lazy" />
          ))}
        </div>
      </section>
    </>
  );
}
