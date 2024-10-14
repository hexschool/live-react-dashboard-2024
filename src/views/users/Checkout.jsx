import { useEffect, useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

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

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState({
    products: [],
    user: {},
  });

  /**
   * 取得訂單資料
   */
  const getOrder = useCallback(async () => {
    try {
      dispatch(showLoading());
      const url = `/api/${import.meta.env.VITE_PATH}/order/${orderId}`;
      const response = await axios.get(url);

      setOrder(response.data.order);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch, orderId]);

  /**
   * 初始化資料
   * 1. 確認是否有 orderId
   * 2. 取得訂單資料
   */
  useEffect(() => {
    if (!orderId) {
      navigate('/cart');
    }

    getOrder();
  }, [orderId, getOrder, navigate]);

  /**
   * 送出付款
   * @param {string} id 訂單 ID
   * @param {object} user 使用者資料
   * @param {string} message 訂單留言
   */
  const onSubmit = async (id, user, message) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        `/api/${import.meta.env.VITE_PATH}/pay/${id}`,
        {
          data: {
            user,
            message,
          },
        },
      );
      dispatch(createAsyncMessage(response.data));
      getOrder();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="my-5 row justify-content-center">
      <form
        className="col-md-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(orderId, order.user, order.message);
        }}
      >
        <table className="table align-middle">
          <thead>
            <tr>
              <th>品名</th>
              <th>數量</th>
              <th>單價</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(order?.products)?.map((item) => (
              <tr key={item.id}>
                <td>{item.product.title}</td>
                <td>
                  {item.qty}
                  {' '}
                  /
                  {' '}
                  {item.product.unit}
                </td>
                <td>{currency(item.final_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-end">總計</td>
              <td className="text-end">{currency(order?.total)}</td>
            </tr>
          </tfoot>
        </table>

        <table className="table">
          <tbody>
            <tr>
              <th width="100">Email</th>
              <td />
            </tr>
            <tr>
              <th>姓名</th>
              <td>{order?.user?.email}</td>
            </tr>
            <tr>
              <th>收件人電話</th>
              <td>{order?.user?.tel}</td>
            </tr>
            <tr>
              <th>收件人地址</th>
              <td>{order?.user?.address}</td>
            </tr>
            <tr>
              <th>留言</th>
              <td>
                {order?.message}
              </td>
            </tr>
            <tr>
              <th>付款狀態</th>
              <td>
                {
                  order?.is_paid ? (
                    <span className="text-success">付款完成</span>
                  ) : (
                    <span>尚未付款</span>
                  )
                }
              </td>
            </tr>
          </tbody>
        </table>
        {
          !order?.is_paid && (
            <div className="text-end">
              <button type="submit" className="btn btn-danger">確認付款去</button>
            </div>
          )
        }
      </form>
    </div>
  );
}

export default Checkout;
