import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";
import { Logger } from "winston";
import createHttpError from "http-errors";

export class AuthController {
   userService: UserService;

   constructor(
      userService: UserService,
      private logger: Logger,
   ) {
      this.userService = userService;
   }
   async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
      const { firstName, lastName, email, password } = req.body;

      if (!email) {
         next(createHttpError(400, "Email is required"));
         return;
      }

      this.logger.debug("New request to register a user", {
         firstName,
         lastName,
         email,
         password: "******",
      });

      try {
         const user = await this.userService.create({
            firstName,
            lastName,
            email,
            password,
         });
         this.logger.info("User has been registered", { id: user.id });
         res.status(201).json({ id: user.id });
      } catch (error) {
         next(error);
         return;
      }
   }
}
