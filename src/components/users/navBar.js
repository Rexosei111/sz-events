import { Navbar, Nav } from "rsuite";
import useSWR from "swr";
import { fetcher } from "@/utils/swr_fetcher";
import { Avatar, Box, IconButton, useMediaQuery } from "@mui/material";
import useToken from "@/hooks/token";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import Image from "next/image";

const CustomNavItem = ({ ...props }) => {
  return (
    <Nav.Item
      eventKey="3"
      href="/users/me/following"
      style={{
        color: theme.palette.text.primary,
      }}
      onClick={handleNavigation}
    >
      Following
    </Nav.Item>
  );
};

export const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
  const {
    data: me,
    error,
    isLoading,
  } = useSWR("/users/me", fetcher, { refreshInterval: 1000 * 30 });
  const [token, setToken] = useToken("szevent_token");
  const router = useRouter();
  const handleLogout = () => {
    setToken(null);
    router.push("/auth/users");
  };

  const handleNavigation = (event, url = null) => {
    event.preventDefault();
    if (url !== null) {
      router.push(url);
    } else {
      router.push(event.target?.href ?? "/events");
    }
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Navbar {...props}>
      <Navbar.Brand
        href="/events"
        onClick={handleNavigation}
        style={{ color: theme.palette.text.primary, fontWeight: 700 }}
      >
        <Image src={"/logo.png"} width={30} height={30} alt="Logo" />
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        {!matches && (
          <Nav.Item
            eventKey="3"
            href="/users/me/following"
            style={{
              color: theme.palette.text.primary,
              ":hover": { backgroundColor: "green" },
            }}
            onClick={handleNavigation}
          >
            Following
          </Nav.Item>
        )}
      </Nav>
      <Nav pullRight>
        {me !== undefined && (
          <Nav.Menu
            icon={
              <IconButton>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: (theme) => theme.palette.common.black,
                    color: (theme) => theme.palette.common.white,
                  }}
                >
                  {me?.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            }
          >
            <Nav.Item
              eventKey="4"
              onClick={handleLogout}
              style={{ color: theme.palette.text.primary }}
            >
              Log out
            </Nav.Item>
            {matches && (
              <Nav.Item
                eventKey="3"
                href="/users/me/following"
                style={{ color: theme.palette.text.primary, fontWeight: 700 }}
                onClick={(event) =>
                  handleNavigation(event, "/users/me/following")
                }
              >
                Following
              </Nav.Item>
            )}
          </Nav.Menu>
        )}
        {me === undefined && (
          <>
            <Nav.Item
              eventKey="5"
              href="/auth/users"
              onClick={handleNavigation}
              style={{ color: theme.palette.text.primary, fontWeight: 700 }}
            >
              Log in
            </Nav.Item>
            <Nav.Item
              eventKey="6"
              href="/auth/register"
              style={{ color: theme.palette.text.primary, fontWeight: 700 }}
              onClick={handleNavigation}
            >
              Sign up
            </Nav.Item>
          </>
        )}
      </Nav>
    </Navbar>
  );
};
