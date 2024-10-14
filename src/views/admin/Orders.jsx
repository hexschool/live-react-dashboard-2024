import {
  useEffect, useRef, useState, useCallback,
} from 'react';

import { useDispatch } from 'react-redux';
import axios from 'axios';

import { newBsModel } from '@/plugins/bootstrap';

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
import OrderModal from '@/components/OrderModal';

function Orders() {
  const dispatch = useDispatch();

  const orderModal = useRef(null);

  /**
   * 初始化 Modal 實例
   */
  useEffect(() => {
    orderModal.current = newBsModel('#orderModal', 'static');
  }, []);

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempOrder, setTempOrder] = useState({});

  /**
   * 取得訂單列表
   * @param { number } page - 頁碼
   */
  const getOrders = useCallback(async (page = 1) => {
    try {
      dispatch(showLoading());

      const res = await axios.get(
        `/api/${import.meta.env.VITE_PATH}/admin/orders?page=${page}`,
      );

      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  /**
   * 初始化
   */
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  /**
   * 開啟訂單 Modal
   * @param { object } order - 訂單資料
   */
  const openOrderModal = (order) => {
    setTempOrder(order);
    orderModal.current.show();
  };

  /**
   * 關閉訂單 Modal
   * 1. 清空暫存訂單資料
   * 2. 關閉 Modal
   */
  const closeOrderModal = () => {
    setTempOrder({});
    orderModal.current.hide();
  };

  return (
    <div className="p-3">
      <OrderModal
        closeOrderModal={closeOrderModal}
        getOrders={getOrders}
        tempOrder={tempOrder}
      />
      <h3>訂單列表</h3>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">訂單 id</th>
            <th scope="col">購買用戶</th>
            <th scope="col">Email</th>
            <th scope="col">訂單金額</th>
            <th scope="col">付款狀態</th>
            <th scope="col">付款日期</th>
            <th scope="col">留言訊息</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {order.user?.name}
              </td>
              <td>
                {order.user?.email}
              </td>
              <td>
                $
                {currency(order.total)}
              </td>
              <td>
                {order.is_paid ? (
                  <span className="text-success fw-bold">付款完成</span>
                ) : (
                  '未付款'
                )}
              </td>
              <td>
                {order.paid_date
                  ? new Date(order.paid_date * 1000).toLocaleString()
                  : '未付款'}
              </td>
              <td>{order.message}</td>

              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openOrderModal(order)}
                >
                  查看
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getOrders} />
    </div>
  );
}

export default Orders;
