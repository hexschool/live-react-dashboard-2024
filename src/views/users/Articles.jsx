import { useEffect, useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

import Pagination from '@/components/Pagination';

function Articles() {
  const dispatch = useDispatch();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});

  /**
   * 取得文章列表
   */
  const getArticles = useCallback(async (page = 1) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/${import.meta.env.VITE_PATH}/articles?page=${page}`);
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  /**
   * 初始化文章列表
   */
  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-3">
        {
          articles.map((article) => (
            (article.isPublic) && (
              <div className="col" key={article.id}>
                <div className="card">
                  <img className="card-img-top" src={article.imageUrl} alt={article.title} />
                  <div className="card-body">
                    <h5 className="card-title">
                      {article.title}
                    </h5>
                    <div>
                      {article.description}
                    </div>
                  </div>
                  <div className="card-footer">
                    <NavLink to={`/user/article/${article.id}`} className="btn btn-outline-primary">
                      文章頁面
                    </NavLink>
                  </div>
                </div>
              </div>
            )
          ))
        }
      </div>
      <Pagination pagination={pagination} changePage={getArticles} />
    </div>
  );
}

export default Articles;
