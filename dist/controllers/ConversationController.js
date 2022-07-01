"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
exports.default = {
    getConversations: async (req, res) => {
        try {
            const { userId } = req.query;
            if (!userId || typeof userId !== "string")
                return res.status(500).json({ message: "No user id provided." });
            const conversations = await app_1.prisma.user.findFirst({
                where: {
                    id: parseInt(userId),
                },
                select: {
                    userConversation: {
                        include: {
                            friend: true,
                            user: true,
                        },
                    },
                    friendConversation: {
                        include: {
                            friend: true,
                            user: true,
                        },
                    },
                },
            });
            if (!conversations)
                return res.status(404).json({ message: "No conversations found." });
            const convs = [
                ...conversations.friendConversation.concat(...conversations.userConversation),
            ];
            if (conversations)
                return res.status(200).json(convs);
            return res.status(400).json({ message: "No conversations found." });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    newConversation: async (req, res) => {
        try {
            const { userId, friendId } = req.body;
            if (!userId || !friendId)
                return res
                    .status(500)
                    .json({ message: "No user id or friend id provided." });
            const conversation = await app_1.prisma.conversation.create({
                data: {
                    userId: userId,
                    friendId: friendId,
                },
            });
            if (!conversation)
                res.status(400).json({ message: "Conversation not found." });
            return res.status(200).json(conversation);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
};
//# sourceMappingURL=ConversationController.js.map