import { Box, Toolbar, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
// import TopBar from "./TopBar";
// import { ResponsiveDrawer } from "./drawer";
import Head from "next/head";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { useTokenValidation } from "@/hooks/token";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import TopBar from "./TopBar";
import { ResponsiveDrawer } from "./drawer";

export const LayoutContext = createContext(null);
const drawerWidth = 240;

export default function AdminLayout({ children, title = "Accueil" }) {
  const router = useRouter();
  useTokenValidation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [topbarTitle, setTopBarTitle] = useState(title);
  const [dynamicDrawerWidth, setDynamicDrawerWidth] = useState(drawerWidth);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);

  const sideNavItems = [
    // {
    //   label: "Dashboard",
    //   icon: (
    //     <HomeOutlinedIcon
    //       fontSize="small"
    //       htmlColor={router.pathname === "/admin/dashboard" ? "white" : null}
    //     />
    //   ),
    //   url: "/admin/dashboard",
    // },
    {
      label: "Events",
      icon: (
        <AssignmentOutlinedIcon
          fontSize="small"
          htmlColor={
            router.pathname.startsWith("/admin/events") ? "white" : null
          }
        />
      ),
      url: "/admin/events",
    },
    {
      label: "Attendance",
      icon: (
        <GroupsOutlinedIcon
          fontSize="small"
          htmlColor={
            router.pathname.startsWith("/admin/attendance") ? "white" : null
          }
        />
      ),
      url: "/admin/attendance",
    },
    {
      label: "Users",
      icon: (
        <GroupsOutlinedIcon
          fontSize="small"
          htmlColor={
            router.pathname.startsWith("/admin/users") ? "white" : null
          }
        />
      ),
      url: "/admin/users",
    },
    ,
  ];

  const theme = useTheme();
  const below_sm = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (below_sm === true) {
      setDesktopDrawerOpen(false);
    }
  }, [below_sm]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDrawerOpening = () => {
    setDesktopDrawerOpen(!desktopDrawerOpen);
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <LayoutContext.Provider
        value={{
          mobileOpen,
          setMobileOpen,
          handleDrawerToggle,
          drawerWidth,
          topbarTitle,
          dynamicDrawerWidth,
          desktopDrawerOpen,
          toggleDrawerOpening,
          setDynamicDrawerWidth,
          setTopBarTitle,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <TopBar title={topbarTitle ? topbarTitle : title} />
          <ResponsiveDrawer sideNavItems={sideNavItems} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              ml: desktopDrawerOpen ? 0 : -30,
              minHeight: "99vh",
              bgcolor: "#dee1ec85",
              p: 2,
              width: {
                xs: "100%",
                // sm: `calc(100% - ${desktopDrawerOpen ? drawerWidth : 0}px)`,
                // sm: `calc(100% - ${desktopDrawerOpen ? drawerWidth : 0}px)`,
              },
            }}
          >
            <Toolbar />
            {children}
          </Box>
        </Box>
        ;
      </LayoutContext.Provider>
    </>
  );
}
