import { Box, Container, Skeleton, Stack } from "@mui/material";
import React from "react";

export default function EventDetailLoading() {
  return (
    <Container maxWidth={"md"} sx={{ mt: 3 }}>
      <Stack
        flexDirection={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
      >
        <Skeleton variant="rectangular" width={"100%"} height={50} />
      </Stack>

      <Stack
        flexDirection={"row"}
        gap={{ xs: 1, sm: 2 }}
        alignItems={"center"}
        mt={2}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
      >
        <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
          <Skeleton variant="rectangular" width={100} height={30} />
        </Stack>
        <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
          <Skeleton variant="rectangular" width={100} height={30} />
        </Stack>
      </Stack>
      <Box mt={2}>
        <Skeleton variant="rectangular" width={"100%"} height={250} />
      </Box>
      <Box mt={2}>
        <Skeleton variant="text" width={"100%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Box>
    </Container>
  );
}
