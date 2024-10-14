import PropTypes from 'prop-types';

function DeleteModal({
  closeModal, title = null, handleDelete, id = null,
}) {
  return (
    <div
      className="modal fade"
      id="deleteModal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger">
            <h1 className="modal-title text-white fs-5" id="exampleModalLabel">
              刪除確認
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            確定要刪除「
            { title }
            」嗎？
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleDelete(id)}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
  id: PropTypes.string,
};

export default DeleteModal;
