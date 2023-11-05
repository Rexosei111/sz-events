import EventBasicForm, {
  EventEditBasicForm,
} from "@/components/admin/eventBasicForm";
import EventFormWrapper from "@/components/admin/eventWrapper";
import AdminLayout, { LayoutContext } from "@/components/admin/layout";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
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
import useSWR from "swr";
import { fetcher } from "@/utils/swr_fetcher";
import { mutate } from "swr";

const eventEditSchema = yup
  .object({
    name: yup.string().required(),
    summary: yup.string(),
    description: yup.string(),
    start_date: yup.string(),
    cover_image: yup.string(),
    address: yup.string(),
    latitude: yup.string(),
    longitude: yup.string(),
    // name: yup.string().required(),
  })
  .required();

export default function EventEditPage() {
  const { handleOpen: handleSnackbarOpen, setSnackSeverity } =
    useContext(SnackbarContext);
  const { setTopBarTitle } = useContext(LayoutContext);

  const router = useRouter();
  const {
    data: event,
    error,
    isLoading,
  } = useSWR("events/" + router.query.id, fetcher);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,

    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(eventEditSchema),
  });

  useEffect(() => {
    if (event !== undefined) {
      reset(event);
      setTopBarTitle(event?.name);
    } else {
      reset({});
    }
  }, [event]);
  const [eventImage, setEventImages] = useState([]);
  const [publish, setPublish] = useState(false);

  const handlePublish = (e) => {
    setPublish(true);
  };

  const handleDraft = (e) => {
    setPublish(false);
  };
  const onSubmit = async (form_data) => {
    const final_data = { ...form_data, images: eventImage, published: publish };
    try {
      const { data } = await APIClient.patch(`events/${event.id}`, final_data);
      mutate(`/admin/events/${event.id}`, data);
      router.push(`/admin/events/${event.id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        setSnackSeverity("error");
        handleSnackbarOpen("Unable to save event");
      }
    }
  };
  return (
    <>
      <Head>
        <title>Update Event</title>
      </Head>
      <form method="POST" action="#" onSubmit={handleSubmit(onSubmit)}>
        <EventFormWrapper
          title={"Basic details"}
          subtitle={"This section contains the basic details about the event"}
          sectionForm={
            <EventEditBasicForm
              setValue={setValue}
              errors={errors}
              getValues={getValues}
              register={register}
              event={event}
            />
          }
        />

        {/* <EventFormWrapper
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
        /> */}

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
              event={event}
              edit={true}
            />
          }
        />
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={2}
        >
          <LoadingButton
            // loading={loading}
            onClick={handleDraft}
            size="small"
            variant="outlined"
            // disabled={saved}
            disableElevation
            sx={{ textTransform: "capitalize" }}
            // sx={{ ml: "auto" }}
            type="submit"
          >
            Save as draft
          </LoadingButton>
          <LoadingButton
            onClick={handlePublish}
            loading={isSubmitting}
            size="small"
            variant="contained"
            // disabled={!isValid}
            disableElevation
            sx={{ textTransform: "capitalize" }}
            type="submit"
          >
            Publish
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}
EventEditPage.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
