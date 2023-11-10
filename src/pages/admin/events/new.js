import EventBasicForm from "@/components/admin/eventBasicForm";
import EventFormWrapper from "@/components/admin/eventWrapper";
import AdminLayout from "@/components/admin/layout";
import Head from "next/head";
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import EventMediaForm from "@/components/admin/eventMediaForm";
import EventLocationForm from "@/components/admin/eventLocation";
import { Stack } from "@mui/material";
import { APIClient } from "@/utils/axios";
import { isAxiosError } from "axios";
import { SnackbarContext } from "@/pages/_app";
import { useRouter } from "next/router";
import {
  PrimaryLoadingButton,
  SecondaryLoadingButton,
} from "@/components/btn/loadingBtn";

const newEventFormSchema = yup
  .object({
    name: yup.string().required(),
    summary: yup.string().nullable(),
    description: yup.string().nullable(),
    start_date: yup.string().nullable(),
    cover_image: yup.string().nullable(),
    address: yup.string().nullable(),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
  })
  .required();

export default function New() {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(newEventFormSchema),
  });

  const [eventImage, setEventImages] = useState([]);
  const [publish, setPublish] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const handlePublish = (e) => {
    setPublish(true);
  };

  const handleDraft = (e) => {
    setPublish(false);
  };
  const onSubmit = async (form_data) => {
    if (publish === true) {
      setPublishing(true);
    } else {
      setDrafting(true);
    }
    const final_data = { ...form_data, images: eventImage, published: publish };
    try {
      const { data } = await APIClient.post(`events/`, final_data);
      router.push(`/admin/events/${data.id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        setSnackSeverity("error");
        handleSnackbarOpen("All required fields must be field!");
      }
    } finally {
      setPublishing(false);
      setDrafting(false);
    }
  };
  return (
    <>
      <Head>
        <title>Add New Event</title>
      </Head>
      <form method="POST" action="#" onSubmit={handleSubmit(onSubmit)}>
        <EventFormWrapper
          title={"Basic details"}
          subtitle={"This section contains the basic details about the event"}
          sectionForm={
            <EventBasicForm
              setValue={setValue}
              errors={errors}
              getValues={getValues}
              register={register}
            />
          }
        />

        <EventFormWrapper
          title={"Event Media"}
          subtitle={
            "This section contains the media information about the event including the cover image"
          }
          sectionForm={
            <EventMediaForm
              setValue={setValue}
              setImages={setEventImages}
              errors={errors}
              getValues={getValues}
              register={register}
            />
          }
        />

        <EventFormWrapper
          title={"Location Details"}
          subtitle={
            "This section contains details of the location for hosting the event."
          }
          sectionForm={
            <EventLocationForm
              setValue={setValue}
              errors={errors}
              getValues={getValues}
              register={register}
            />
          }
        />
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={2}
        >
          <SecondaryLoadingButton
            loading={drafting}
            onClick={handleDraft}
            variant="outlined"
            disableElevation
            type="submit"
          >
            Save as draft
          </SecondaryLoadingButton>
          <PrimaryLoadingButton
            onClick={handlePublish}
            loading={publishing}
            variant="contained"
            disableElevation
            type="submit"
          >
            Publish
          </PrimaryLoadingButton>
        </Stack>
      </form>
    </>
  );
}
New.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
