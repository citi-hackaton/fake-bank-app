import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import routes from "./routes";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";

const drawerWidth = 240;

const MainNavbar = () => {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Citi bank
      </Typography>
      <Divider />
      <List>
        {routes.map((route) => {
          if (
            (session?.user && route.visibleWhenLoggedIn) ||
            (!session?.user && route.visibleWhenLoggedOut)
          ) {
            return (
              <StyledLink key={route.name} href={route.path}>
                <ListItem key={route.name} disablePadding>
                  <ListItemButton sx={{ textAlign: "center" }}>
                    <ListItemText primary={route.name} />
                  </ListItemButton>
                </ListItem>
              </StyledLink>
            );
          }
        })}
      </List>
    </Box>
  );

  return (
    <StyledContainer>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            Citi Bank
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {routes.map((route) => {
              if (
                (session?.user && route.visibleWhenLoggedIn) ||
                (!session?.user && route.visibleWhenLoggedOut)
              ) {
                return (
                  <StyledLink key={route.name} href={route.path}>
                    <Button key={route.name} sx={{ color: "#fff" }}>
                      {route.name}
                    </Button>
                  </StyledLink>
                );
              }
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <StyledBox component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}>
          {drawer}
        </Drawer>
      </StyledBox>
    </StyledContainer>
  );
};

const StyledContainer = styled("div")`
  height: 64px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledBox = styled(Box)`
  height: 100%;
`;

export default MainNavbar;
