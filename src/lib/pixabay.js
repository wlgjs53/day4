// 서버리스 함수(/api/pixabay)를 통해 Pixabay 사진을 가져옵니다.
export async function searchImages(q, { page = 1, perPage = 24 } = {}) {
  const params = new URLSearchParams({ q, page: String(page), per_page: String(perPage) });
  const res = await fetch(`/api/pixabay?${params}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '사진을 불러오지 못했습니다.');
  return data; // { total, hits: [{ id, tags, preview, large, user, pageURL }] }
}
