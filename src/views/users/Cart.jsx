import { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

import {
  currency,
} from '@/utils/filters';

import Pagination from '@/components/Pagination';

function Cart() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(0);

  /**
   * 取得商品列表
   */
  const getProducts = useCallback(async () => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/products`;

      const response = await axios.get(url);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  /**
   * 取得購物車列表
   */
  const getCart = useCallback(async () => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/cart`;
      const response = await axios.get(url);

      setCart(response.data.data);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  /**
   * 初始化資料
   */
  useEffect(() => {
    getProducts();
    getCart();
  }, [getProducts, getCart]);

  /**
   * 加入購物車
   * @param {string} id 購物車 ID
   * @param {number} qty 產品數量
   */
  const addCart = async (id, qty = 1) => {
    try {
      setCartId(id);
      const url = `/api/${import.meta.env.VITE_PATH}/cart`;

      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(url, { data });

      dispatch(createAsyncMessage(response.data));
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setCartId(0);
    }
  };

  /**
   * 更新購物車
   * @param {string} id 購物車 ID
   * @param {string} qty 產品數量
   */
  const updateCart = async (id, qty = 1) => {
    try {
      dispatch(showLoading());

      const url = `/api/${import.meta.env.VITE_PATH}/cart/${id}`;

      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.put(url, { data });

      dispatch(createAsyncMessage(response.data));
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * 刪除購物車
   * @param {string} id 購物車 ID
   */
  const deleteCart = async (id) => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/cart/${id}`;

      const response = await axios.delete(url);

      dispatch(createAsyncMessage(response.data));
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * 刪除所有購物車
   */
  const deleteCartAll = async () => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/carts`;

      const response = await axios.delete(url);

      dispatch(createAsyncMessage(response.data));
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * 新增優惠碼
   * @param {string} code 優惠碼
   */
  const addCouponCode = async (code) => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/coupon`;

      const data = {
        code,
      };
      const response = await axios.post(url, { data });

      dispatch(createAsyncMessage(response.data));
      setCouponCode('');
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * 送出訂單
   * @param {object} data 訂單資料
   */
  const onSubmit = async (data) => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/order`;
      const response = await axios.post(url, { data });

      dispatch(createAsyncMessage(response.data));
      navigate(`/user/checkout/${response.data.orderId}`);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container">
      <div className="mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>功能</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map((product) => (
                <tr key={product.id}>
                  <td style={{ width: '200px' }}>
                    <div
                      style={{
                        height: '100px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${product.imageUrl})`,
                      }}
                    />
                  </td>
                  <td>
                    <NavLink to={`/user/product/${product.id}`} className="text-dark">{product.title}</NavLink>
                  </td>
                  <td>
                    <del className="h6">
                      原價
                      {
                      currency(product.origin_price)
                      }
                      {' '}
                      元
                    </del>
                    <div className="h5">
                      現在只要
                      {' '}
                      {
                      currency(product.price)
                      }
                      {' '}
                      元
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <NavLink
                        className="btn btn-outline-secondary"
                        to={`/user/product/${product.id}`}
                      >
                        {
                          product.id === cartId && <span className="spinner-border spinner-grow-sm" />
                        }
                        查看更多
                      </NavLink>
                      <button type="button" className="btn btn-outline-danger" onClick={() => addCart(product.id, 1)}>
                        {
                          product.id === cartId && <span className="spinner-border spinner-grow-sm" />
                        }

                        加到購物車
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Pagination pagination={pagination} changePage={getProducts} />

        <div className="text-end">
          <button className="btn btn-outline-danger" type="button" onClick={deleteCartAll}>
            清空購物車
          </button>
        </div>
        <table className="table align-middle">
          <thead>
            <tr>
              <th>
                {' '}
              </th>
              <th>品名</th>
              <th style={{ width: '110px' }}>數量</th>
              <th>單價</th>
            </tr>
          </thead>
          <tbody>
            {
              cart?.carts && cart?.carts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteCart(item.id)}>
                      <i className="bi bi-x" />
                      {' '}
                      刪除
                    </button>
                  </td>
                  <td>
                    {item.product.title}
                    {item.coupon && (<div className="text-success">已套用優惠券</div>)}
                  </td>
                  <td>
                    <div className="input-group input-group-sm">
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateCart(item.id, Number(e.target.value))}
                      />
                      <div className="input-group-text">
                        /
                        {item.product.unit}
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    {item.final_total !== item.total && (<small className="text-success">折扣價：</small>)}
                    {currency(item.final_total)}
                  </td>
                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end">總計</td>
              <td className="text-end">{currency(cart?.total)}</td>
            </tr>
            {
              cart?.final_total !== cart?.total ? (
                <tr>
                  <td colSpan="3" className="text-end text-success">折扣價</td>
                  <td className="text-end text-success">
                    {currency(cart?.final_total)}
                  </td>
                </tr>
              ) : ''
            }
          </tfoot>
        </table>
        <div className="input-group mb-3 input-group-sm">
          <input
            type="text"
            className="form-control"
            placeholder="請輸入優惠碼"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => addCouponCode(couponCode)}
            >
              套用優惠碼
            </button>
          </div>
        </div>
      </div>

      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errors.user?.email && 'is-invalid'}`}
              placeholder="請輸入 Email"
              {...register('user.email', { required: true })}
            />
            <div className="invalid-feedback">
              請輸入 Email。
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="name"
              className="form-label"
            >
              收件人姓名
            </label>
            <input
              id="name"
              name="姓名"
              type="text"
              className={`form-control ${errors.user?.name && 'is-invalid'}`}
              placeholder="請輸入姓名"
              {...register('user.name', { required: true })}
            />
            <div className="invalid-feedback">
              請輸入收件人姓名。
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="tel"
              className="form-label"
            >
              收件人電話
            </label>
            <input
              id="tel"
              name="電話"
              type="tel"
              className={`form-control ${errors.user?.tel && 'is-invalid'}`}
              placeholder="請輸入電話"
              {...register('user.tel', { required: true })}
            />
            <div className="invalid-feedback">
              請輸入收件人電話。
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="address"
              className="form-label"
            >
              收件人地址
            </label>
            <input
              id="address"
              name="地址"
              type="text"
              className={`form-control ${errors.user?.address && 'is-invalid'}`}
              placeholder="請輸入地址"
              {...register('user.address', { required: true })}
            />
            <div className="invalid-feedback">
              請輸入收件人地址。
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="message"
              className="form-label"
            >
              留言
            </label>
            <textarea
              name=""
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register('message')}
            />
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cart;
