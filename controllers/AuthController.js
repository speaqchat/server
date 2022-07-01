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
exports.__esModule = true;
var bcrypt = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var app_1 = require("../src/app");
var validatePassword_1 = require("../utils/validatePassword");
var jwtSign = function (user) {
    var ONE_WEEK = 60 * 60 * 24 * 7;
    return (0, jsonwebtoken_1.sign)(user, process.env.SECRET, {
        expiresIn: ONE_WEEK
    });
};
exports["default"] = {
    signup: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, username, email, password, user, _b, _c, _d, _e, _f, err_1;
        var _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 4, , 5]);
                    _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                    if (!username || !email || !password)
                        return [2 /*return*/, res.status(401).json("Missing credentials.")];
                    _c = (_b = app_1.prisma.user).create;
                    _g = {};
                    _h = {
                        username: username,
                        email: email
                    };
                    _e = (_d = bcrypt).hash;
                    _f = [password];
                    return [4 /*yield*/, bcrypt.genSalt(7)];
                case 1: return [4 /*yield*/, _e.apply(_d, _f.concat([_j.sent()]))];
                case 2: return [4 /*yield*/, _c.apply(_b, [(_g.data = (_h.password = _j.sent(),
                            _h),
                            _g)])];
                case 3:
                    user = _j.sent();
                    if (!user)
                        return [2 /*return*/, res.status(500).json({ message: "Error creating user." })];
                    return [2 /*return*/, res.status(200).json({ user: user, token: jwtSign(user) })];
                case 4:
                    err_1 = _j.sent();
                    return [2 /*return*/, res.status(500).json(err_1)];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    login: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, user, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, email = _a.email, password = _a.password;
                    if (!email || !password)
                        return [2 /*return*/, res.status(401).json("Missing credentials.")];
                    return [4 /*yield*/, app_1.prisma.user.findFirst({
                            where: {
                                email: email
                            }
                        })];
                case 1:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, res.status(401).json({ message: "Error finding user." })];
                    return [4 /*yield*/, (0, validatePassword_1.validPassword)(password, user.password)];
                case 2:
                    if (!(_b.sent()))
                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized." })];
                    return [2 /*return*/, res.status(200).json({ user: user, token: jwtSign(user) })];
                case 3:
                    err_2 = _b.sent();
                    return [2 /*return*/, res.status(401).json(err_2)];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
