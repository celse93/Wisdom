import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { Book } from '../../pages/Book';
import { Profile } from '../../pages/Profile';
import { Register } from '../../pages/Register';
import { MyLibrary } from '../../pages/MyLibrary';
import { MyQuotes } from '../../pages/MyQuotes';
import { MyReviews } from '../../pages/MyReviews';
import { MyRecommendations } from '../../pages/MyRecommendations';
import { MyFollowers } from '../../components/MyFollowers';
import { MyFollowings } from '../../components/MyFollowings';
import { Explore } from '../../pages/Explore';

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
    path: '/profile',
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
    name: 'Mi Biblioteca',
    path: '/my_library',
    component: <MyLibrary />,
    showInNavbar: false,
  },
  {
    name: 'Mis Citas',
    path: '/my_quotes',
    component: <MyQuotes />,
    showInNavbar: false,
  },
  {
    name: 'Mis Reseñas',
    path: '/my_reviews',
    component: <MyReviews />,
    showInNavbar: false,
  },
  {
    name: 'Mis Recomendaciones',
    path: '/my_recommendations',
    component: <MyRecommendations />,
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
