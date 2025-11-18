import { Box, Button, Modal } from '@mui/material';
import { Link } from 'react-router';
import { useState } from 'react';
import { LoginForm } from './LoginForm';

export const Login = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ width: 'auto' }}>
        <nav>
          <Box>
            <Button
              sx={{
                background: 'var(--chart-0)',
                '&:hover': { bgcolor: 'var(--chart-2)' },
              }}
              variant="contained"
              onClick={handleOpen}
            >
              Login
            </Button>
          </Box>

        </nav>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '15px',
            boxShadow: 24,
          }}
        >
          <LoginForm />
        </Box>
      </Modal>
    </>
  );
};
