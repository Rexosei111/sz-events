import React, { useEffect, useState } from "react";
import "rsuite/dist/rsuite.min.css";
// import "../styles/globals.css";
import { Button, Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import axios from "axios";
import { Box, Paper, Stack, Typography } from "@mui/material";
import MUIButton from "@mui/material/Button";
import Image from "next/image";

export default function EventMediaForm({ setValue, setImages }) {
  const [fileList, setFileList] = React.useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [coverImage, setCoverImage] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const uploader = React.useRef();

  useEffect(() => {
    setImages(uploadedFiles);
  }, [uploadedFiles]);
  const handleSetCoverImage = () => {
    setCoverImage(previewFile);
    setValue("cover_image", previewFile.url);
  };
  const onPreview = (file) => {
    const image = uploadedFiles.find((item) => item.fileKey === file.fileKey);
    if (image) {
      setPreviewFile(image);
    }
  };

  const onRemove = (file) => {
    if (previewFile?.fileKey === file.fileKey) {
      setPreviewFile(null);
    }
    if (coverImage?.fileKey === file.fileKey) {
      setCoverImage(null);
      setValue("cover_image", null);
    }
    setUploadedFiles((prevState) => [
      ...prevState.filter((item) => item.fileKey !== file.fileKey),
    ]);
  };
  const onUpload = async (file, uploadData) => {
    try {
      const { data: uploadData } = await axios.post("/api/files", {
        name: file.blobFile.name,
        type: file.blobFile.type,
      });
      await axios.put(uploadData.url, file.blobFile, {
        headers: {
          "Content-Type": file.type,
          "Content-Length": file.size,
        },
      });
      setUploadedFiles((prevState) => [
        ...prevState,
        {
          url: process.env.NEXT_PUBLIC_BUCKET_URL + uploadData.key,
          fileKey: file.fileKey,
        },
      ]);
      // setImages(uploadedFiles);
      setPreviewFile({
        url: process.env.NEXT_PUBLIC_BUCKET_URL + uploadData.key,
        fileKey: file.fileKey,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box width={"100%"}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          width: "100%",
          height: 300,
          position: "relative",
          borderStyle: "dotted",
        }}
      >
        {previewFile === null && (
          <Stack
            height={"100%"}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="subtitle2" fontWeight={700} fontSize={15}>
              Select an image
            </Typography>
          </Stack>
        )}
        {previewFile !== null && (
          <>
            <Image
              src={previewFile.url}
              alt="event_image"
              fill
              style={{ objectFit: "cover" }}
            />
            {previewFile.fileKey !== coverImage?.fileKey && (
              <MUIButton
                onClick={handleSetCoverImage}
                variant="contained"
                sx={{
                  position: "absolute",
                  right: 20,
                  bottom: 10,
                  textTransform: "capitalize",
                }}
              >
                Set as cover image
              </MUIButton>
            )}
          </>
        )}
      </Paper>
      <Uploader
        multiple
        method="PUT"
        disableMultipart
        fileList={fileList}
        onUpload={onUpload}
        onPreview={onPreview}
        listType="picture"
        onChange={setFileList}
        onRemove={onRemove}
        ref={uploader}
        action=""
      >
        <Button>
          <CameraRetroIcon />
        </Button>
      </Uploader>
    </Box>
  );
}
