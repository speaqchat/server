"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const ConversationController_1 = __importDefault(require("../controllers/ConversationController"));
const FriendController_1 = __importDefault(require("../controllers/FriendController"));
const MessageController_1 = __importDefault(require("../controllers/MessageController"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const routes = (app) => {
    app.post("/signup", AuthController_1.default.signup);
    app.post("/login", AuthController_1.default.login);
    app.post("/picture/:id", upload.single("picture"), UserController_1.default.picture);
    app.get("/picture/:id", UserController_1.default.getPicture);
    app.get("/friendreqs", FriendController_1.default.getFriendReq);
    app.get("/friends", FriendController_1.default.getFriends);
    app.post("/friend", FriendController_1.default.addFriend);
    app.put("/acceptfriend", FriendController_1.default.acceptFriend);
    app.delete("/friend", FriendController_1.default.removeFriend);
    app.get("/conversations", ConversationController_1.default.getConversations);
    app.post("/conversation", ConversationController_1.default.newConversation);
    app.get("/messages", MessageController_1.default.getMessages);
    app.post("/message", MessageController_1.default.newMessage);
};
exports.routes = routes;
//# sourceMappingURL=routes.js.map