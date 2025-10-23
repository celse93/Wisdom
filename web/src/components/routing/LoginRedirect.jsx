import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { UserContext } from '../../context/UserContext';
import { Login } from '../../pages/Login';
import { Box } from '@mui/material';

export const LoginRedirect = () => {
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isEmpty(user)) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Box>Checking login status...</Box>;
  }

  if (isEmpty(user)) {
    return <Login />;
  }

  return <Box>Redirecting...</Box>;
};