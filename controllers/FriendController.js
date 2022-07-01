"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var app_1 = require("../src/app");
exports["default"] = {
    getFriends: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, friends, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.query.userId;
                    if (!userId || typeof userId !== "string")
                        return [2 /*return*/, res.status(500).json({ message: "User id not provided." })];
                    return [4 /*yield*/, app_1.prisma.user.findFirst({
                            where: {
                                id: parseInt(userId)
                            },
                            select: {
                                friends: true
                            }
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).json({ message: "User not found." })];
                    friends = user.friends;
                    if (!friends)
                        return [2 /*return*/, res.status(404).json({ message: "Error fetching friends." })];
                    return [2 /*return*/, res.status(200).json(friends)];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, res.status(500).json(err_1)];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getFriendReq: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, incoming, outgoing, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = req.query.userId;
                    if (!userId || typeof userId !== "string")
                        return [2 /*return*/, res.status(500).json({ message: "Invalid user id" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, app_1.prisma.friendRequest.findMany({
                            where: {
                                friendId: parseInt(userId)
                            },
                            include: {
                                user: true
                            }
                        })];
                case 2:
                    incoming = _a.sent();
                    return [4 /*yield*/, app_1.prisma.friendRequest.findMany({
                            where: {
                                userId: parseInt(userId)
                            },
                            include: {
                                friend: true
                            }
                        })];
                case 3:
                    outgoing = _a.sent();
                    // const filteredFriendReq = friendReq.map((fr) => {
                    //   return fr.friendId === parseInt(userId)
                    //     ? { ...fr, incoming: true }
                    //     : { ...fr, incoming: false };
                    // });
                    // console.log(filteredFriendReq);
                    return [2 /*return*/, res.status(200).json({
                            incoming: incoming,
                            outgoing: outgoing
                        })];
                case 4:
                    err_2 = _a.sent();
                    return [2 /*return*/, res.status(500).json(err_2)];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    addFriend: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, username, friend, friendship, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, userId = _a.userId, username = _a.username;
                    if (!userId || !username)
                        return [2 /*return*/, res
                                .status(500)
                                .json({ message: "User id and/or username not provided." })];
                    return [4 /*yield*/, app_1.prisma.user.findFirst({
                            where: {
                                username: username
                            }
                        })];
                case 1:
                    friend = _b.sent();
                    if (!friend)
                        return [2 /*return*/, res.status(404).json({ message: "Friend not found." })];
                    return [4 /*yield*/, app_1.prisma.friendRequest.create({
                            data: {
                                userId: userId,
                                friendId: friend.id
                            }
                        })];
                case 2:
                    friendship = _b.sent();
                    if (!friendship)
                        return [2 /*return*/, res
                                .status(404)
                                .json({ message: "Friendship couldn't be created." })];
                    return [2 /*return*/, res.status(200).json(friendship)];
                case 3:
                    err_3 = _b.sent();
                    return [2 /*return*/, res.status(500).json(err_3)];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    acceptFriend: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, friendId, me, other, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    _a = req.body, userId = _a.userId, friendId = _a.friendId;
                    if (!userId || !friendId)
                        return [2 /*return*/, res
                                .status(418)
                                .json({ message: "User id or friend id not provided." })];
                    return [4 /*yield*/, app_1.prisma.user.findFirst({
                            where: { id: friendId },
                            include: { friends: true }
                        })];
                case 1:
                    me = _b.sent();
                    if (!me)
                        return [2 /*return*/, res.status(404).json({ message: "me was not found" })];
                    return [4 /*yield*/, app_1.prisma.user.findFirst({
                            where: { id: userId },
                            include: { friends: true }
                        })];
                case 2:
                    other = _b.sent();
                    if (!other)
                        return [2 /*return*/, res.status(404).json({ message: "other was not found" })];
                    return [4 /*yield*/, app_1.prisma.friendRequest["delete"]({
                            where: {
                                userId_friendId: {
                                    friendId: friendId,
                                    userId: userId
                                }
                            }
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, app_1.prisma.user.update({
                            where: { id: me.id },
                            data: {
                                friends: {
                                    set: __spreadArray(__spreadArray([], me.friends.map(function (i) {
                                        return { id: i.id };
                                    }), true), [
                                        { id: other.id },
                                    ], false)
                                }
                            }
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, app_1.prisma.user.update({
                            where: { id: other.id },
                            data: {
                                friends: {
                                    set: __spreadArray(__spreadArray([], other.friends.map(function (i) {
                                        return { id: i.id };
                                    }), true), [
                                        { id: me.id },
                                    ], false)
                                }
                            }
                        })];
                case 5:
                    _b.sent();
                    return [2 /*return*/, res.status(200).json({ message: "Success" })];
                case 6:
                    err_4 = _b.sent();
                    console.log(err_4);
                    return [2 /*return*/, res.status(500).json(err_4)];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    removeFriend: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, friend, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.body.id;
                    if (!id)
                        return [2 /*return*/, res.status(500).json({ message: "Friend id not provided." })];
                    return [4 /*yield*/, app_1.prisma.friendRequest["delete"]({
                            where: {
                                id: id
                            }
                        })];
                case 1:
                    friend = _a.sent();
                    if (!friend)
                        return [2 /*return*/, res.status(404).json({ message: "Friend not found." })];
                    return [2 /*return*/, res.status(200).json()];
                case 2:
                    err_5 = _a.sent();
                    return [2 /*return*/, res.status(500).json(err_5)];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
