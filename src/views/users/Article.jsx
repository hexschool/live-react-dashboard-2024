import { useState, useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';

import axios from 'axios';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

import {
  date,
} from '@/utils/filters';

function Article() {
  const dispatch = useDispatch();
  const { articleId } = useParams();
  const [article, setArticle] = useState({});

  /**
   * 取得文章資料
   */
  const getArticle = useCallback(async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/${import.meta.env.VITE_PATH}/article/${id}`);
      setArticle(response.data.article);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  /**
   * 初始化文章資料
   */
  useEffect(() => {
    getArticle(articleId);
  }, [articleId, getArticle]);

  return (
    <div className="container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/user/articles">部落格列表</NavLink>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>
      <div className="row justify-content-center">
        <article className="col-8">
          <h2>{ article.title }</h2>
          <p>
            <small className="text-muted">{date(article.create_at)}</small>
            {' '}
            -
            <small className="text-muted">
              作者：
              { article.author }
            </small>
          </p>
          <img src={article.imageUrl} alt={article.title} className="img-fluid mb-3" />
          {/*  eslint-disable-next-line */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </div>
    </div>
  );
}

export default Article;
