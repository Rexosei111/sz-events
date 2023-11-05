// import { s3_client } from "@/components/config/s3";
import { s3_client } from "@/config/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { name, type } = req.body;
    const extension = type.split("/")[1];
    const key = `${randomUUID()}.${extension}`;
    const command = new PutObjectCommand({
      ContentType: type,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3_client, command, { expiresIn: 600 });
    return res.status(200).json({ url, key });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
