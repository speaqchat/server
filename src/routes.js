"use strict";
exports.__esModule = true;
exports.routes = void 0;
var AuthController_1 = require("../controllers/AuthController");
var ConversationController_1 = require("../controllers/ConversationController");
var FriendController_1 = require("../controllers/FriendController");
var MessageController_1 = require("../controllers/MessageController");
var UserController_1 = require("../controllers/UserController");
var multer_1 = require("multer");
var upload = (0, multer_1["default"])({ dest: "uploads/" });
var routes = function (app) {
    // -> User / Auth
    app.post("/signup", AuthController_1["default"].signup);
    app.post("/login", AuthController_1["default"].login);
    // -> Profile Pictures
    app.post("/picture/:id", upload.single("picture"), UserController_1["default"].picture);
    app.get("/picture/:id", UserController_1["default"].getPicture);
    // -> Friendship
    app.get("/friendreqs", FriendController_1["default"].getFriendReq);
    app.get("/friends", FriendController_1["default"].getFriends);
    app.post("/friend", FriendController_1["default"].addFriend);
    app.put("/acceptfriend", FriendController_1["default"].acceptFriend);
    app["delete"]("/friend", FriendController_1["default"].removeFriend);
    // -> Conversation
    app.get("/conversations", ConversationController_1["default"].getConversations);
    app.post("/conversation", ConversationController_1["default"].newConversation);
    // -> Message
    app.get("/messages", MessageController_1["default"].getMessages);
    app.post("/message", MessageController_1["default"].newMessage);
};
exports.routes = routes;
