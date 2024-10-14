import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

function CouponModal({
  closeModal, getCoupons, type, tempCoupon,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  const dispatch = useDispatch();

  /**
   * 初始化表單
   * 1. 新增優惠卷時，表單重置
   * 2. 編輯優惠卷時，表單填入原本的資料
   */
  useEffect(() => {
    if (type === 'create') {
      reset({
        title: '',
        is_enabled: 0,
        percent: 80,
        due_date: 1555459200,
        code: 'testCode',
      });
      // 預設到期日為今天
      setValue('due_date', new Date().toISOString().split('T')[0]);
    } else if (type === 'edit') {
      reset(tempCoupon);
      // 將時間戳轉換成日期格式
      setValue('due_date', new Date(tempCoupon.due_date * 1000).toISOString().split('T')[0]);
    }
  }, [type, tempCoupon, reset, setValue]);

  /**
   * 建立或編輯優惠卷
   * @param { Object } data - 優惠卷資料
   */
  const submit = async (data) => {
    try {
      dispatch(showLoading());

      let api = `/api/${import.meta.env.VITE_PATH}/admin/coupon`;
      let method = 'post';
      if (type === 'edit') {
        api = `/api/${import.meta.env.VITE_PATH}/admin/coupon/${data.id}`;
        method = 'put';
      }

      const response = await axios[method](
        api,
        {
          data: {
            ...data,
            due_date: new Date(data.due_date).getTime() / 1000,
            is_enabled: +data.is_enabled, // 轉換成數字
          },
        },
      );
      dispatch(createAsyncMessage(response.data));
      closeModal();
      getCoupons();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div
      className="modal fade"
      id="productModal"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === 'create' ? '建立新優惠券' : `編輯 ${tempCoupon.title}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(submit)}>
              <div className="mb-2">
                <label className="w-100" htmlFor="title">
                  標題
                  <input
                    type="text"
                    id="title"
                    placeholder="請輸入標題"
                    name="title"
                    className={`form-control ${errors.title && 'is-invalid'}`}
                    {...register('title', {
                      required: true,
                    })}
                  />
                  <div className="invalid-feedback">
                    請輸入標題。
                  </div>
                </label>
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="w-100" htmlFor="percent">
                    折扣（%）
                    <input
                      type="number"
                      name="percent"
                      id="percent"
                      placeholder="請輸入折扣（%）"
                      className={`form-control ${errors.percent && 'is-invalid'}`}
                      {...register('percent', {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入折扣（%）。
                    </div>
                  </label>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="w-100" htmlFor="due_date">
                    到期日
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      placeholder="請輸入到期日"
                      className={`form-control ${errors.due_date && 'is-invalid'}`}
                      {...register('due_date', {
                        required: true,
                        valueAsDate: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入到期日。
                    </div>
                  </label>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="w-100" htmlFor="code">
                    優惠碼
                    <input
                      type="text"
                      id="code"
                      name="code"
                      placeholder="請輸入優惠碼"
                      className={`form-control ${errors.code && 'is-invalid'}`}
                      {...register('code', {
                        required: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入優惠碼。
                    </div>
                  </label>
                </div>
              </div>
              <label className="form-check-label" htmlFor="is_enabled">
                <input
                  type="checkbox"
                  id="is_enabled"
                  name="is_enabled"
                  className={`form-check-input me-2 ${errors.is_enabled && 'is-invalid'}`}
                  {...register('is_enabled', {
                    required: false,
                  })}
                />
                是否啟用
              </label>
              <hr />
              <div className="d-flex justify-content-end">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    關閉
                  </button>
                  <button type="submit" className="btn btn-primary">
                    儲存
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

CouponModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getCoupons: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  tempCoupon: PropTypes.shape({
    title: PropTypes.string,
    is_enabled: PropTypes.number,
    percent: PropTypes.number,
    due_date: PropTypes.number,
    code: PropTypes.string,
  }).isRequired,
};

export default CouponModal;
