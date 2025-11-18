import { useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
} from '@mui/material';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUsername = (e) => {
    setFormData((prev) => ({
      ...prev,
      username: e.target.value,
    }));

    if (errors[username]) {
      setErrors((prev) => ({
        ...prev,
        [username]: '',
      }));
    }
  };

  const handleEmail = (e) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));

    if (errors[email]) {
      setErrors((prev) => ({
        ...prev,
        [email]: '',
      }));
    }
  };

  const handlePassword = (e) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));

    if (errors[password]) {
      setErrors((prev) => ({
        ...prev,
        [password]: '',
      }));
    }
  };

  const handleConfirmPassword = (e) => {
    setFormData((prev) => ({
      ...prev,
      confirmPassword: e.target.value,
    }));

    if (errors[confirmPassword]) {
      setErrors((prev) => ({
        ...prev,
        [confirmPassword]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is mandatory';
    } else if (formData.username.length > 10) {
      newErrors.username = 'Username is mandatory';
    }

    if (!formData.email) {
      newErrors.email = 'Email is mandatory';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email isn't valid";
    }

    if (!formData.password) {
      newErrors.password = 'Password is mandatory';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must contain at least 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
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
      await register(formData.username, formData.email, formData.password);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      if (
        error?.message?.toLowerCase().includes('already registered') ||
        error?.message?.toLowerCase().includes('email')
      ) {
        setErrors({
          submit: 'Este email ya está registrado. Por favor inicia sesión.',
        });
      } else {
        setErrors({ submit: 'Error al crear la cuenta. Intenta de nuevo.' });
      }
    }
  };

  return (
    <>
      <Box sx={{ height: 100 }}></Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Card sx={{ width: '50%' }}>
          <CardHeader
            sx={{
              textAlign: 'center',
              borderBottom: 1,
              bgcolor: 'var(--chart-2)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
            title="Create your library"
          >
            <Typography sx={{ mb: 0, mt: 2 }}>Join the Wisdom</Typography>
          </CardHeader>
          <CardContent sx={{ textAlign: 'center', py: 4, px: 1 }}>
            <Box
              sx={{ width: '100%', mb: 4 }}
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              {errors.submit && <Box>{errors.submit}</Box>}

              <Box sx={{ mb: 3 }}>
                <TextField
                  sx={{ width: '60%' }}
                  required
                  label="Username"
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleUsername}
                  disabled={isLoading}
                  error={errors.username}
                  helperText={errors.username}
                />
                {errors.username && <Box>{errors.username}</Box>}
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  sx={{ width: '60%' }}
                  required
                  label="Email"
                  placeholder="email@email.com"
                  type="text"
                  id="email"
                  error={errors.email}
                  helperText={errors.email}
                  value={formData.email}
                  onChange={handleEmail}
                  disabled={isLoading}
                />
                {errors.email && <Box>{errors.email}</Box>}
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  sx={{ width: '60%' }}
                  type="password"
                  id="password"
                  label="Password"
                  placeholder="Minimum 6 caracteres"
                  required
                  value={formData.password}
                  onChange={handlePassword}
                  disabled={isLoading}
                  error={errors.password}
                  helperText={errors.password}
                />
                {errors.password && <Box>{errors.password}</Box>}
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  sx={{ width: '60%' }}
                  type="password"
                  id="confirmPassword"
                  label="Confirm password"
                  placeholder="Retype your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleConfirmPassword}
                  disabled={isLoading}
                  error={errors.password}
                  helperText={errors.password}
                />
                {errors.password && <Box>{errors.password}</Box>}
              </Box>

              {errors.confirmPassword && <Box>{errors.confirmPassword}</Box>}

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
                {isLoading ? <CircularProgress /> : 'Create my library'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography>Got account?</Typography>
              <Link to="/login-form">Login</Link>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link to="/login">Go back</Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
