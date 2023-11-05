import { Divider, Paper, Typography } from "@mui/material";
import React from "react";

export default function EventFormWrapper({ title, subtitle, sectionForm }) {
  return (
    <Paper variant="outlined" elevation={0} sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Typography my={1} variant="subtitle2" color={"GrayText"}>
        {subtitle}
      </Typography>
      <Divider variant="fullwidth" sx={{ my: 2 }} />
      {sectionForm}
    </Paper>
  );
}
