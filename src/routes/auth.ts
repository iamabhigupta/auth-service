import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { body } from "express-validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

router.post(
   "/register",
   [body("email").notEmpty(), body("firstName").notEmpty()],
   (req: Request, res: Response, next: NextFunction) =>
      authController.register(req, res, next),
);

export default router;
