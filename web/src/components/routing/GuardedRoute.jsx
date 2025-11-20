import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { isEmpty } from 'lodash';
import { Box } from '@mui/material';

export const GuardedRoute = () => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <Box>Loading user data...</Box>;
  }

  if (!isEmpty(user)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
