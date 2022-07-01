"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
const s3_1 = require("../utils/s3");
exports.default = {
    picture: async (req, res) => {
        try {
            const file = req.file;
            const result = await (0, s3_1.upload)(file);
            const { id } = req.params;
            const parsedId = parseInt(id, 10);
            if (!parsedId)
                return res.status(401).json("Missing ID.");
            const user = await app_1.prisma.user.update({
                where: {
                    id: parsedId,
                },
                data: {
                    profilePicture: result.Key,
                },
            });
            if (!user)
                return res.status(500).json({ message: "Error finding user." });
            const fileStream = (0, s3_1.getFileStream)(result.Key);
            return fileStream.pipe(res);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    getPicture: async (req, res) => {
        try {
            const { id } = req.params;
            const parsedId = parseInt(id, 10);
            if (!parsedId)
                return res.status(401).json("Missing ID.");
            const user = await app_1.prisma.user.findUnique({
                where: {
                    id: parsedId,
                },
            });
            if (!user)
                return res.status(500).json({ message: "Error finding user." });
            if (!user.profilePicture)
                return res.status(200).json(null);
            const fileStream = (0, s3_1.getFileStream)(user.profilePicture);
            return fileStream.pipe(res);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
};
//# sourceMappingURL=UserController.js.map