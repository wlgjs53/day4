import { useImages } from '../lib/useImages.js';

// 제주 IP(지식재산) 캐릭터 후보들 — 이야기 + 대표 사진
const CHARACTERS = [
  {
    name: '돌하르방',
    emoji: '🗿',
    q: 'dol hareubang statue',
    tagline: '제주를 지키는 수호신',
    story:
      '현무암을 깎아 만든 제주의 돌 할아버지. 큰 눈, 뭉툭한 코, 벙거지가 특징이며 마을 어귀를 지켜 왔어요.',
    traits: ['수호', '든든함', '현무암'],
  },
  {
    name: '한라봉',
    emoji: '🍊',
    q: 'hallabong orange',
    tagline: '한라산을 닮은 달콤한 감귤',
    story: '꼭지가 한라산처럼 볼록 솟은 감귤. 상큼한 오렌지빛이 제주의 겨울을 밝혀 줘요.',
    traits: ['상큼함', '활기', '귤빛'],
  },
  {
    name: '해녀',
    emoji: '🌊',
    q: 'haenyeo jeju diver',
    tagline: '바다와 함께 사는 사람들',
    story: '숨 하나로 바다에 뛰어드는 제주 해녀. 유네스코 인류무형문화유산에 오른 삶의 지혜예요.',
    traits: ['강인함', '지혜', '바다'],
  },
  {
    name: '제주 조랑말',
    emoji: '🐴',
    q: 'jeju pony horse',
    tagline: '초원을 달리는 작은 거인',
    story: '키는 작지만 튼튼한 제주의 토종 말. 오름과 초원 풍경에 빠지지 않는 친구예요.',
    traits: ['자유', '튼튼함', '초원'],
  },
  {
    name: '동백',
    emoji: '🌺',
    q: 'camellia flower red',
    tagline: '겨울에 피는 붉은 꽃',
    story: '추운 겨울에도 붉게 피어나는 제주의 꽃. 떨어진 꽃송이까지 길을 물들여요.',
    traits: ['열정', '끈기', '붉은빛'],
  },
];

function CharacterCard({ c }) {
  const { photos } = useImages(c.q, { perPage: 3 });
  const photo = photos[0];
  return (
    <article className="char">
      <div className="char-media">
        {photo ? (
          <img src={photo.preview} alt={`${c.name} - ${photo.tags}`} loading="lazy" />
        ) : (
          <span className="char-emoji">{c.emoji}</span>
        )}
      </div>
      <div className="char-body">
        <h3>
          {c.emoji} {c.name}
        </h3>
        <p className="tagline">{c.tagline}</p>
        <p>{c.story}</p>
        <div className="tags">
          {c.traits.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        {photo && (
          <small className="muted">
            사진: {photo.user} /{' '}
            <a href={photo.pageURL} target="_blank" rel="noreferrer">
              Pixabay
            </a>
          </small>
        )}
      </div>
    </article>
  );
}

export default function Characters() {
  return (
    <div className="container section">
      <h1>제주 캐릭터 IP</h1>
      <p className="muted">제주의 이야기를 담은 상징들을 캐릭터 IP로 소개합니다.</p>
      <div className="char-list">
        {CHARACTERS.map((c) => (
          <CharacterCard key={c.name} c={c} />
        ))}
      </div>
    </div>
  );
}
