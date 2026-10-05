import { Router } from "express";
import { guestLogin, login, verifyToken } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/login", (request, response) => {
  const result = login(request.body);
  response.status(result.status).json(result.body);
});

authRouter.post("/guest", (_request, response) => {
  response.status(200).json(guestLogin());
});

authRouter.get("/me", (request, response) => {
  const token = request.headers.authorization?.replace("Bearer ", "");
  const user = verifyToken(token);

  if (!user) {
    response.status(401).json({ message: "Session expired. Please sign in again." });
    return;
  }

  response.json({ user });
});
