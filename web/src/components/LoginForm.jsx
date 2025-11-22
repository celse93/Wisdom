import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
} from '@mui/material';

export const LoginForm = ({ handleOpenRegisterModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useContext(UserContext);

  const handleEmail = (e) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));

    if (errors) {
      setErrors((prev) => ({
        ...prev,
        email: '',
      }));
    }
  };

  const handlePassword = (e) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));

    if (errors) {
      setErrors((prev) => ({
        ...prev,
        password: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email mandatory';
    }

    if (!formData.password) {
      newErrors.password = 'Password mandatory';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Email or password incorrect' });
    }
  };

  return (
    <Box>
      <Card sx={{ border: '1px solid var(--chart-0)' }}>
        <CardHeader
          sx={{
            textAlign: 'center',
            borderBottom: 1,
            bgcolor: 'var(--chart-2)',
            color: 'var(--text)',
            borderColor: 'var(--border)',
          }}
          title="Access your library"
        ></CardHeader>
        <CardContent sx={{ textAlign: 'center', py: 4, px: 1 }}>
          <Box
            sx={{ width: '100%', mb: 3 }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {errors.submit && <Box>{errors.submit}</Box>}

            <Box sx={{ mb: 3 }}>
              <TextField
                sx={{ width: '80%' }}
                type="text"
                id="email"
                label="Email"
                required
                value={formData.email}
                onChange={handleEmail}
                disabled={isLoading}
                error={errors.email}
                helperText={errors.email}
              ></TextField>
              {errors.email && <Box>{errors.email}</Box>}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                sx={{ width: '80%' }}
                type="password"
                id="password"
                label="Password"
                required
                value={formData.password}
                onChange={handlePassword}
                disabled={isLoading}
                error={errors.password}
                helperText={errors.password}
              ></TextField>
              {errors.password && <Box>{errors.password}</Box>}
            </Box>

            <Button
              variant="contained"
              size="medium"
              sx={{
                bgcolor: 'var(--chart-0)',
                color: 'var(--background)',
                '&:hover': { bgcolor: 'var(--chart-2)' },
              }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress /> : 'Login'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography>Don't have account?</Typography>
            <Button
              sx={{
                '&:hover': {
                  bgcolor: 'var(--chart-0)',
                  color: 'var(--background)',
                },
              }}
              onClick={() => handleOpenRegisterModal()}
            >
              Create my library
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
