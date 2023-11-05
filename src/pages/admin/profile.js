import EventFormWrapper from "@/components/admin/eventWrapper";
import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import LogoSelector from "@/components/admin/logoSelector";
import { OrganiserUpdateForm } from "@/components/admin/organiserUpdateForm";
import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { APIClient } from "@/utils/axios";
import { isAxiosError } from "axios";
import { fetcher } from "@/utils/swr_fetcher";
import * as yup from "yup";
import { SnackbarContext } from "../_app";
import { LoadingButton } from "@mui/lab";

const profileUpdateSchema = yup
  .object({
    name: yup.string().required(),
    summary: yup.string(),
    description: yup.string().nullable(),
    logo: yup.string().nullable(),
    // name: yup.string().required(),
  })
  .required();
export default function Profile() {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const { setTopBarTitle, topbarTitle } = useContext(LayoutContext);
  setTopBarTitle("Profile");

  const {
    data: organiser,
    error,
    isLoading,
  } = useSWR("/admins/admin/organiser", fetcher);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
  });

  useEffect(() => {
    if (organiser !== undefined) {
      reset(organiser);
    }
  }, [organiser]);
  const onSubmit = async (form_data) => {
    const final_data = { ...form_data };
    try {
      const { data } = await APIClient.patch(
        `/admins/admin/organiser`,
        final_data
      );
      setSnackSeverity("success");
      handleSnackbarOpen("Profile has been updated");
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to save event");
      }
    }
  };
  return (
    <>
      <Head>
        <title>{topbarTitle}</title>
      </Head>
      <form method="POST" action="#" onSubmit={handleSubmit(onSubmit)}>
        <EventFormWrapper
          title={"Organiser Information"}
          subtitle={
            "This section contains the basic details about the organiser"
          }
          sectionForm={
            <OrganiserUpdateForm
              register={register}
              setValue={setValue}
              errors={errors}
              organiser={organiser}
            />
          }
        />
        <EventFormWrapper
          title={"Organiser logo"}
          subtitle={
            "This section contains the basic details about the organiser"
          }
          sectionForm={<LogoSelector setValue={setValue} />}
        />
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={2}
        >
          <LoadingButton
            loading={isSubmitting}
            size="small"
            variant="contained"
            // disabled={!isValid}
            disableElevation
            sx={{ textTransform: "capitalize" }}
            type="submit"
          >
            Update
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}

Profile.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
