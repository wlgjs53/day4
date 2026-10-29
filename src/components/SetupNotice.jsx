// Supabase 환경변수가 없을 때 보여주는 안내 (앱이 깨지지 않게)
export default function SetupNotice() {
  return (
    <div className="notice">
      <strong>Supabase 설정이 필요해요.</strong>
      <p>
        <code>.env</code> 파일(또는 Vercel 환경변수)에 <code>VITE_SUPABASE_URL</code>,{' '}
        <code>VITE_SUPABASE_ANON_KEY</code> 를 등록한 뒤 다시 실행하세요. 자세한 절차는 README 를 참고하세요.
      </p>
    </div>
  );
}
