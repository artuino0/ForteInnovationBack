import { env } from "@/config/envLoad";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3 = new S3Client({
  region: env.AWS.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: env.AWS.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadToS3 = async (
  bucketName: string,
  key: string,
  data: Buffer,
  contentType: string
): Promise<string> => {
  try {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
        ACL: "public-read",
      },
    });

    await upload.done();

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return fileUrl;
  } catch (error) {
    console.error("Error al subir a S3:", error);
    throw error;
  }
};
