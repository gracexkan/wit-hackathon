import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, ThemeProvider, useTheme } from '@mui/material';

import tw, { styled as twinStyled } from 'twin.macro';
import { lightTheme, darkTheme } from './constants/theme';
import AppContextProvider from './contexts/AppContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Name from './components/dashboard/companyName';
import Offices from './components/dashboard/companyOffices';

import GlobalStyles from './GlobalStyles';

const StyledApp = styled(Box)`
  height: 100%;
`;

const StyledBox = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = twinStyled(
  styled(Box)`
    flex: 1;
    text-align: center;
    padding-top: 64px;
    transition: background 0.2s, color 0.2s;
    box-sizing: border-box;
    display: flex;
    justifyContent: center;
    color: ${({ theme }) => theme.palette.text.primary};
  `,
  {
    ...tw`max-w-[100rem] w-full mx-auto`,
  },
);

const Content = styled(Box)`
  width: 100%;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
  padding: 25px;
`;

const TimetableWrapper = styled(Box)`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const App = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppContextProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <StyledApp>
          <Name />
          <Offices />
          <StyledBox>
            <Navbar handleToggleDarkMode={() => setDarkMode(!darkMode)} />
            <Footer />
          </StyledBox>
        </StyledApp>
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default App;