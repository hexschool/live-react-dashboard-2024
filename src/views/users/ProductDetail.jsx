import { useEffect, useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';

import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

function ProductDetail() {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 取得商品資料
   * @param { number } id
   */
  const getProduct = useCallback(async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `/api/${import.meta.env.VITE_PATH}/product/${id}`,
      );
      setProduct(response.data.product);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  /**
   * 加入購物車
   * @param {string} id 產品 ID
   * @param {number} qty 購買數量
   */
  const addToCart = async (id, qty) => {
    try {
      setIsLoading(true);
      const url = `/api/${import.meta.env.VITE_PATH}/cart`;

      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(url, { data });
      dispatch(createAsyncMessage(response.data));
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 初始化
   */
  useEffect(() => {
    getProduct(productId);
  }, [productId, getProduct]);

  return (
    <div className="container full-height">
      <div
        style={{
          minHeight: '400px',
          backgroundImage: `url(${product.imageUrl})`,
          backgroundPosition: 'center center',
        }}
      />
      <div className="row justify-content-between mt-4 mb-7">
        <div className="col-md-7">
          <h2 className="mb-0">{product.title}</h2>
          <p className="fw-bold">
            NT$
            {product.price}
          </p>
          <p>{product.content}</p>
          {/* eslint-disable-next-line react/no-danger */}
          <p dangerouslySetInnerHTML={{ __html: product.description }} />
          <div className="my-4">
            <img src={product.imageUrl} alt={product.title} className="img-fluid mt-4" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group mb-3 border mt-3">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon1"
                aria-label="Decrease quantity"
                onClick={() => setCartQuantity((pre) => (pre === 1 ? pre : pre - 1))}
              >
                <i className="bi bi-dash" />
              </button>
            </div>
            <input
              type="number"
              className="form-control border-0 text-center my-auto shadow-none"
              readOnly
              value={cartQuantity}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon2"
                aria-label="Decrease quantity"
                onClick={() => setCartQuantity((pre) => pre + 1)}
              >
                <i className="bi bi-plus" />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-dark w-100 rounded-0 py-3"
            onClick={() => addToCart(product.id, cartQuantity)}
            disabled={isLoading}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
