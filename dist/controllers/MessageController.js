"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
exports.default = {
    getMessages: async (req, res) => {
        try {
            const { conversationId } = req.query;
            if (!conversationId && typeof conversationId !== "string")
                return res
                    .status(500)
                    .json({ message: "Conversation id not provided." });
            const messages = await app_1.prisma.message.findMany({
                where: {
                    conversationId: parseInt(conversationId),
                },
                include: {
                    conversation: true,
                    sender: true,
                },
            });
            if (!messages)
                return res.status(404).json({ message: "Messages not found" });
            return res.status(200).json(messages);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    newMessage: async (req, res) => {
        try {
            const { conversationId, senderId, content } = req.body;
            if (!conversationId || !senderId || !content)
                return res.status(500).json({ message: "Data not provided." });
            const message = await app_1.prisma.message.create({
                data: {
                    content,
                    conversationId,
                    senderId,
                },
            });
            if (!message)
                return res
                    .status(404)
                    .json({ message: "Message couldn't be created." });
            return res.status(200).json(message);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
};
//# sourceMappingURL=MessageController.js.map