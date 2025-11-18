import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../context/UserContext';
import { Box } from '@mui/material';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
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
      <div className="card-header bg-primary text-white text-center">
        <h3 className="mb-0">Iniciar Sesión</h3>
        <p className="mb-0 mt-2 text-light">Accede a tu biblioteca</p>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">
              Email
            </label>
            <input
              type="text"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-white">
              Contraseña
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              disabled={isLoading}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Iniciando sesión...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted mb-2">¿No tienes cuenta?</p>
          <Link to="/register" className="btn btn-outline-primary">
            Crear mi biblioteca
          </Link>
        </div>

        <div className="text-center mt-3">
          <Link to="/login" className="text-muted text-decoration-none">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </Box>
  );
};
