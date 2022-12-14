import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      default: "#e7ebf0",
    },
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
