import express, { NextFunction, Request, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { logger } from "../config/logger";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { UserService } from "../services/UserService";
import createUserValidator from "../validators/create-user-validator";
import updateUserValidator from "../validators/update-user-validator";
import { CreateUserRequest, UpdateUserRequest } from "../types";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const userController = new UserController(userService, logger);

router.post(
  "/",
  authenticate,
  createUserValidator,
  canAccess([Roles.ADMIN]),
  (req: CreateUserRequest, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);

router.post(
  "/:id",
  authenticate,
  updateUserValidator,
  canAccess([Roles.ADMIN]),
  (req: UpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next),
);

router.get(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next),
);

router.get(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next),
);

router.delete(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next),
);

export default router;
