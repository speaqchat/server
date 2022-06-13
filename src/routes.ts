import { Application } from "express";
import AuthController from "../controllers/AuthController";
import ConversationController from "../controllers/ConversationController";
import FriendController from "../controllers/FriendController";
import MessageController from "../controllers/MessageController";

export const routes = (app: Application) => {
  // -> User / Auth

  app.post("/signup", AuthController.signup);

  app.post("/login", AuthController.login);

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
