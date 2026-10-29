import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SetupNotice from '../components/SetupNotice.jsx';

function toKorean(message) {
  if (/Invalid login credentials/i.test(message)) return '이메일 또는 비밀번호가 올바르지 않아요.';
  if (/Email not confirmed/i.test(message)) return '이메일 인증이 아직 안 됐어요. 메일함의 인증 링크를 눌러 주세요.';
  return message;
}

export default function Login() {
  const { user, signIn, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/mypage';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await signIn(form.email.trim(), form.password);
    setBusy(false);
    if (err) setError(toKorean(err.message));
    else navigate(from, { replace: true });
  };

  return (
    <div className="container auth">
      <h1>로그인</h1>
      {!configured && <SetupNotice />}
      <form onSubmit={onSubmit} className="form">
        <label>
          이메일
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-lg" disabled={busy || !configured}>
          {busy ? '로그인 중…' : '로그인'}
        </button>
      </form>
      <p className="muted">
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}
