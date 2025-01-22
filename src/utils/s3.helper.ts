import { env } from "@/config/envLoad";
import AWS from "aws-sdk";
import { Readable } from "stream";

const s3 = new AWS.S3({
  accessKeyId: env.AWS.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS.AWS_SECRET_ACCESS_KEY,
  region: env.AWS.AWS_REGION,
});

export const uploadToS3 = async (
  bucketName: string,
  key: string,
  data: Buffer | Readable,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: data,
    ContentType: contentType,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};
