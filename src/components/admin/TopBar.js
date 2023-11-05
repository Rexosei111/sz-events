import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useContext } from "react";
import { LayoutContext } from "./layout";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@emotion/react";
import useSWR from "swr";
import { fetcher } from "@/utils/swr_fetcher";
import { useRouter } from "next/router";
import Link from "next/link";

const settings = [
  { name: "Profile", url: "/admin/profile" },
  { name: "Logout", url: "/auth/admins" },
];
export default function TopBar() {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting = null) => {
    setAnchorElUser(null);
  };

  const {
    mobileOpen,
    setMobileOpen,
    handleDrawerToggle,
    drawerWidth,
    dynamicDrawerWidth,
    setDynamicDrawerWidth,
    toggleDrawerOpening,
    desktopDrawerOpen,
    topbarTitle,
  } = useContext(LayoutContext);
  const theme = useTheme();
  const below_md = useMediaQuery(theme.breakpoints.down("md"));

  const { data, error, isLoading } = useSWR("/admins/me", fetcher);
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${desktopDrawerOpen ? drawerWidth : 0}px)` },
        ml: { sm: `${desktopDrawerOpen ? drawerWidth : 0}px` },
        bgcolor: "white",
        color: (theme) => theme.palette.text.primary,
      }}
      elevation={2}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={below_md ? handleDrawerToggle : toggleDrawerOpening}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box flexGrow={1}>
          <Typography
            variant="h6"
            textAlign={"center"}
            textOverflow={"ellipsis"}
            noWrap
            component="div"
          >
            {topbarTitle}
          </Typography>
        </Box>
        {data && (
          <Box
            sx={{
              flexGrow: 0,
              // minWidth: { xs: "100%", md: 130 },
            }}
          >
            <Tooltip title="Open settings">
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                // justifyContent={"flex-end"}
                gap={{ xs: 0, md: 1 }}
                onClick={handleOpenUserMenu}
                width={"100%"}
              >
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={`${data?.first_name} ${data?.last_name}`}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
                <Typography
                  variant="subtitle2"
                  fontSize={13}
                  sx={{ display: { xs: "none", md: "block" } }}
                >{`${data?.first_name} ${data?.last_name}`}</Typography>
              </Stack>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  component={Link}
                  sx={{
                    textDecoration: "none",
                  }}
                  // LinkComponent={Link}
                  href={setting.url}
                  key={setting.name}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      textDecoration: "none",
                    }}
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
