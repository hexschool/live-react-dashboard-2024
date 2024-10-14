import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * 登出行為
   * 1. 清除 cookie 並導向登入頁
   * 2. 移除 axios 的 Authorization header
   * 3. 顯示登出成功訊息
   */
  const logout = async () => {
    try {
      dispatch(showLoading());

      const api = '/logout';
      const response = await axios.post(api);

      document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      axios.defaults.headers.common.Authorization = '';

      dispatch(createAsyncMessage({ ...response.data, message: '登出成功' }));
      navigate('/login');
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink to="/admin/products" className="navbar-brand">香菇園</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink to="/admin/products" className="nav-link">產品</NavLink>
            <NavLink to="/admin/orders" className="nav-link">訂單</NavLink>
            <NavLink to="/admin/coupons" className="nav-link">優惠券</NavLink>
            <NavLink to="/admin/articles" className="nav-link">貼文</NavLink>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                logout();
              }}
              className="nav-link"
            >
              登出
            </button>
          </div>
          <div className="navbar-nav ms-auto">
            <NavLink to="/user/articles" className="nav-link">Blog</NavLink>
            <NavLink to="/user/cart" className="nav-link">購物車</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
