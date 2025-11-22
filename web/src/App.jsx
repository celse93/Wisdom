import { Routes, Route, Navigate } from 'react-router-dom';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';
import { LoginRedirect } from './components/routing/LoginRedirect';
import { Register } from './components/Register';
import { LoginForm } from './components/LoginForm';
import { RootLayout } from './components/routing/RootLayout';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import './App.css';

export const App = () => {
  const { isLoading, isLoggedIn } = useContext(UserContext);

  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress size="3rem" color="var(--chart-0)" />
          <Typography> Loading session... </Typography>{' '}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<GuardedRoute />}>
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
        </Route>
      </Routes>
    </>
  );
};
