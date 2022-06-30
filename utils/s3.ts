import S3 from "aws-sdk/clients/s3";
import fs from "fs";

export const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const upload = (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

export const getFileStream = (fileKey: string) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.AWS_BUCKET_NAME!,
  };

  return s3.getObject(downloadParams).createReadStream();
};
