import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { Book } from '../../pages/Book';
import { Profile } from '../../pages/Profile';
import { Register } from '../../pages/Register';
import { Follows } from '../../pages/Follows';
import { Explore } from '../../pages/Explore';
import { useParams } from "react-router";

export const routesConfig = [
  {
    name: 'Home',
    path: '/home',
    component: <Home />,
    showInNavbar: true,
  },
  {
    name: 'Login',
    path: '/',
    component: <Login />,
    showInNavbar: false,
  },
  {
    name: 'Explore',
    path: '/explore',
    component: <Explore />,
    showInNavbar: true,
  },
  {
    name: 'Book Detail',
    path: '/book',
    component: <Book />,
    showInNavbar: false,
  },
  {
    name: 'Profile',
    path: '/profile/:profileId',
    component: <Profile />,
    showInNavbar: true,
  },
  {
    name: 'Register',
    path: '/register',
    component: <Register />,
    showInNavbar: false,
  },
  {
    name: 'Follows',
    path: '/follows',
    component: <Follows />,
    showInNavbar: false,
  },
];
