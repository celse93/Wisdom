import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { Book } from '../../pages/Book';
import { Profile } from '../../pages/Profile';
import { Register } from '../../pages/Register';
import { MyFollowers } from '../../components/MyFollowers';
import { MyFollowings } from '../../components/MyFollowings';
import { Explore } from '../../pages/Explore';
import { useParams } from "react-router";

export const routesConfig = [
  {
    name: 'Home',
    path: '/',
    component: <Home />,
    showInNavbar: true,
  },
  {
    name: 'Login',
    path: '/login',
    component: <Login />,
    showInNavbar: false,
  },
  {
    name: 'Explore',
    path: '/explore',
    component: <Explore />,
    showInNavbar: false,
  },
  {
    name: 'Book Detail',
    path: '/book',
    component: <Book />,
    showInNavbar: true,
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
    name: 'Mis Seguidores',
    path: '/my_followers',
    component: <MyFollowers />,
    showInNavbar: false,
  },
  {
    name: 'Siguiendo',
    path: '/my_followings',
    component: <MyFollowings />,
    showInNavbar: false,
  },
];
