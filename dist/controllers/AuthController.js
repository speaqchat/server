"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const app_1 = require("../src/app");
const validatePassword_1 = require("../utils/validatePassword");
const jwtSign = (user) => {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return (0, jsonwebtoken_1.sign)(user, process.env.SECRET, {
        expiresIn: ONE_WEEK,
    });
};
exports.default = {
    signup: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password)
                return res.status(401).json("Missing credentials.");
            const user = await app_1.prisma.user.create({
                data: {
                    username,
                    email,
                    password: await bcrypt.hash(password, await bcrypt.genSalt(7)),
                },
            });
            if (!user)
                return res.status(500).json({ message: "Error creating user." });
            return res.status(200).json({ user: user, token: jwtSign(user) });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(401).json("Missing credentials.");
            const user = await app_1.prisma.user.findFirst({
                where: {
                    email,
                },
            });
            if (!user)
                return res.status(401).json({ message: "Error finding user." });
            if (!(await (0, validatePassword_1.validPassword)(password, user.password)))
                return res.status(401).json({ message: "Unauthorized." });
            return res.status(200).json({ user: user, token: jwtSign(user) });
        }
        catch (err) {
            return res.status(401).json(err);
        }
    },
};
//# sourceMappingURL=AuthController.js.map