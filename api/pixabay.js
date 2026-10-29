// Vercel 서버리스 함수: Pixabay 검색 프록시
// - API 키(PIXABAY_API_KEY)를 서버에만 두어 브라우저로 노출되지 않게 합니다.
// - 응답을 CDN에 캐시해서 Pixabay 호출 횟수(분당 제한)를 아낍니다.
export default async function handler(req, res) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) {
    return res
      .status(500)
      .json({ error: 'PIXABAY_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const query = req.query || {};
  const q = String(query.q || 'jeju island').slice(0, 100);
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const perPage = Math.min(40, Math.max(3, parseInt(query.per_page, 10) || 24));

  const url = new URL('https://pixabay.com/api/');
  url.search = new URLSearchParams({
    key,
    q,
    page: String(page),
    per_page: String(perPage),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    order: 'popular',
  }).toString();

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: `Pixabay 응답 오류 (${r.status})` });
    }
    const data = await r.json();
    const hits = (data.hits || []).map((h) => ({
      id: h.id,
      tags: h.tags,
      preview: h.webformatURL,
      large: h.largeImageURL,
      width: h.webformatWidth,
      height: h.webformatHeight,
      user: h.user,
      pageURL: h.pageURL,
    }));
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ total: data.totalHits || 0, hits });
  } catch (e) {
    return res.status(502).json({ error: 'Pixabay 요청에 실패했습니다.' });
  }
}
