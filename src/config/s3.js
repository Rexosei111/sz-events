import { S3, S3Client } from "@aws-sdk/client-s3";

export const s3_client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  signatureVersion: "v4",
  credentials: {
    accessKeyId: process.env.MYAWS_ACCESS_KEY,
    secretAccessKey: process.env.MYAWS_SECRET_KEY,
  },
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
