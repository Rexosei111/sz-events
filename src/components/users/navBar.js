import { Navbar, Nav, Avatar, IconButton } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import CogIcon from "@rsuite/icons/legacy/Cog";
import useSWR from "swr";
import { fetcher } from "@/utils/swr_fetcher";
import { Box, useMediaQuery } from "@mui/material";
import useToken from "@/hooks/token";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";

export const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
  const { data: me, error, isLoading } = useSWR("/users/me", fetcher);
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
      router.push(event.target?.href);
    }
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Navbar {...props} style={{ backgroundColor: "transparent" }}>
      <Navbar.Brand
        href="/events"
        onClick={handleNavigation}
        style={{ color: "#ffffff" }}
      >
        SZ Event
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item
          eventKey="2"
          href="/events"
          onClick={handleNavigation}
          style={{ color: "#ffffff" }}
        >
          Find events
        </Nav.Item>
        {!matches && (
          <Nav.Item
            eventKey="3"
            href="/users/me/following"
            style={{
              color: "#ffffff",
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
              <IconButton
                size="xs"
                // color="#000"
                icon={
                  <Avatar style={{ background: "#000" }}>
                    {me?.email.charAt(0).toUpperCase()}
                  </Avatar>
                }
              />
            }
          >
            <Nav.Item
              eventKey="4"
              onClick={handleLogout}
              style={{ color: "#ffffff" }}
            >
              Logout
            </Nav.Item>
            {matches && (
              <Nav.Item
                eventKey="3"
                href="/users/me/following"
                style={{ color: "#ffffff" }}
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
              style={{ color: "#ffffff" }}
            >
              Login
            </Nav.Item>
            <Nav.Item
              eventKey="6"
              href="/auth/register"
              style={{ color: "#ffffff" }}
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
