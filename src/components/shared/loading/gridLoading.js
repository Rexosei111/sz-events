import { Grid, Skeleton } from "@mui/material";
import React from "react";

export default function GridLoading() {
  return (
    <Grid
      container
      rowSpacing={3}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      width={"100%"}
    >
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="text" width={"80%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="text" width={"80%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="text" width={"80%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="text" width={"80%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="text" width={"80%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Skeleton variant="rectangular" width={"100%"} height={200} />
        <Skeleton variant="text" width={"80%"} height={30} />
        <Skeleton variant="text" width={"100%"} height={30} />
      </Grid>
    </Grid>
  );
}
