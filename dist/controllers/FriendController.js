"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
exports.default = {
    getFriends: async (req, res) => {
        try {
            const { userId } = req.query;
            if (!userId || typeof userId !== "string")
                return res.status(500).json({ message: "User id not provided." });
            const user = await app_1.prisma.user.findFirst({
                where: {
                    id: parseInt(userId),
                },
                select: {
                    friends: true,
                },
            });
            if (!user)
                return res.status(404).json({ message: "User not found." });
            const { friends } = user;
            if (!friends)
                return res.status(404).json({ message: "Error fetching friends." });
            return res.status(200).json(friends);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    getFriendReq: async (req, res) => {
        const { userId } = req.query;
        if (!userId || typeof userId !== "string")
            return res.status(500).json({ message: "Invalid user id" });
        try {
            const incoming = await app_1.prisma.friendRequest.findMany({
                where: {
                    friendId: parseInt(userId),
                },
                include: {
                    user: true,
                },
            });
            const outgoing = await app_1.prisma.friendRequest.findMany({
                where: {
                    userId: parseInt(userId),
                },
                include: {
                    friend: true,
                },
            });
            return res.status(200).json({
                incoming,
                outgoing,
            });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    addFriend: async (req, res) => {
        try {
            const { userId, username } = req.body;
            if (!userId || !username)
                return res
                    .status(500)
                    .json({ message: "User id and/or username not provided." });
            const friend = await app_1.prisma.user.findFirst({
                where: {
                    username,
                },
            });
            if (!friend)
                return res.status(404).json({ message: "Friend not found." });
            const friendship = await app_1.prisma.friendRequest.create({
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
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    acceptFriend: async (req, res) => {
        try {
            const { userId, friendId } = req.body;
            if (!userId || !friendId)
                return res
                    .status(418)
                    .json({ message: "User id or friend id not provided." });
            const me = await app_1.prisma.user.findFirst({
                where: { id: friendId },
                include: { friends: true },
            });
            if (!me)
                return res.status(404).json({ message: "me was not found" });
            const other = await app_1.prisma.user.findFirst({
                where: { id: userId },
                include: { friends: true },
            });
            if (!other)
                return res.status(404).json({ message: "other was not found" });
            await app_1.prisma.friendRequest.delete({
                where: {
                    userId_friendId: {
                        friendId,
                        userId,
                    },
                },
            });
            await app_1.prisma.user.update({
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
            await app_1.prisma.user.update({
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
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    removeFriend: async (req, res) => {
        try {
            const { id } = req.body;
            if (!id)
                return res.status(500).json({ message: "Friend id not provided." });
            const friend = await app_1.prisma.friendRequest.delete({
                where: {
                    id,
                },
            });
            if (!friend)
                return res.status(404).json({ message: "Friend not found." });
            return res.status(200).json();
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
};
//# sourceMappingURL=FriendController.js.map