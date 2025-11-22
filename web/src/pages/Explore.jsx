import { ExploreFeedTab } from '../components/ExploreFeedTab';
import { Box } from '@mui/material';

export const Explore = () => {
  return (
    <>
      <Box sx={{ height: 100 }} />
      <Box sx={{ my: 5 }}>
        <ExploreFeedTab />
      </Box>
      <Box sx={{ height: 150 }} />
    </>
  );
};
