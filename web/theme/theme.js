import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#544464',
    contrastText: '#FBFBFC',
  },
  secondary: {
    main: '#E8E8EC',
    contrastText: '#403F43',
  },
  background: {
    default: '#fef7f2',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1b150f',
    secondary: '#7F7F85',
  },
  error: {
    main: '#AA3C3C',
    contrastText: '#FBFBFC',
  },
  divider: '#D3D3D7',
  book: {
    main: '#7C5468',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#C2BFCC',
    contrastText: '#262629',
  },
  secondary: {
    main: '#403F43',
    contrastText: '#F2F2F5',
  },
  background: {
    default: '#110907',
    paper: '#180f0d',
  },
  text: {
    primary: '#f4ede8',
    secondary: '#A6A6AB',
  },
  error: {
    main: '#B34848',
    contrastText: '#F2F2F5',
  },
  divider: '#403F43',
  book: {
    main: '#A37082',
  },
};

export const getTheme = (mode) =>
  createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    shape: {
      borderRadius: parseFloat(lightPalette.radius || '0.625rem') * 16,
    },
  });
