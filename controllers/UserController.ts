import { Request, Response } from "express";
import sharp from "sharp";
import { prisma } from "../src/app";
import { upload, getFileStream } from "../utils/s3";

export default {
  picture: async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No file provided" });

      // const result = await upload(file);

      //crop image to square with sharp
      const image = await sharp(file.path).resize(256, 256).toBuffer();

      //upload cropped image to s3
      const croppedResult = await upload({
        filename: file.filename,
        mimetype: file.mimetype,
        data: image,
      });

      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (!parsedId) return res.status(401).json("Missing ID.");

      const user = await prisma.user.update({
        where: {
          id: parsedId,
        },
        data: {
          profilePicture: croppedResult.Key,
        },
      });

      if (!user)
        return res.status(500).json({ message: "Error finding user." });

      const fileStream = getFileStream(croppedResult.Key);

      return fileStream.pipe(res);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getPicture: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (!parsedId) return res.status(401).json("Missing ID.");

      const user = await prisma.user.findUnique({
        where: {
          id: parsedId,
        },
      });

      if (!user)
        return res.status(500).json({ message: "Error finding user." });

      if (!user.profilePicture) return res.status(200).json(null);

      const fileStream = getFileStream(user.profilePicture);
      return fileStream.pipe(res);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
