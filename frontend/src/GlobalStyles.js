import { GlobalStyles as MuiGlobalStyles, useTheme } from "@mui/material";

const GlobalStyles = () => {
  const theme = useTheme();

  const globalStyle = {
    body: {
      background: theme.palette.background.default,
      transition: "background 0.2s",
    },
    "::-webkit-scrollbar": {
      width: "10px",
      height: "10px",
    },
    "::-webkit-scrollbar-track": {
      background: theme.palette.background.default,
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb": {
      background: theme.palette.secondary.main,
      borderRadius: "5px",
      opacity: 0.5,
      transition: "background 0.2s",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: theme.palette.secondary.dark,
    },
  };

  return <MuiGlobalStyles styles={globalStyle} />;
};

export default GlobalStyles;
