import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, InputLabel, Stack } from "@mui/material";
import { TextInputField } from "../shared/inputs";

export default function BasicAccordion({ attendee }) {
  return (
    <Accordion
      sx={{ bgcolor: "transparent", p: 0 }}
      elevation={0}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>View more</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {attendee && attendee?.occupation === "student" && (
          <Stack
            flexDirection={"row"}
            gap={2}
            alignItems={"center"}
            flexWrap={{ xs: "wrap", md: "nowrap" }}
          >
            <Box sx={{ width: { xs: "100%", md: "20%" } }}>
              <InputLabel id="student-level-select-label" shrink>
                Occupation
              </InputLabel>
              <TextInputField
                fullWidth
                size="small"
                disabled
                name="Occupation"
                value={attendee?.occupation}
                InputProps={{
                  style: {
                    fontSize: 13,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "20%" } }}>
              <InputLabel id="student-level-select-label" shrink>
                level
              </InputLabel>
              <TextInputField
                fullWidth
                size="small"
                name="leve"
                disabled
                value={attendee?.level}
                InputProps={{
                  style: {
                    fontSize: 13,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "80%" } }}>
              <InputLabel shrink>School</InputLabel>
              <TextInputField
                fullWidth
                size="small"
                disabled
                name="school"
                value={attendee?.school}
              />
            </Box>
          </Stack>
        )}
        {attendee && attendee?.occupation === "worker" && (
          <Stack
            flexDirection={"row"}
            gap={2}
            alignItems={"center"}
            flexWrap={{ xs: "wrap", md: "nowrap" }}
          >
            <Box sx={{ width: { xs: "100%" } }}>
              <InputLabel shrink>Profession</InputLabel>
              <TextInputField
                fullWidth
                size="small"
                name="profession"
                disabled
                value={attendee?.profession}
              />
            </Box>
          </Stack>
        )}
        {attendee && attendee?.occupation === "other" && (
          <Stack
            flexDirection={"row"}
            gap={2}
            alignItems={"center"}
            flexWrap={{ xs: "wrap", md: "nowrap" }}
          >
            <Box sx={{ width: { xs: "100%" } }}>
              <InputLabel shrink>Tell us</InputLabel>
              <TextInputField
                fullWidth
                size="small"
                name="other"
                disabled
                value={attendee?.other}
              />
            </Box>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
