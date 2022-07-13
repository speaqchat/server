import { Request, Response } from "express";
import { prisma } from "../src/app";

export default {
  getFriends: async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string")
        return res.status(500).json({ message: "User id not provided." });

      const user = await prisma.user.findFirst({
        where: {
          id: parseInt(userId),
        },
        select: {
          friends: true,
        },
      });

      if (!user) return res.status(404).json({ message: "User not found." });

      const { friends } = user;

      if (!friends)
        return res.status(404).json({ message: "Error fetching friends." });

      return res.status(200).json(friends);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getFriendReq: async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string")
      return res.status(500).json({ message: "Invalid user id" });

    try {
      const incoming = await prisma.friendRequest.findMany({
        where: {
          friendId: parseInt(userId),
        },
        include: {
          user: true,
        },
      });

      const outgoing = await prisma.friendRequest.findMany({
        where: {
          userId: parseInt(userId),
        },
        include: {
          friend: true,
        },
      });

      // const filteredFriendReq = friendReq.map((fr) => {
      //   return fr.friendId === parseInt(userId)
      //     ? { ...fr, incoming: true }
      //     : { ...fr, incoming: false };
      // });

      // console.log(filteredFriendReq);

      return res.status(200).json({
        incoming,
        outgoing,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  addFriend: async (req: Request, res: Response) => {
    try {
      const { userId, username } = req.body;

      if (!userId || !username)
        return res
          .status(500)
          .json({ message: "User id and/or username not provided." });

      const friend = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!friend)
        return res.status(404).json({ message: "Friend not found." });

      if (friend.id === parseInt(userId))
        return res.status(400).json({ message: "You can't add yourself." });

      // check if friend request already exists
      const friendReq = await prisma.friendRequest.findMany({
        where: {
          userId: userId,
          friendId: friend.id,
        },
      });

      const friendReq2 = await prisma.friendRequest.findMany({
        where: {
          userId: friend.id,
          friendId: userId,
        },
      });

      const user1Friends = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          friends: true,
        },
      });

      const user2Friends = await prisma.user.findFirst({
        where: {
          id: friend.id,
        },
        select: {
          friends: true,
        },
      });

      if (user1Friends?.friends.find((f) => f.id === friend.id)) {
        return res.status(400).json({ message: "Already friends." });
      }

      if (user2Friends?.friends.find((f) => f.id === userId)) {
        return res.status(400).json({ message: "Already friends." });
      }

      if (friendReq.length > 0 || friendReq2.length > 0)
        return res
          .status(400)
          .json({ message: "Friend request already exists." });

      const friendship = await prisma.friendRequest.create({
        data: {
          userId: userId,
          friendId: friend.id,
        },
      });

      if (!friendship)
        return res
          .status(404)
          .json({ message: "Friendship couldn't be created." });

      return res.status(200).json(friendship);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  acceptFriend: async (req: Request, res: Response) => {
    try {
      const { userId, friendId } = req.body;

      if (!userId || !friendId)
        return res
          .status(418)
          .json({ message: "User id or friend id not provided." });

      const me = await prisma.user.findFirst({
        where: { id: friendId },
        include: { friends: true },
      });

      if (!me) return res.status(404).json({ message: "me was not found" });

      const other = await prisma.user.findFirst({
        where: { id: userId },
        include: { friends: true },
      });

      if (!other)
        return res.status(404).json({ message: "other was not found" });

      await prisma.friendRequest.delete({
        where: {
          userId_friendId: {
            friendId,
            userId,
          },
        },
      });

      await prisma.user.update({
        where: { id: me.id },
        data: {
          friends: {
            set: [
              ...me.friends.map((i) => {
                return { id: i.id };
              }),
              { id: other.id },
            ],
          },
        },
      });

      await prisma.user.update({
        where: { id: other.id },
        data: {
          friends: {
            set: [
              ...other.friends.map((i) => {
                return { id: i.id };
              }),
              { id: me.id },
            ],
          },
        },
      });

      return res.status(200).json({ message: "Success" });
    } catch (err) {
      console.log(err);

      return res.status(500).json(err);
    }
  },
  removeFriend: async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      if (!id)
        return res.status(500).json({ message: "Friend id not provided." });

      const friend = await prisma.friendRequest.delete({
        where: {
          id,
        },
      });

      if (!friend)
        return res.status(404).json({ message: "Friend not found." });

      return res.status(200).json();
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
