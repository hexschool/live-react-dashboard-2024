import { useEffect, useState } from 'react';

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

function ProductModal({
  closeProductModal, getProducts, type, tempProduct,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const dispatch = useDispatch();

  const [fileUploadingStatus, setFileUploadingStatus] = useState(false);

  /**
   * 監聽 imageUrl 的變化
   * 用來顯示圖片
   */
  const watchImageUrl = watch('imageUrl');

  /**
   * 初始化表單
   * 1. 新增商品時，表單重置
   * 2. 編輯商品時，表單填入原本的資料
   */
  useEffect(() => {
    if (type === 'create') {
      reset({
        title: '',
        category: '',
        origin_price: 0,
        price: 0,
        unit: '',
        description: '',
        content: '',
        is_enabled: false,
        imageUrl: '',
      });
    } else if (type === 'edit') {
      reset(tempProduct);
    }
  }, [type, tempProduct, reset]);

  /**
   * 上傳圖片
   * @param {File} files - 圖片檔案
   */
  const uploadFile = async (files) => {
    try {
      setFileUploadingStatus(true);

      const formData = new FormData();
      formData.append('file-to-upload', files);

      const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/upload`;
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 將圖片網址填入 imageUrl 欄位
      setValue('imageUrl', response.data.imageUrl);
      dispatch(createAsyncMessage({ ...response.data, message: '上傳成功' }));
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setFileUploadingStatus(false);
    }
  };

  /**
   * 建立或編輯商品
   * @param { Object } data - 商品資料
   */
  const submit = async (data) => {
    try {
      dispatch(showLoading());

      let method = 'post';
      let api = `/api/${import.meta.env.VITE_PATH}/admin/product`;

      if (type === 'edit') {
        api = `/api/${import.meta.env.VITE_PATH}/admin/product/${tempProduct.id}`;
        method = 'put';
      }
      const response = await axios[method](
        api,
        {
          data,
        },
      );

      dispatch(createAsyncMessage(response.data));
      closeProductModal();
      getProducts();
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
              { type === 'create' ? '建立新商品' : `編輯 ${tempProduct.title}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeProductModal}
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(submit)}>
              <div className="row">
                <div className="col-sm-4">
                  <div className="form-group mb-2">
                    <label className="w-100" htmlFor="imageUrl">
                      輸入圖片網址
                      <input
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        placeholder="請輸入圖片連結"
                        className="form-control"
                        {...register('imageUrl', {
                          required: false,
                        })}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2">
                    <label className="w-100" htmlFor="customFile">
                      或 上傳圖片
                      {
                      fileUploadingStatus && (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )
                    }
                      <input
                        type="file"
                        id="customFile"
                        className="form-control"
                        onChange={(event) => uploadFile(event.target.files[0])}
                      />
                    </label>
                  </div>
                  <img src={watchImageUrl} alt="產品圖片" className="img-fluid" />
                </div>
                <div className="col-sm-8">
                  <div className="form-group mb-2">
                    <label className="w-100" htmlFor="title">
                      標題
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="請輸入標題"
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
                    <div className="form-group mb-2 col-md-6">
                      <label className="w-100" htmlFor="category">
                        分類
                        <input
                          type="text"
                          id="category"
                          name="category"
                          placeholder="請輸入分類"
                          className={`form-control ${errors.category && 'is-invalid'}`}
                          {...register('category', {
                            required: true,
                          })}
                        />
                        <div className="invalid-feedback">
                          請輸入分類。
                        </div>
                      </label>
                    </div>
                    <div className="form-group mb-2 col-md-6">
                      <label className="w-100" htmlFor="unit">
                        單位
                        <input
                          type="unit"
                          id="unit"
                          name="unit"
                          placeholder="請輸入單位"
                          className={`form-control ${errors.unit && 'is-invalid'}`}
                          {...register('unit', {
                            required: true,
                          })}
                        />
                        <div className="invalid-feedback">
                          請輸入單位。
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group mb-2 col-md-6">
                      <label className="w-100" htmlFor="origin_price">
                        原價
                        <input
                          type="number"
                          id="origin_price"
                          name="origin_price"
                          placeholder="請輸入原價"
                          className={`form-control ${errors.origin_price && 'is-invalid'}`}
                          {...register('origin_price', {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                        <div className="invalid-feedback">
                          請輸入原價。
                        </div>
                      </label>
                    </div>
                    <div className="form-group mb-2 col-md-6">
                      <label className="w-100" htmlFor="price">
                        售價
                        <input
                          type="number"
                          id="price"
                          name="price"
                          placeholder="請輸入售價"
                          className={`form-control ${errors.price && 'is-invalid'}`}
                          {...register('price', {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                        <div className="invalid-feedback">
                          請輸入售價。
                        </div>
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="form-group mb-2">
                    <label className="w-100" htmlFor="description">
                      產品描述
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="請輸入產品描述"
                        className="form-control"
                        {...register('description', {
                          required: false,
                        })}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2">
                    <label className="w-100" htmlFor="content">
                      說明內容
                      <textarea
                        type="text"
                        id="content"
                        name="content"
                        placeholder="請輸入產品說明內容"
                        className="form-control"
                        {...register('content', {
                          required: false,
                        })}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2">
                    <div className="form-check">
                      <label
                        className="w-100 form-check-label"
                        htmlFor="is_enabled"
                      >
                        是否啟用
                        <input
                          type="checkbox"
                          id="is_enabled"
                          name="is_enabled"
                          placeholder="請輸入產品說明內容"
                          className="form-check-input"
                          {...register('is_enabled', {
                            required: false,
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-end">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeProductModal}
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

ProductModal.propTypes = {
  closeProductModal: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  tempProduct: PropTypes.shape({
    title: PropTypes.string,
    category: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number,
    unit: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    is_enabled: PropTypes.bool,
    imageUrl: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

export default ProductModal;
