import { Application } from "express";
import AuthController from "../controllers/AuthController";
import ConversationController from "../controllers/ConversationController";
import FriendController from "../controllers/FriendController";
import MessageController from "../controllers/MessageController";
import UserController from "../controllers/UserController";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const routes = (app: Application) => {
  // -> User / Auth

  app.post("/signup", AuthController.signup);

  app.post("/login", AuthController.login);

  // -> Profile Pictures

  app.post("/picture/:id", upload.single("picture"), UserController.picture);

  app.get("/picture/:id", UserController.getPicture);

  // -> Friendship

  app.get("/friendreqs", FriendController.getFriendReq);

  app.get("/friends", FriendController.getFriends);

  app.post("/friend", FriendController.addFriend);

  app.put("/acceptfriend", FriendController.acceptFriend);

  app.delete("/friend", FriendController.removeFriend);

  // -> Conversation

  app.get("/conversations", ConversationController.getConversations);

  app.post("/conversation", ConversationController.newConversation);

  // -> Message

  app.get("/messages", MessageController.getMessages);

  app.post("/message", MessageController.newMessage);
};
