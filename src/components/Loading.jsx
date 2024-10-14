import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';

function Loading() {
  /**
   * 取得 loading 狀態
   */
  const { status } = useSelector((state) => state.loading);

  return (
    status && (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <ReactLoading type="bubbles" color="white" height={60} width={100} />
    </div>
    )
  );
}

export default Loading;
