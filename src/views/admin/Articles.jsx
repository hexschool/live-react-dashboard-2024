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
  date,
} from '@/utils/filters';

import Pagination from '@/components/Pagination';
import ArticleModal from '@/components/ArticleModal';
import DeleteModal from '@/components/DeleteModal';

function Articles() {
  const dispatch = useDispatch();
  const articleModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  /**
   * 初始化 Modal 實例
   */
  useEffect(() => {
    articleModalRef.current = newBsModel('#articleModal', 'static');
    deleteModalRef.current = newBsModel('#deleteModal', 'static');
  }, []);

  const [type, setType] = useState('create');
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempArticle, setTempArticle] = useState({});

  /**
   * 取得文章列表
   * @param { number } page - 頁碼
   */
  const getArticles = useCallback(async (page = 1) => {
    try {
      dispatch(showLoading());

      const api = `/api/${import.meta.env.VITE_PATH}/admin/articles?page=${page}`;
      const response = await axios.get(api);
      setArticles(response.data.articles);
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
    getArticles();
  }, [getArticles]);

  /**
   * 取得單一文章
   * @param {string} articleId - 文章 ID
   */
  const getArticle = async (articleId) => {
    try {
      dispatch(showLoading());
      const api = `/api/${import.meta.env.VITE_PATH}/admin/article/${articleId}`
      const response = await axios.get(api);
      setTempArticle(response.data.article);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * 開啟文章 Modal
   * @param { string } modalType - Modal 狀態（create, edit）
   * @param { string } articleId - 文章 ID
   */
  const openArticleModal = async (modalType, articleId) => {
    if (modalType === 'edit') {
      await getArticle(articleId);
    }

    setType(modalType);
    articleModalRef.current.show();
  };

  /**
   * 開啟刪除 Modal
   * @param { object } article - 文章資料
   */
  const openDeleteModal = (article) => {
    setTempArticle(article);
    deleteModalRef.current.show();
  };

  /**
   * 關閉文章 Modal
   */
  const closeArticleModal = () => {
    articleModalRef.current.hide();
  };

  /**
   * 關閉刪除 Modal
   */
  const closeDeleteModal = () => {
    deleteModalRef.current.hide();
  };

  /**
   * 刪除文章
   * @param { string } id - 文章 ID
   */
  const deleteArticles = async (id) => {
    try {
      dispatch(showLoading());

      const response = await axios.delete(`/api/${import.meta.env.VITE_PATH}/admin/article/${id}`);
      dispatch(createAsyncMessage(response.data));
      getArticles();
      closeDeleteModal();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="p-3">
      <ArticleModal
        closeArticleModal={closeArticleModal}
        getArticles={getArticles}
        tempArticle={tempArticle}
        type={type}
      />
      <DeleteModal
        closeModal={closeDeleteModal}
        title={tempArticle.title}
        handleDelete={deleteArticles}
        id={tempArticle.id}
      />
      <div className="text-end mt-4">
        <button
          onClick={() => openArticleModal('create')}
          className="btn btn-primary"
          type="button"
        >
          建立新的頁面
        </button>
      </div>
      <table className="table mt-4">
        <thead>
          <tr>
            <th style={{
              width: '200px',
            }}
            >
              標題
            </th>
            <th style={{
              width: '200px',
            }}
            >
              作者
            </th>
            <th>描述</th>
            <th style={{
              width: '100px',
            }}
            >
              建立時間
            </th>
            <th style={{
              width: '100px',
            }}
            >
              是否公開
            </th>
            <th style={{
              width: '120px',
            }}
            >
              編輯
            </th>
          </tr>
        </thead>
        <tbody>
          {
          articles.map((article) => (
            <tr key={article.id}>
              <td>{ article.title }</td>
              <td>{ article.author }</td>
              <td>{ article.description }</td>
              <td>{ date(article.create_at) }</td>
              <td>
                <span>
                  {
                  article.isPublic
                    ? '已上架'
                    : '未上架'
                }
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    type="button"
                    onClick={() => openArticleModal('edit', article.id)}
                  >
                    編輯
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={() => openDeleteModal(article)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getArticles} />
    </div>
  );
}

export default Articles;
