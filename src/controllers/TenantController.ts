import { NextFunction, Response } from "express";
import { Logger } from "winston";

import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import createHttpError from "http-errors";

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    this.logger.debug("Request for creating tenant", req.body);

    try {
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info("Tenant has been created", { id: tenant.id });

      res.status(201).json({ id: tenant.id });
    } catch (error) {
      next(error);
    }
  }

  async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    const tenantId = req.params.id;

    if (isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url params"));
    }

    this.logger.debug("Request for updating a tenant", req.body);

    try {
      await this.tenantService.update(Number(tenantId), { name, address });
      this.logger.info("Tenant has been updated", { id: tenantId });

      res.status(201).json({ id: Number(tenantId) });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: CreateTenantRequest, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getAll();
      this.logger.info("All tenant have been fetched");

      res.status(201).json(tenants);
    } catch (error) {
      next(error);
    }
  }
}
