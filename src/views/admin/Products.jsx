import {
  useState, useRef, useEffect, useCallback,
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

import ProductModal from '@/components/ProductModal';
import Pagination from '@/components/Pagination';
import DeleteModal from '@/components/DeleteModal';

function Products() {
  const dispatch = useDispatch();

  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  /**
   * 初始化 Modal 實例
   */
  useEffect(() => {
    productModalRef.current = newBsModel('#productModal', 'static');
    deleteModalRef.current = newBsModel('#deleteModal', 'static');
  }, []);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState({});
  const [type, setType] = useState('');

  /**
   * 取得產品列表
   * @param { number } page - 頁碼
   */
  const getProducts = useCallback(async (page = 1) => {
    try {
      dispatch(showLoading());
      const api = `/api/${import.meta.env.VITE_PATH}/admin/products?page=${page}`;

      const response = await axios.get(api);
      setProducts(response.data.products);
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
    getProducts();
  }, [getProducts]);

  /**
   * 開啟產品 Modal
   * @param {*} modalType - Modal 狀態（create, edit）
   * @param {*} product - 產品資料
   * @returns { void }
   * @example
   * openProductModal('create', {});
   */
  const openProductModal = (modalType, product) => {
    setType(modalType);
    setTempProduct(product);

    productModalRef.current.show();
  };

  /**
   * 關閉產品 Modal
   * @returns { void }
   * @example
   * closeProductModal();
   */
  const closeProductModal = () => {
    productModalRef.current.hide();
  };

  /**
   * 開啟刪除 Modal
   * @param {Object} product - 產品資料
   * @returns { void }
   */
  const openDeleteModal = (product) => {
    setTempProduct(product);
    deleteModalRef.current.show();
  };

  /**
   * 關閉刪除 Modal
   * @returns { void }
   */
  const closeDeleteModal = () => {
    deleteModalRef.current.hide();
  };

  /**
   * 刪除產品
   * @param { String } id - 產品 ID
   */
  const deleteProduct = async (id) => {
    try {
      dispatch(showLoading());
      const api = `/api/${import.meta.env.VITE_PATH}/admin/product/${id}`;
      const response = await axios.delete(api);

      dispatch(createAsyncMessage(response.data));
      getProducts();
      closeDeleteModal();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="p-3">
      <ProductModal
        closeProductModal={closeProductModal}
        getProducts={getProducts}
        tempProduct={tempProduct}
        type={type}
      />
      <DeleteModal
        closeModal={closeDeleteModal}
        title={tempProduct.title}
        handleDelete={deleteProduct}
        id={tempProduct.id}
      />
      <h3>產品列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openProductModal('create', {})}
        >
          建立新商品
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">分類</th>
            <th scope="col">名稱</th>
            <th scope="col">售價</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{ product.category }</td>
              <td>{ product.title }</td>
              <td>{ currency(product.price) }</td>
              <td>{ product.is_enabled ? '啟用' : '未啟用' }</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openProductModal('edit', product)}
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
      <Pagination pagination={pagination} changePage={getProducts} />
    </div>
  );
}

export default Products;
