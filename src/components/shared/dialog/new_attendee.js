import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { TextInputField } from "../inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  EmailOutlined,
  LocationOnOutlined,
  Person2Outlined,
  PhoneAndroidOutlined,
} from "@mui/icons-material";
import { SnackbarContext } from "@/pages/_app";
import { LoadingButton } from "@mui/lab";
import { isAxiosError } from "axios";
import { AntSwitch } from "../switches";
import { APIClient } from "@/utils/axios";
import { SecondaryButton } from "@/components/btn/baseBtn";
import { PrimaryLoadingButton } from "@/components/btn/loadingBtn";
import PhoneInput from "../phoneInput";

const attendeeSchema = yup
  .object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    phone_number: yup.string().required(),
    email: yup.string().email(),
    location: yup.string(),
    present: yup.boolean().default(false),
  })
  .required();
export default function NewAttendee({ open, handleClose, event_id, mutate }) {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    resolver: yupResolver(attendeeSchema),
  });

  const [occupation, setOccupation] = useState("Select an occupation");
  const [byFriend, setByFriend] = useState(false);
  const [firstTime, setFirstTime] = useState(null);
  const selectedOccupation = watch("occupation");

  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);
    setValue("occupation", event.target.value);
  };

  const handleFirstTimeClick = (e) => {
    const value = e.target.value === "true"; // Convert string to boolean
    setFirstTime(value);
    setValue("first_time", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const handlePublicityChange = (event) => {
    setByFriend(event.target.checked);
  };
  const onSubmit = async (form_data) => {
    if (form_data?.occupation && form_data?.occupation === "student") {
      delete form_data?.proffession;
      delete form_data?.other;
    }
    if (form_data?.occupation && form_data?.occupation === "worker") {
      delete form_data?.level;
      delete form_data?.school;
      delete form_data?.other;
    }
    if (form_data?.occupation && form_data?.occupation === "other") {
      delete form_data?.level;
      delete form_data?.school;
      delete form_data?.proffession;
    }
    try {
      const { data } = await APIClient.post(
        `/attendance/${event_id}`,
        form_data
      );
      reset({
        first_name: null,
        last_name: null,
        phone_number: null,
        email: null,
        location: null,
        present: false,
      });
      //   handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to add new attendee!");
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add new attendee to event</DialogTitle>
      <DialogContent>
        <form
          method="POST"
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          id="attendee-form"
        >
          <Stack flexDirection={"column"} gap={2}>
            <TextInputField
              {...register("first_name")}
              variant="outlined"
              type={"text"}
              label="First name"
              required
              error={errors.first_name ? true : false}
              helperText={errors.first_name ? errors.first_name?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person2Outlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 16 },
              }}
              fullWidth
              placeholder="Enter first name here"
            />
            <TextInputField
              {...register("last_name")}
              variant="outlined"
              type={"text"}
              label="Last name"
              required
              error={errors.last_name ? true : false}
              helperText={errors.last_name ? errors.last_name?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person2Outlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 16 },
              }}
              fullWidth
              placeholder="Enter last name here"
            />
            <PhoneInput
              register={register}
              errors={errors}
              setValue={setValue}
            />
            <TextInputField
              {...register("email")}
              variant="outlined"
              type={"email"}
              label="Email address"
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 16 },
              }}
              fullWidth
              placeholder="user@example.com"
            />
            <TextInputField
              {...register("location")}
              variant="outlined"
              type={"text"}
              label="Location"
              error={errors.location ? true : false}
              helperText={errors.location ? errors.location?.message : null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlined fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: 16 },
              }}
              fullWidth
              placeholder="Location of the attendee"
            />
            <Divider variant="middle" />
            <Box>
              {/* <FormControl fullWidth> */}
              <InputLabel id="occupation-select-label" shrink>
                Occupation
              </InputLabel>
              <TextInputField
                select
                labelId="occupation-id-label"
                id="occupation-id"
                fullWidth
                size="small"
                {...register("occupation")}
                name="occupation"
                // defaultValue={""
                value={occupation}
                onChange={handleOccupationChange}
              >
                <MenuItem
                  value={"Select an occupation"}
                  disabled
                  sx={{ fontSize: 16 }}
                >
                  Select an occupation
                </MenuItem>
                <MenuItem value={"student"} sx={{ fontSize: 16 }}>
                  Student
                </MenuItem>
                <MenuItem value={"worker"} sx={{ fontSize: 16 }}>
                  Worker
                </MenuItem>
                <MenuItem value={"other"} sx={{ fontSize: 16 }}>
                  Other
                </MenuItem>
              </TextInputField>
            </Box>
            <Box>
              {occupation === "student" && (
                <Stack
                  flexDirection={"row"}
                  gap={2}
                  alignItems={"center"}
                  flexWrap={{ xs: "wrap", md: "nowrap" }}
                >
                  <Box sx={{ width: { xs: "100%", md: "20%" } }}>
                    <InputLabel id="student-level-select-label" shrink>
                      level
                    </InputLabel>
                    <TextInputField
                      select
                      labelId="level-id-label"
                      id="level-id"
                      fullWidth
                      size="small"
                      name="level"
                      {...register("level", {
                        validate: {
                          require: (value) => {
                            if (!value && getValues("occupation") === "student")
                              return "This field is required";
                            return true;
                          },
                        },
                      })}
                      error={errors.level ? true : false}
                      defaultValue={"primary"}
                    >
                      <MenuItem value={"primary"}>Basic</MenuItem>
                      <MenuItem value={"Secondary"}>Secondary</MenuItem>
                      <MenuItem value={"Tertiary"}>Tertiary</MenuItem>
                    </TextInputField>
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "80%" } }}>
                    <InputLabel shrink>School</InputLabel>
                    <TextInputField
                      fullWidth
                      size="small"
                      name="school"
                      {...register("school", {
                        validate: {
                          require: (value) => {
                            if (!value && getValues("occupation") === "student")
                              return "This field is required";
                            return true;
                          },
                        },
                      })}
                      error={errors.school ? true : false}
                      helperText={errors.school ? errors.school?.message : null}
                    />
                  </Box>
                </Stack>
              )}
              {occupation === "worker" && (
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
                      {...register("profession")}
                      error={errors.profession ? true : false}
                      helperText={
                        errors.profession ? errors.profession?.message : null
                      }
                    />
                  </Box>
                </Stack>
              )}
              {occupation === "other" && (
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
                      {...register("other")}
                      error={errors.other ? true : false}
                      helperText={errors.other ? errors.other?.message : null}
                    />
                  </Box>
                </Stack>
              )}
            </Box>
            <Box width={"100%"}>
              <FormControl sx={{ width: "100%", p: 0, color: "black" }}>
                <InputLabel
                  id="demo-radio-buttons-group-label"
                  sx={{ fontSize: 16, px: 0, m: 0, color: "black" }}
                  shrink
                >
                  Is this your first time at Good Shepherd Conference?
                </InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio
                      checked={firstTime === true}
                      onChange={handleFirstTimeClick}
                      value="true"
                      name="radio-buttons"
                      inputProps={{ "aria-label": "Yes" }}
                    />
                    <span>Yes</span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio
                      checked={firstTime === false}
                      onChange={handleFirstTimeClick}
                      value="false"
                      name="radio-buttons"
                      inputProps={{ "aria-label": "No" }}
                    />
                    <span>No</span>
                  </Box>
                </Box>
              </FormControl>
            </Box>
            <Box width={"100%"}>
              <InputLabel shrink>
                How did you hear about this program?
                <Typography variant="subtitle2" fontSize={16}>
                  (Select all that apply)
                </Typography>
              </InputLabel>
              <FormGroup>
                <Stack
                  flexDirection={"row"}
                  gap={1}
                  alignItems={"center"}
                  flexWrap={{ xs: "wrap", md: "nowrap" }}
                >
                  <FormControlLabel
                    {...register("via_whatsapp")}
                    control={<Checkbox size="small" />}
                    slotProps={{
                      typography: {
                        fontSize: 16,
                      },
                    }}
                    label="Whatsapp"
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label="Member"
                    {...register("by_member")}
                    slotProps={{
                      typography: {
                        fontSize: 16,
                      },
                    }}
                  />
                  <FormControlLabel
                    {...register("via_instagram")}
                    control={<Checkbox size="small" />}
                    label="Instagram"
                    slotProps={{
                      typography: {
                        fontSize: 16,
                      },
                    }}
                  />
                  <FormControlLabel
                    {...register("by_friend")}
                    onChange={handlePublicityChange}
                    control={<Checkbox size="small" />}
                    label="Invited by someone"
                    slotProps={{
                      typography: {
                        fontSize: 16,
                      },
                    }}
                  />
                </Stack>
              </FormGroup>

              {byFriend === true && (
                <Box>
                  <InputLabel shrink>Name of person who invited you</InputLabel>
                  <TextInputField
                    fullWidth
                    size="small"
                    name="friend name"
                    {...register("friend_name")}
                    error={errors.friend_name ? true : false}
                    helperText={
                      errors.friend_name ? errors.friend_name?.message : null
                    }
                  />
                </Box>
              )}
            </Box>
          </Stack>
          <Box>
            <div>
              <FormControlLabel
                control={<AntSwitch {...register("present")} sx={{ m: 1 }} />}
                label="is attendee present?"
                componentsProps={{
                  typography: {
                    fontSize: 13,
                  },
                }}
              />
            </div>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          variant="outlined"
          onClick={handleClose}
          disableElevation
        >
          Close
        </SecondaryButton>
        <PrimaryLoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          variant="contained"
          type="submit"
          form="attendee-form"
          disableElevation
        >
          Submit
        </PrimaryLoadingButton>
      </DialogActions>
    </Dialog>
  );
}
