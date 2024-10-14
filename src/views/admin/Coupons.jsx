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

import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';
import CouponModal from '@/components/CouponModal';

import {
  date,
} from '@/utils/filters';

function Coupons() {
  const dispatch = useDispatch();

  const couponModal = useRef(null);
  const deleteModal = useRef(null);

  /**
   * 初始化 Modal 實例
   */
  useEffect(() => {
    couponModal.current = newBsModel('#productModal', 'static');
    deleteModal.current = newBsModel('#deleteModal', 'static');
  }, []);

  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});
  const [type, setType] = useState('create');
  const [tempCoupon, setTempCoupon] = useState({});

  /**
   * 取得優惠券列表
   * @param { number } page - 頁碼
   */
  const getCoupons = useCallback(async (page = 1) => {
    try {
      dispatch(showLoading());
      const api = `/api/${import.meta.env.VITE_PATH}/admin/coupons?page=${page}`;
      const response = await axios.get(api);
      setCoupons(response.data.coupons);
      setPagination(response.data.pagination);
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
    getCoupons();
  }, [getCoupons]);

  /**
   * 開啟優惠券 Modal
   * @param { string } modalType - Modal 狀態（create, edit）
   * @param { object } item - 優惠券資料
   */
  const openCouponModal = (modalType, item) => {
    setType(modalType);
    setTempCoupon(item);

    couponModal.current.show();
  };

  /**
   * 刪除優惠券
   * @param { string } id - 優惠券 ID
   */
  const deleteCoupon = async (id) => {
    try {
      dispatch(showLoading());

      const api = `/api/${import.meta.env.VITE_PATH}/admin/coupon/${id}`;
      const response = await axios.delete(api);
      dispatch(createAsyncMessage(response.data));

      deleteModal.current.hide();
      getCoupons();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * 開啟刪除 Modal
   * @param {object} product - 產品資料
   */
  const openDeleteModal = (product) => {
    setTempCoupon(product);
    deleteModal.current.show();
  };

  /**
   * 關閉優惠券 Modal
   */
  const closeCouponModal = () => {
    couponModal.current.hide();
  };

  /**
   * 關閉刪除 Modal
   */
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };

  return (
    <div className="p-3">
      <CouponModal
        closeModal={closeCouponModal}
        getCoupons={getCoupons}
        tempCoupon={tempCoupon}
        type={type}
      />
      <DeleteModal
        closeModal={closeDeleteModal}
        title={tempCoupon.title}
        handleDelete={deleteCoupon}
        id={tempCoupon.id}
      />
      <h3>優惠券列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openCouponModal('create', {})}
        >
          建立新優惠券
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">標題</th>
            <th scope="col">折扣</th>
            <th scope="col">到期日</th>
            <th scope="col">優惠碼</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.percent}</td>
              <td>{date(product.due_date)}</td>
              <td>{product.code}</td>
              <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openCouponModal('edit', product)}
                >
                  編輯
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={() => openDeleteModal(product)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getCoupons} />
    </div>
  );
}

export default Coupons;
