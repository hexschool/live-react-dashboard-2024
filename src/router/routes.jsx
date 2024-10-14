import Home from '@/views/Home';
import Login from '@/views/Login';
import Dashboard from '@/views/admin/Dashboard';

import AdminProducts from '@/views/admin/Products';
import AdminOrders from '@/views/admin/Orders';
import AdminCoupons from '@/views/admin/Coupons';
import AdminArticles from '@/views/admin/Articles';

import UserCart from '@/views/users/Cart';
import UserCheckout from '@/views/users/Checkout';
import UserProductDetail from '@/views/users/ProductDetail';
import UserArticles from '@/views/users/Articles';
import UserArticle from '@/views/users/Article';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Dashboard />,
    children: [
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'coupons',
        element: <AdminCoupons />,
      },
      {
        path: 'Articles',
        element: <AdminArticles />,
      },
    ],
  },
  {
    path: '/user',
    element: <Dashboard />,
    children: [
      {
        path: 'product/:productId',
        element: <UserProductDetail />,
      },
      {
        path: 'cart',
        element: <UserCart />,
      },
      {
        path: 'checkout/:orderId',
        element: <UserCheckout />,
      },
      {
        path: 'articles',
        element: <UserArticles />,
      },
      {
        path: 'article/:articleId',
        element: <UserArticle />,
      },
    ],
  },
  {
    path: '*',
    element: <Home />,
  },
];

export default routes;
