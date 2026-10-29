# 🍊 제주 IP 라운지

돌하르방 · 한라봉 · 해녀 등 제주의 상징을 사진과 캐릭터 IP로 소개하는 사이트.

- **Vite + React** (react-router)
- **Supabase** 이메일 회원가입 / 로그인 / 로그아웃, 로그인한 사용자의 사진 즐겨찾기(RLS)
- **Pixabay API** 사진 (서버리스 함수 `/api/pixabay` 로 키를 숨김)
- **Vercel** 배포

## 폴더 구조

```
api/pixabay.js          Vercel 서버리스 함수 (Pixabay 프록시, 키는 서버에만)
supabase/schema.sql     favorites 테이블 + RLS 정책
src/context/            AuthContext(회원/로그인), FavoritesContext(즐겨찾기)
src/pages/              Home, Gallery, Characters, Login, Signup, MyPage
```

## 환경변수 한눈에 보기

| 이름 | 어디서 얻나 | 브라우저 노출 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase > Project Settings > API > Project URL | 노출됨 (정상) |
| `VITE_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > `anon` `public` key | 노출됨 (정상, RLS 로 보호) |
| `PIXABAY_API_KEY` | pixabay.com 로그인 후 https://pixabay.com/api/docs/ | **노출 안 됨** (서버 전용) |

> ⚠️ `service_role` 키는 절대 사용/등록하지 마세요. `.env` 는 `.gitignore` 로 커밋되지 않습니다.

## 1단계. Supabase 준비

1. https://supabase.com 에서 로그인 → **New project** 생성 (리전은 `Northeast Asia (Seoul)` 권장).
2. **Project Settings → API** 에서 `Project URL` 과 `anon public` 키를 복사해 둡니다.
3. **SQL Editor → New query** 에 `supabase/schema.sql` 전체를 붙여넣고 **Run** (즐겨찾기 테이블 생성).
4. **Authentication → Providers → Email** 확인
   - 개발 중에 바로 로그인하고 싶으면 **Confirm email** 을 끄세요.
   - 켜 두면 가입 후 메일 인증을 해야 로그인됩니다. (무료 플랜은 메일 발송 횟수 제한이 있어요.)

## 2단계. Pixabay 키

1. https://pixabay.com 에 가입/로그인.
2. https://pixabay.com/api/docs/ 페이지에 표시되는 **API key** 를 복사합니다.

## 3단계. 로컬 실행

```bash
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
# .env 를 열어 위에서 복사한 3개 값을 채웁니다
npm run dev               # http://localhost:5173
```

개발 서버에서도 `/api/pixabay` 가 동작하도록 `vite.config.js` 에 연결해 두었어요.

## 4단계. GitHub 에 올리기

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<내계정>/<저장소이름>.git
git push -u origin main
```

## 5단계. Vercel 배포

1. https://vercel.com 로그인 → **Add New → Project** → 방금 올린 GitHub 저장소 **Import**.
2. Framework Preset 은 **Vite** 로 자동 인식됩니다. (Build: `npm run build`, Output: `dist`)
3. **Environment Variables** 에 아래 3개를 등록합니다 (Production / Preview / Development 모두 체크).
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `PIXABAY_API_KEY`
4. **Deploy** 를 누릅니다. 환경변수를 나중에 바꾸면 **Redeploy** 해야 반영돼요.

## 6단계. 배포 주소를 Supabase 에 알려주기 (중요)

배포가 끝나 `https://내프로젝트.vercel.app` 주소가 생기면:

1. Supabase → **Authentication → URL Configuration**
2. **Site URL** 을 `https://내프로젝트.vercel.app` 로 변경
3. **Redirect URLs** 에 `https://내프로젝트.vercel.app/**` 와 `http://localhost:5173/**` 추가

이걸 안 하면 이메일 인증 링크가 `localhost` 로 연결돼요.

## 동작 확인 체크리스트

- [ ] 홈에서 제주 사진이 보인다 (안 보이면 `PIXABAY_API_KEY` 확인)
- [ ] 회원가입 → (인증 메일 클릭) → 로그인된다
- [ ] 갤러리에서 ♡ 를 누르면 마이페이지에 저장된다
- [ ] 로그아웃 후 `/mypage` 에 접근하면 로그인 화면으로 이동한다

## 사진 사용 안내

Pixabay 사진은 Pixabay 라이선스를 따릅니다. 이 사이트는 사진 출처와 촬영자를 함께 표시합니다.
Pixabay 이용 약관상 서비스 규모가 커지면 이미지를 직접 내려받아 자체 호스팅하는 것을 권장합니다.
