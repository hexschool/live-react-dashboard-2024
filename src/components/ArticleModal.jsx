import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import axios from 'axios';
/**
 * CKEditor 參考文件
 * https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/react/react.html
 * 建議使用 ckeditor5-build-classic 這個版本
 */
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
  createAsyncMessage,
} from '@/slice/messageSlice';
import {
  showLoading,
  hideLoading,
} from '@/slice/loadingSlice';

function ArticleModal({
  closeArticleModal, getArticles, type, tempArticle,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm({
    mode: 'onTouched',
  });
  /**
   * 新增 Content 來追蹤 CKEditor 內容
   */
  const [editorContent, setEditorContent] = useState('');
  /**
   * 初始化 useFieldArray
   * 因為 tag 是陣列，所以要使用 useFieldArray 來處理
   */
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tag', // 要綁定的欄位名稱
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (type === 'create') {
      reset({
        title: '',
        content: '',
        imageUrl: '',
        author: '',
        description: '',
        create_at: 1555459200,
        tag: [''],
        isPublic: false,
      });
      setEditorContent('');
      setValue('create_at', new Date().toISOString().split('T')[0]);
    } else if (type === 'edit') {
      reset(tempArticle);
      setEditorContent(tempArticle.content || '');
      setValue('create_at', new Date(tempArticle.create_at * 1000).toISOString().split('T')[0]);
    }
  }, [reset, setValue, tempArticle, type]);

  const submit = async (data) => {
    dispatch(showLoading());

    let api = `/api/${import.meta.env.VITE_PATH}/admin/article`;
    let method = 'post';

    if (type === 'edit') {
      api = `/api/${import.meta.env.VITE_PATH}/admin/article/${tempArticle.id}`;
      method = 'put';
    }

    try {
      const response = await axios[method](api, {
        data: {
          ...data,
          create_at: new Date(data.create_at).getTime() / 1000,
        },
      });

      dispatch(createAsyncMessage(response.data));
      closeArticleModal();
      getArticles();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div
      className="modal fade"
      id="articleModal"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {
                type === 'create' ? '建立新貼文' : `編輯 ${tempArticle.title}`
              }
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeArticleModal}
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(submit)}>
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      placeholder="請輸入標題"
                      className={`form-control ${errors.title && 'is-invalid'}`}
                      {...register('title', {
                        required: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入標題。
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">輸入圖片網址</label>
                    <input
                      type="text"
                      className="form-control"
                      name="imageUrl"
                      id="imageUrl"
                      placeholder="請輸入圖片連結"
                      {...register('imageUrl', {
                        required: false,
                      })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">作者</label>
                    <input
                      type="text"
                      name="author"
                      id="author"
                      placeholder="請輸入作者"
                      className={`form-control ${errors.author && 'is-invalid'}`}
                      {...register('author', {
                        required: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入作者。
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="create_at">文章建立日期</label>
                    <input
                      type="date"
                      name="create_at"
                      id="create_at"
                      className={`form-control ${errors.create_at && 'is-invalid'}`}
                      {...register('create_at', {
                        required: true,
                        valueAsDate: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入文章建立日期。
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <label htmlFor="tag" className="form-label">標籤</label>
                  <div className="row gx-1 mb-3">
                    {
                    fields.map((item, index) => (
                      <div className="col-md-2 mb-1" key={item.id}>
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className={`form-control ${errors.tag?.[index] && 'is-invalid'}`}
                            placeholder="請輸入標籤"
                            {
                              ...register(`tag.${index}`, {
                                required: true,
                              })
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            aria-label="delete tag"
                            onClick={() => remove(index)} // 移除標籤
                          >
                            <i className="bi bi-x" />
                          </button>
                          <div className="invalid-feedback">
                            請輸入標籤。
                          </div>
                        </div>
                      </div>
                    ))
                  }
                    <div className="col-md-2 mb-1">
                      <button
                        className="btn btn-outline-primary btn-sm d-block w-100"
                        type="button"
                        onClick={() => append('')} // 新增標籤
                      >
                        新增標籤
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">文章描述</label>
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      placeholder="請輸入文章描述"
                      className={`form-control ${errors.description && 'is-invalid'}`}
                      {...register('description', {
                        required: true,
                      })}
                    />
                    <div className="invalid-feedback">
                      請輸入文章描述。
                    </div>
                  </div>
                  <div className="mb-3">
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorContent}
                      onChange={(_, editor) => {
                        const data = editor.getData();
                        setEditorContent(data);
                        setValue('content', data);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        className={`form-check-input me-2 ${errors.isPublic && 'is-invalid'}`}
                        {...register('isPublic', {
                          required: false,
                        })}
                      />
                      <label className="form-check-label" htmlFor="isPublic">
                        是否公開
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
                    onClick={closeArticleModal}
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

ArticleModal.propTypes = {
  closeArticleModal: PropTypes.func.isRequired,
  getArticles: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  tempArticle: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    author: PropTypes.string,
    description: PropTypes.string,
    create_at: PropTypes.number,
    tag: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ArticleModal;
