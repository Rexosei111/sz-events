import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import parse from "autosuggest-highlight/parse";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function LocationSearchInput({ error, onAddressSelect }) {
  const [inputValue, setInputValue] = React.useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "gh" } },
    debounce: 300,
    cache: 3600,
  });

  return (
    <Stack direction={"row"} justifyContent={"space-between"} flexWrap={"wrap"}>
      <Autocomplete
        id="google-map-demo"
        sx={{ width: { xs: "100%", md: "50%" } }}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        filterOptions={(x) => x}
        options={data}
        freeSolo
        includeInputInList
        filterSelectedOptions
        value={selectedLocation}
        noOptionsText="No locations"
        onChange={(event, newValue) => {
          setSelectedLocation(newValue);
          onAddressSelect(newValue);
          clearSuggestions();
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          setValue(inputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error ? "This field is required" : null}
            size="small"
            disabled={!ready}
            label="Select a location"
            fullWidth
          />
        )}
        renderOption={(props, option) => {
          const matches =
            option.structured_formatting.main_text_matched_substrings || [];

          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match) => [match.offset, match.offset + match.length])
          );

          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Grid item sx={{ display: "flex", width: 44 }}>
                  <LocationOnIcon sx={{ color: "text.secondary" }} />
                </Grid>
                <Grid
                  item
                  sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
                >
                  {parts.map((part, index) => (
                    <Box
                      key={index}
                      component="span"
                      sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                    >
                      {part.text}
                    </Box>
                  ))}

                  <Typography variant="body2" color="text.secondary">
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
      <Typography variant="subtitle2" color={"GrayText"}>
        This is the location where the event will be held
      </Typography>
    </Stack>
  );
}

//   const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
//   export default function SearchBar() {
//     const [rncps, setRncps] = useState([]);
//     const [error, setError] = useState(false);

//     const handleChange = debounce(async (event) => {
//       try {
//         const { data } = await axios.get(
//           `${base_url}private/api/fiches/search?q=${event.target.value}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setRncps(data);
//       } catch (e) {
//         console.log(e);
//       }
//     }, 500);

//     const handleSubmit = (event) => {
//       setError(false);
//       event.preventDefault();
//       const formData = new FormData(event.target);
//       if (!formData.get("search")) {
//         setError(true);
//       }
//       router.push("/fiches/" + formData.get("search"));
//     };
//     console.log(suggestions)
//     return (
//       <Autocomplete
//         freeSolo
//         options={rncp}
//         filterOptions={(x) => x}
//         renderInput={(params) => (
//         //   <Paper
//         //     sx={{ p: 1 }}
//         //     my={4}
//         //     elevation={20}
//         //     component={"form"}
//         //     method="GET"
//         //     onSubmit={handleSubmit}
//         //     action="#"
//         //   >
//             <TextField
//               {...params}
//               variant="outlined"
//               name="search for place"
//               onChange={(e) => setValue(e.target.value)}
//               focused
//               error={error}
//               placeholder="Accra"
//               InputProps={{
//                 ...params.InputProps,
//                 type: "search",
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 )
//               }}
//             />
//         //   </Paper>
//         )}
//       />
//     );
//   }
