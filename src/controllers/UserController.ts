import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
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

  async update(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, role } = req.body;
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    this.logger.debug("Request for updating user", req.body);

    try {
      await this.userService.update(Number(userId), {
        firstName,
        lastName,
        role,
      });

      this.logger.info("User has been updated by ADMIN", { id: userId });

      res.status(201).json({ id: userId });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: CreateUserRequest, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();

      this.logger.info("All users have been fetched");

      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: CreateUserRequest, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      const user = await this.userService.getById(Number(userId));

      if (!user) {
        next(createHttpError(400, "User does not exist."));
        return;
      }

      this.logger.info("User has been fetched", { id: user.id });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
