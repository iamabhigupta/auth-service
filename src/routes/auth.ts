import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { registerSchema } from "../validators/registerSchema";
import { validateRequest } from "../middlewares/validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

router.post(
   "/register",
   validateRequest(registerSchema),
   (req: Request, res: Response, next: NextFunction) =>
      authController.register(req, res, next),
);

export default router;
