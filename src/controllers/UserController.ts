import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Logger } from "winston";

import { Roles } from "../constants";
import { UserService } from "../services/UserService";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
} from "../types";
import { matchedData } from "express-validator";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, tenantId } = req.body;
    this.logger.debug("Request for creating user", req.body);

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
        tenantId,
      });

      this.logger.info("User has been created by ADMIN", { id: user.id });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }

  async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
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

  async getAll(req: Request, res: Response, next: NextFunction) {
    const validatedQuery = matchedData(req, { onlyValidData: true });

    try {
      const [users, count] = await this.userService.getAll(
        validatedQuery as UserQueryParams,
      );

      this.logger.info("All users have been fetched");

      res.json({
        currentPage: validatedQuery.currentPage as number,
        perPage: validatedQuery.perPage as number,
        total: count,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
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

  async delete(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      await this.userService.deleteById(Number(userId));

      this.logger.info("User has been deleted", { id: Number(userId) });
      res.json({ id: Number(userId) });
    } catch (error) {
      next(error);
    }
  }
}
