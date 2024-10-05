import React, { useContext, useState } from "react";
import { StyledInputBase, TextInputField } from "../shared/inputs";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isAxiosError } from "axios";
import {
  CheckCircle,
  Close,
  EmailOutlined,
  LocationOnOutlined,
  Person2Outlined,
  PhoneAndroidOutlined,
} from "@mui/icons-material";
import { SnackbarContext } from "@/pages/_app";
import { LoadingButton } from "@mui/lab";
import { APIClient } from "@/utils/axios";
import theme from "@/theme";
import { MuiPhone } from "../shared/phoneInput";

const attendeeSchema = yup
  .object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    phone_number: yup.string().required(),
    email: yup.string().email(),
    location: yup.string().nullable(),
    occupation: yup.string().nullable(),
    level: yup.string().nullable(),
    school: yup.string().nullable(),
    profession: yup.string().nullable(),
    other: yup.string().nullable(),
    via_whatsapp: yup.boolean().nullable(),
    by_member: yup.boolean().nullable(),
    via_instagram: yup.boolean().nullable(),
    by_friend: yup.boolean().nullable(),
    friend_name: yup.string().nullable(),
  })
  .required();

export const SuccessModal = ({ open, handleClose, event_name }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Stack height={200} alignItems={"center"} justifyContent={"center"}>
          <IconButton
            circle
            size="lg"
            icon={<CheckCircle htmlColor="green" fontSize="large" />}
          />
          <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
            You have successfully registered for <strong>{event_name}</strong>
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default function RSVPModal({
  open,
  handleClose,
  handleSuccessOpen,
  event_id,
  eventName,
}) {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    resolver: yupResolver(attendeeSchema),
  });

  const [occupation, setOccupation] = useState(null);
  const [byFriend, setByFriend] = useState(false);

  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);
    setValue("occupation", event.target.value);
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
        `users/event/${event_id}`,
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
      handleSuccessOpen();
      handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to add new attendee!");
      }
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack>
            <Typography variant="h5" color={"text.primary"}>
              {eventName}
            </Typography>
            <Typography variant="subtitle2" fontSize={13}>
              Kindly complete this form to register for this event.
            </Typography>
          </Stack>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form
          method="POST"
          action="#"
          id="rsvp-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContent>
            <Stack flexDirection={"column"} gap={2}>
              <TextInputField
                {...register("first_name")}
                variant="outlined"
                type={"text"}
                label="First name"
                error={errors.first_name ? true : false}
                helperText={
                  errors.first_name ? errors.first_name?.message : null
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person2Outlined fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: 13 },
                }}
                fullWidth
                placeholder="Enter first name here"
              />
              <TextInputField
                {...register("last_name")}
                variant="outlined"
                type={"text"}
                label="Last name"
                error={errors.last_name ? true : false}
                helperText={errors.last_name ? errors.last_name?.message : null}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person2Outlined fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: 13 },
                }}
                fullWidth
                placeholder="Enter last name here"
              />
              {/* <MuiPhone {...register("phone_number")} /> */}
              <TextInputField
                {...register("phone_number")}
                variant="outlined"
                type={"text"}
                label="Phone Number"
                error={errors.phone_number ? true : false}
                helperText={
                  errors.phone_number ? errors.phone_number?.message : null
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: 13 },
                }}
                fullWidth
                placeholder="223 00 0000 000"
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
                  style: { fontSize: 13 },
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
                  style: { fontSize: 13 },
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
                  defaultValue={""}
                  onChange={handleOccupationChange}
                >
                  <MenuItem value={"student"} sx={{ fontSize: 13 }}>
                    Student
                  </MenuItem>
                  <MenuItem value={"worker"} sx={{ fontSize: 13 }}>
                    Worker
                  </MenuItem>
                  <MenuItem value={"other"} sx={{ fontSize: 13 }}>
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
                              if (
                                !value &&
                                getValues("occupation") === "student"
                              )
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
                              if (
                                !value &&
                                getValues("occupation") === "student"
                              )
                                return "This field is required";
                              return true;
                            },
                          },
                        })}
                        error={errors.school ? true : false}
                        helperText={
                          errors.school ? errors.school?.message : null
                        }
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
                <InputLabel shrink>
                  How did you hear about this program?
                  <Typography variant="subtitle2" fontSize={13}>
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
                          fontSize: 13,
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
                          fontSize: 13,
                        },
                      }}
                    />
                    <FormControlLabel
                      {...register("via_instagram")}
                      control={<Checkbox size="small" />}
                      label="Instagram"
                      slotProps={{
                        typography: {
                          fontSize: 13,
                        },
                      }}
                    />
                    <FormControlLabel
                      {...register("by_friend")}
                      onChange={handlePublicityChange}
                      control={<Checkbox size="small" />}
                      label="referred by a friend"
                      slotProps={{
                        typography: {
                          fontSize: 13,
                        },
                      }}
                    />
                  </Stack>
                </FormGroup>

                {byFriend === true && (
                  <Box>
                    <InputLabel shrink>Name of friend</InputLabel>
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
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                color: theme.palette.primary.main,
                borderColor: theme.palette.secondary.main,
                // "&: hover": {
                //   borderColor: theme.palette.common.,
                // },
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              disableElevation
              sx={{
                textTransform: "capitalize",
                "&:hover": {
                  bgcolor: (theme) => theme.palette.primary.main,
                },
              }}
              color="primary"
              type="submit"
              form="rsvp-form"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
