import { NextFunction, Response } from "express";
import { Logger } from "winston";

import { TenantService } from "../services/TenantService";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";
import { Roles } from "../constants";

export class UserController {
  constructor(
    private userService: UserService,
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.debug("Request for creating tenant", req.body);

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
      });

      this.logger.info("Tenant has been created", { id: user.id });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
}
