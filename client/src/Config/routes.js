import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import Dashboard from '../Pages/dashboard';

const routes = [
  {
    path: '/login',
    component: Login,
    isPrivate: false,
  },
  {
    path: '/register',
    component: Register,
    isPrivate: false,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    isPrivate: true,
  },
];

export default routes;
