import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

function OrderModal({
  closeOrderModal, getOrders, tempOrder,
}) {
  const dispatch = useDispatch();

  const [tempData, setTempData] = useState({
    is_paid: '',
    status: 0,
    ...tempOrder,
  });

  /**
   * 初始化
   */
  useEffect(() => {
    setTempData({
      ...tempOrder,
      is_paid: tempOrder.is_paid,
      status: tempOrder.status,
    });
  }, [tempOrder]);

  /**
   * 事件處理
   * @param { Event } event - 事件
   */
  const handleChange = (event) => {
    const { name, checked } = event.target;
    if (['is_paid'].includes(name)) {
      setTempData((preState) => ({ ...preState, [name]: checked }));
    }
  };

  /**
   * 提交表單
   */
  const submit = async () => {
    try {
      dispatch(showLoading());
      const api = `/api/${import.meta.env.VITE_PATH}/admin/order/${tempOrder.id}`;

      const response = await axios.put(api, {
        data: {
          ...tempData,
        },
      });

      dispatch(createAsyncMessage(response.data));
      closeOrderModal();
      getOrders();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div
      className="modal fade"
      id="orderModal"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {`編輯 ${tempData.id}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeOrderModal}
            />
          </div>
          <div className="modal-body">
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">Email</span>
              <div className="col-sm-10">
                <input
                  type="email"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempOrder?.user?.email}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">訂購者</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempOrder?.user?.name}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">外送地址</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempOrder?.user?.address}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">留言</span>
              <div className="col-sm-10">
                <textarea
                  name=""
                  id=""
                  cols="30"
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempOrder.message}
                />
              </div>
            </div>
            {tempOrder.products && (
              <table className="table">
                <thead>
                  <tr>
                    <th>品項名稱</th>
                    <th>數量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tempOrder.products).map((cart) => (
                    <tr key={cart.id}>
                      <td>{cart.product.title}</td>
                      <td>{cart.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-0 text-end">總金額</td>
                    <td className="border-0">
                      $
                      {tempOrder.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div>
              <h5 className="mt-4">修改訂單狀態</h5>
              <div className="form-check mb-4">
                <label className="form-check-label" htmlFor="is_paid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_paid"
                    id="is_paid"
                    checked={!!tempData.is_paid}
                    onChange={handleChange}
                  />
                  付款狀態 (
                  {tempData.is_paid ? '已付款' : '未付款'}
                  )
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeOrderModal}
            >
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderModal.propTypes = {
  closeOrderModal: PropTypes.func.isRequired,
  getOrders: PropTypes.func.isRequired,
  tempOrder: PropTypes.shape({
    id: PropTypes.string,
    user: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      address: PropTypes.string,
    }),
    message: PropTypes.string,
    total: PropTypes.number,
    is_paid: PropTypes.bool,
    status: PropTypes.number,
    products: PropTypes.shape({
      id: PropTypes.string,
      product: PropTypes.shape({
        title: PropTypes.string,
      }),
      qty: PropTypes.number,
    }),
  }).isRequired,
};

export default OrderModal;
