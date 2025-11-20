import { Toolbar, Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Toolbar
        sx={{
          margin: '0 auto',
          width: '100%',
          paddingX: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              fontFamily: 'sans-serif',
              color: 'var(--chart-1)',
            }}
          >
            © 2025. Built with{' '}
            <FavoriteIcon
              sx={{
                fontFamily: 'sans-serif',
                color: 'var(--chart-2)',
              }}
              fontSize="small"
            />{' '}
            by PASM
          </Typography>
        </Box>
      </Toolbar>
    </Box>
  );
};
