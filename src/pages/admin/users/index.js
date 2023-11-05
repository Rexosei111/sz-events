import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import UsersTable from "@/components/admin/usersTable";
import NewUser from "@/components/shared/dialog/newUser";
import UpdateUser from "@/components/shared/dialog/updateUser";
import { StyledInputBase, TextInputField } from "@/components/shared/inputs";
import useDebounce from "@/hooks/debounce";
import { fetcher } from "@/utils/swr_fetcher";
import { SearchOutlined } from "@mui/icons-material";
import {
  Button,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import React, { useContext, useState } from "react";
import useSWR from "swr";

const NoUser = () => {
  return (
    <Stack alignItems={"center"} justifyContent={"center"} height={200}>
      <Typography variant="h6" textAlign={"center"}>
        You are currently the only Admin
      </Typography>
    </Stack>
  );
};
export default function AdminUsers() {
  const { setTopBarTitle, topbarTitle } = useContext(LayoutContext);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [selectedUserOpen, setSelectedUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 700);
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };
  const handleUserOpen = () => {
    setNewUserOpen(!newUserOpen);
  };

  const handleSelecetedUserOpen = () => {
    setSelectedUserOpen(!selectedUserOpen);
  };
  setTopBarTitle("Admin Users");
  const {
    data: users,
    error,
    isLoading,
  } = useSWR(`admins/admin/admins?query=${debounceQuery}`, fetcher);
  return (
    <>
      <Head>
        <title>{topbarTitle}</title>
      </Head>
      <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
        <Typography variant="h5" fontSize={21} fontWeight={700}>
          Users
        </Typography>
        <Stack
          flexDirection={"row"}
          gap={2}
          my={2}
          flexWrap={{ xs: "wrap-reverse", md: "nowrap" }}
        >
          <TextInputField
            variant="outlined"
            size="small"
            placeholder="Search users"
            onChange={handleQueryChange}
            sx={{
              minWidth: { xs: "100%", md: 270 },
              bgcolor: (theme) => theme.palette.background.paper,
            }}
          />
          <Button
            disableElevation
            onClick={handleUserOpen}
            sx={{ textTransform: "capitalize", ml: "auto" }}
            variant="contained"
            color="secondary"
          >
            Add user
          </Button>
        </Stack>
        {!isLoading && users && users.items.length === 0 && <NoUser />}
        {!isLoading && users && users.items.length > 0 && (
          <UsersTable
            users={users.items}
            setSelectedUser={setSelectedUser}
            setSelectedUserOpen={setSelectedUserOpen}
          />
        )}
      </Paper>
      <NewUser open={newUserOpen} handleClose={handleUserOpen} />
      <UpdateUser
        open={selectedUserOpen}
        handleClose={handleSelecetedUserOpen}
        user={selectedUser}
      />
    </>
  );
}

AdminUsers.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
