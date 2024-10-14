import { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

import Navbar from '@/components/Navbar';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState(false);

  /**
   * 檢查是否登入
   * 1. 從 cookie 取得 token
   * 2. 設定 axios 的 headers
   * 3. 發送請求檢查是否登入
   * 4. 若登入成功，設定 status 為 true，並顯示內容
   */
  const checkLogin = useCallback(async () => {
    try {
      dispatch(showLoading());
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;

      const api = '/api/user/check';
      const response = await axios.post(api);

      dispatch(createAsyncMessage({ ...response.data, message: '登入成功' }));

      setStatus(true);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
      navigate('/login');
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch, navigate]);

  /**
   * 初始化
   */
  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <>
      <Navbar />
      {
        status && (
          <div className="container-fluid mt-3 position-relative">
            <Outlet />
          </div>
        )
      }
    </>
  );
}

export default Dashboard;
