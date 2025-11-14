import { Box, Typography } from '@mui/material';
import { CreatePosts } from '../components/CreatePosts';
import { Feed } from '../components/Feed';

export const Home = () => {
  return (
    <Box sx={{ mt: 5, pt: 5 }}>
      <Box sx={{ height: 50 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: 'var(--text)',
            mb: 2
          }}
        >
          Share Your Reading Journey
        </Typography>
        <Typography
          sx={{
            color: 'var(--muted-foreground)',
            mb: 3
          }}
        >
          Connect with fellow book lovers, share reviews, discover new reads,
          and celebrate the joy reading together
        </Typography>
        <Box>
          <CreatePosts />
        </Box>
      </Box>
      <Feed />
    </Box>
  );
};
