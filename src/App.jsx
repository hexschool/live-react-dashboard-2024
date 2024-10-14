import {
  RouterProvider,
} from 'react-router-dom';

import MessageToast from '@/components/MessageToast';
import Loading from '@/components/Loading';

import router from './router';

function App() {
  return (
    <>
      <Loading />
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
