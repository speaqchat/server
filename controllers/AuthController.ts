import { User } from "@prisma/client";
import bcrypt, { genSalt } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "../src/app";
import { validPassword } from "../utils/validatePassword";

const jwtSign = (user: User) => {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return sign(user, process.env.SECRET!, {
    expiresIn: ONE_WEEK,
  });
};

export default {
  signup: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password)
        return res.status(401).json("Missing credentials.");

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: await bcrypt.hash(password, await genSalt(7)),
        },
      });

      if (!user)
        return res.status(500).json({ message: "Error creating user." });

      return res.status(200).json({ user: user, token: jwtSign(user) });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(401).json("Missing credentials.");

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user)
        return res.status(401).json({ message: "Error finding user." });

      if (!(await validPassword(password, user.password)))
        return res.status(401).json({ message: "Unauthorized." });

      return res.status(200).json({ user: user, token: jwtSign(user) });
    } catch (err) {
      return res.status(401).json(err);
    }
  },
};
