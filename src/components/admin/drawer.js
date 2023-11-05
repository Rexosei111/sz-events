import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
} from "@mui/material";
import React from "react";
import { useContext } from "react";
import { LayoutContext } from "./layout";

import Link from "next/link";
import { useRouter } from "next/router";

export function ResponsiveDrawer(props) {
  const { basePath = "/a" } = props;
  const {
    mobileOpen,
    handleDrawerToggle,
    drawerWidth,

    desktopDrawerOpen,
  } = useContext(LayoutContext);
  const { window, sideNavItems } = props;
  const router = useRouter();

  const Mydrawer = () => {
    return (
      <Box height={"89%"}>
        <Toolbar />
        <Stack
          flexDirection={"column"}
          alignItems={"space-between"}
          height={"100%"}
          px={1}
        >
          <List disablePadding>
            {sideNavItems?.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  bgcolor: (theme) =>
                    router.pathname === basePath && item.label === "Accueil"
                      ? theme.palette.primary.main
                      : router.pathname.startsWith(item.url) &&
                        item.label !== "Accueil"
                      ? theme.palette.primary.main
                      : null,
                }}
              >
                <ListItemButton LinkComponent={Link} href={item.url}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      color:
                        router.pathname === basePath && item.label === "Accueil"
                          ? "white"
                          : router.pathname.startsWith(item.url) &&
                            item.label !== "Accueil"
                          ? "white"
                          : null,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>
    );
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <Mydrawer />
      </Drawer>
      <Drawer
        variant="persistent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          // display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open={desktopDrawerOpen}
      >
        <Mydrawer />
      </Drawer>
    </Box>
  );
}
