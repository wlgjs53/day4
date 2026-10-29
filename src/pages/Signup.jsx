import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SetupNotice from '../components/SetupNotice.jsx';

function toKorean(message) {
  if (/already registered/i.test(message)) return '이미 가입된 이메일이에요. 로그인해 주세요.';
  if (/at least 6/i.test(message)) return '비밀번호는 6자 이상이어야 해요.';
  if (/rate limit/i.test(message)) return '요청이 너무 많아요. 잠시 뒤에 다시 시도해 주세요.';
  return message;
}

export default function Signup() {
  const { user, signUp, configured } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/mypage" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('비밀번호는 6자 이상이어야 해요.');
    if (form.password !== form.confirm) return setError('비밀번호 확인이 일치하지 않아요.');
    setBusy(true);
    const { data, error: err } = await signUp(form.email.trim(), form.password, form.name.trim());
    setBusy(false);
    if (err) return setError(toKorean(err.message));
    // 이메일 인증을 켜 둔 경우 session 이 없고, 끈 경우 바로 로그인됩니다.
    if (!data.session) setDone(true);
  };

  if (done) {
    return (
      <div className="container auth">
        <h1>메일을 확인해 주세요 📬</h1>
        <p>
          <strong>{form.email}</strong> 로 인증 메일을 보냈어요. 메일의 링크를 누르면 가입이 완료돼요.
        </p>
        <Link to="/login" className="btn">
          로그인으로 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container auth">
      <h1>회원가입</h1>
      {!configured && <SetupNotice />}
      <form onSubmit={onSubmit} className="form">
        <label>
          이름(닉네임)
          <input
            required
            maxLength={20}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
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
          비밀번호 (6자 이상)
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label>
          비밀번호 확인
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-lg" disabled={busy || !configured}>
          {busy ? '가입 중…' : '가입하기'}
        </button>
      </form>
      <p className="muted">
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
