import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const name = user?.user_metadata?.name || user?.email?.split('@')[0];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          🍊 제주 IP 라운지
        </Link>
        <nav className="nav">
          <NavLink to="/gallery">갤러리</NavLink>
          <NavLink to="/characters">제주 캐릭터</NavLink>
          <NavLink to="/shop">상점</NavLink>
          <NavLink to="/cart" className="cart-link">
            🛒{count > 0 && <span className="badge">{count}</span>}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/mypage">{name}님</NavLink>
              <button className="btn btn-ghost" onClick={handleSignOut}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <Link to="/signup" className="btn">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
