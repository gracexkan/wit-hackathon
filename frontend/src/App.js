import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { Box, ThemeProvider, useTheme } from "@mui/material";

import { Layout, Menu } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";

import tw, { styled as twinStyled } from "twin.macro";
import { lightTheme, darkTheme } from "./constants/theme";
import AppContextProvider from "./contexts/AppContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Widgets from './components/Widgets';

import GlobalStyles from "./GlobalStyles";

import { useLoadScript } from "@react-google-maps/api";
import Map from "./components/Map/Map";
import SearchBar from "./components/SearchBar";

const StyledApp = styled(Box)`
  height: 100%;
`;

const StyledBox = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled(Box)`
  flex: 1;
  text-align: center;
  padding-top: 64px;
  transition: background 0.2s, color 0.2s;
  box-sizing: border-box;
  display: flex;
  justifycontent: center;
  color: ${({ theme }) => theme.palette.text.primary};
  width: 100%;
`;

const Content = styled(Box)`
  width: 100%;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
  padding: 0px;
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDK4BVXxJvxPF-Nm3FqgthoNpQXeRJd2rU",
    libraries: ["places"],
  });


  return (
    <AppContextProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <StyledApp>
          <StyledBox>
            <Navbar handleToggleDarkMode={() => setDarkMode(!darkMode)} />
            <ContentWrapper>
            <Content>
                <TimetableWrapper>
                  <Widgets />
                  {!isLoaded ? <div>Loading...</div> : <Map />}
                </TimetableWrapper>
              </Content>
            </ContentWrapper>
            <Footer />
          </StyledBox>
        </StyledApp>
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default App;
