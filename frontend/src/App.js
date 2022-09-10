import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { Box, ThemeProvider, useTheme } from "@mui/material";

import GlobalStyles from "./GlobalStyles";

import "antd/dist/antd.css";
import "./index.css";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";

import { lightTheme, darkTheme } from "./constants/theme";
import AppContextProvider from "./contexts/AppContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Map
import { useLoadScript } from "@react-google-maps/api";
import Map from "./components/Map/Map";

const StyledApp = styled(Box)`
  height: 100%;
`;

const StyledBox = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const { Header, Content, Sider } = Layout;
const items1 = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

const App = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppContextProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <StyledApp>
          <StyledBox>
            <Layout>
              <Header styles={{ opacity: 0 }}>
                <Navbar handleToggleDarkMode={() => setDarkMode(!darkMode)} />
                <div className="logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                  items={items1}
                />
              </Header>
              <Layout>
                <Sider width={200} className="site-layout-background">
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    style={{
                      height: "100%",
                      borderRight: 0,
                    }}
                    items={items2}
                  />
                </Sider>
                <Layout
                  style={{
                    padding: "0 24px 24px",
                  }}
                >
                  <Breadcrumb
                    style={{
                      margin: "16px 0",
                    }}
                  >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                  </Breadcrumb>
                  <Content
                    className="site-layout-background"
                    style={{
                      padding: 24,
                      margin: 0,
                      minHeight: 280,
                    }}
                  >
                    {!isLoaded ? <div>Loading...</div> : <Map />}
                  </Content>
                </Layout>
              </Layout>
            </Layout>
            <Footer />
          </StyledBox>
        </StyledApp>
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default App;
