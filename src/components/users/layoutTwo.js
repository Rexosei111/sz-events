import { Box, Container, Stack, useMediaQuery } from "@mui/material";
import Head from "next/head";
import React, { createContext } from "react";
import { CustomNavbar } from "./navBar";
import { IconButton } from "rsuite";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import UsersAppBar from "./topBar";

export const UserLayoutContext = createContext(null);

export default function LayoutTwo({ children }) {
  const [activeKey, setActiveKey] = React.useState(null);
  const router = useRouter();

  const handePreviousPage = () => {
    router.back();
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box bgcolor={"background.default"}>
      <Head>
        <title></title>
      </Head>
      <UserLayoutContext.Provider value={{}}>
        <Container
          maxWidth={"md"}
          disableGutters={matches ? true : false}
          sx={{ py: 0, bgcolor: "background.default" }}
        >
          <CustomNavbar
            appearance="subtle"
            activeKey={activeKey}
            onSelect={setActiveKey}
          />
          {/* <Stack flexDirection={"row"} justifyContent={"flex-start"}>
            <IconButton
              icon={<ArrowBack fontSize="small" />}
              onClick={handePreviousPage}
            />
          </Stack> */}
          {/* <UsersAppBar /> */}
          <Box sx={{ display: "flex" }}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                minHeight: "99vh",
                //   bgcolor: "#dee1ec85",
                px: 0,
                width: {
                  xs: "100%",
                  // sm: `calc(100% - ${desktopDrawerOpen ? drawerWidth : 0}px)`,
                  // sm: `calc(100% - ${desktopDrawerOpen ? drawerWidth : 0}px)`,
                },
              }}
            >
              {children}
            </Box>
          </Box>
        </Container>
        ;
      </UserLayoutContext.Provider>
    </Box>
  );
}
