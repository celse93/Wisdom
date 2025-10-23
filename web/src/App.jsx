import { Routes, Route, Navigate } from 'react-router-dom';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';
import { LoginRedirect } from './components/routing/LoginRedirect';
import { Register } from './pages/Register';
import { LoginForm } from './pages/LoginForm';
import { ProtectedNavBar } from './components/routing/ProtectedNavBar';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import { Box } from '@mui/material';
import './App.css';

export const App = () => {
  const { isLoading, isLoggedIn } = useContext(UserContext);

  if (isLoading) {
    return <Box>Loading session...</Box>;
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<GuardedRoute />}>
          <Route path="/" element={<ProtectedNavBar />}>
            {routesConfig
              .filter(
                (route) =>
                  route.path !== '/login' &&
                  route.path !== '/register' &&
                  route.path !== '*'
              )
              .map((route) => (
                <Route
                  key={route.name}
                  path={route.path}
                  element={route.component}
                />
              ))}
          </Route>
        </Route>

        {/* Common routes */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};
