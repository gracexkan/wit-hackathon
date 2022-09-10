import { createTheme } from '@mui/material';

export const borderRadius = 10;
export const inventoryMargin = 10;

const baseTheme = ({
  background,
  border,
  mode,
}) => ({
  palette: {
    mode: mode,
    primary: {
      main: '#bf7cff',
    },
    background: {
      default: background.main,
      paper: background.light,
    },
    secondary: {
      main: border.main,
      dark: border.dark,
      light: background.dark,
    },
  },
  shape: {
    borderRadius,
  },
});

export const lightTheme = createTheme(
  baseTheme({
    mode: 'light',
    background: {
      main: 'hsl(230, 25%, 96.1%)',
      light: '#ffffff',
      dark: '#f2f2f2',
    },
    border: {
      main: '#bdbdbd',
      dark: '#999999',
    },
  })
);

export const darkTheme = createTheme(
  baseTheme({
    mode: 'dark',
    background: {
      main: '#212121',
      light: '#292929',
      dark: '#181818',
    },
    border: {
      main: '#616161',
      dark: '#808080',
    },
  })
);