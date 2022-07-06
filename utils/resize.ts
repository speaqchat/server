import fs from "fs";
import sharp from "sharp";

export const resize = (
  path: fs.PathLike,
  format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo,
  width: number | null | undefined,
  height: number | null | undefined
) => {
  const readStream = fs.createReadStream(path);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.pipe(transform);
};
