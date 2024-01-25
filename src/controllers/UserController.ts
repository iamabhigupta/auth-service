import { NextFunction, Response } from "express";
import { Logger } from "winston";

import { Roles } from "../constants";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.debug("Request for creating user", req.body);

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
      });

      this.logger.info("User has been created by ADMIN", { id: user.id });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
}
