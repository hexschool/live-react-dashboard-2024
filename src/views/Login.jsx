import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * 登入行為
   * @param {*} data - 表單資料
   * @param { string } data.username - 使用者名稱
   * @param { string } data.password - 使用者密碼
   */
  const onSubmit = async (data) => {
    try {
      dispatch(showLoading());
      const api = '/admin/signin';
      const response = await axios.post(api, data);

      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      dispatch(createAsyncMessage(response.data));

      navigate('/admin/products');
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container pt-5 position-relative">
      <form className="row justify-content-center" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-md-6">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="mb-2">
            <label htmlFor="username" className="sr-only">Email address</label>
            <input
              type="email"
              id="username"
              placeholder="Email address"
              required
              {...register('username', { required: true })}
              className={`form-control ${errors.username && 'is-invalid'}`}
            />
            <div id="validationServerUsernameFeedback" className="invalid-feedback">
              請輸入 Email。
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              {...register('password', { required: true })}
              className={`form-control ${errors.password && 'is-invalid'}`}
            />
            <div id="validationServerUsernameFeedback" className="invalid-feedback">
              請輸入密碼。
            </div>

          </div>
          <div className="text-end mt-4">
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              登入
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
