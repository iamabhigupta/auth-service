import express, { NextFunction, Request, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { logger } from "../config/logger";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { UserService } from "../services/UserService";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const userController = new UserController(userService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);

router.post(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.update(req, res, next),
);

export default router;
