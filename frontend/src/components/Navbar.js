import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import tw, { styled as twinStyled } from "twin.macro";
import logo from "../assets/logo.svg";

const NavbarBox = styled("div")`
  flex-grow: 1;
  position: fixed;
  margin-left: 0px;
  z-index: 1201;
  margin-bottom: 10px;
`;

const NavbarWrapper = styled(`div`)`
  display: flex;
  flex-direction: row;
  flex: 1 1 0%;
  align-items: center;
`;

const StyledNavBar = styled(AppBar)`
  gap: 40px;
  background: linear-gradient(220deg, #ffffff, #dde7f5);
  opacity: 97%;
  z-index: 1201;
`;

const NavbarTitle = styled(Typography)`
  flex-grow: 1;
  z-index: 1201;
  font-weight: bolder;
  color: #212121;
`;

const LogoImg = styled("img")`
  height: 46px;
  margin-right: 12.5px;
  margin-top: -2px;
`;

const Navbar = ({ handleToggleDarkMode }) => {
  const theme = useTheme();

  return (
    <NavbarBox>
      <StyledNavBar>
        <Toolbar sx={{ gap: "10px" }}>
          <NavbarWrapper>
            <LogoImg src={logo} sx={{ marginRight: "0px" }} />
            <NavbarTitle>GRASS App Name</NavbarTitle>
            <Tooltip title="Change theme">
              <IconButton
                onClick={handleToggleDarkMode}
                sx={{ color: "#212121" }}
              >
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Tooltip>
          </NavbarWrapper>
        </Toolbar>
      </StyledNavBar>
    </NavbarBox>
  );
};

export default Navbar;
