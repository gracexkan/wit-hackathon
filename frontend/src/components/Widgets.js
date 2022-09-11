import React from 'react';
import { styled } from '@mui/system';
import MapIcon from '@mui/icons-material/Map';
import { IconButton, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import tw, { styled as twinStyled } from 'twin.macro';

const WidgetsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-color: black;
  width: 70px;
  padding: 10px;
  margin-left: auto;
`;

const Widgets = () => (
  <WidgetsContainer>
    <Tooltip title="Dashboard">
      <IconButton
        href="http://localhost:3000"
        target="_blank"
        color="inherit"
        sx={{ width: '50px', height: '50px' }}
      >
        <DashboardIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Map">
      <IconButton
        href="http://localhost:3000"
        target="_blank"
        color="inherit"
        sx={{ width: '50px', height: '50px' }}
      >
        <MapIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Settings">
      <IconButton
        href="http://localhost:3000"
        target="_blank"
        color="inherit"
        sx={{ width: '50px', height: '50px' }}
      >
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  </WidgetsContainer>
);

export default Widgets;
