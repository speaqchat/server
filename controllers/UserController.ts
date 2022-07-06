import { Request, Response } from "express";
import { prisma } from "../src/app";
import { upload, getFileStream } from "../utils/s3";
import sharp from "sharp";

export default {
  picture: async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) return;

      const croppedFile = await sharp(file.buffer).resize(200).toBuffer();

      const result = await upload(croppedFile);

      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (!parsedId) return res.status(401).json("Missing ID.");

      const user = await prisma.user.update({
        where: {
          id: parsedId,
        },
        data: {
          profilePicture: result.Key,
        },
      });

      if (!user)
        return res.status(500).json({ message: "Error finding user." });

      const fileStream = getFileStream(result.Key);

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
