import express, { NextFunction, Request, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { TenantController } from "../controllers/TenantController";
import { Tenant } from "../entity/Tenant";
import { TenantService } from "../services/TenantService";
import { logger } from "../config/logger";
import { Roles } from "../constants";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import tenantValidator from "../validators/tenant-validator";
import { CreateTenantRequest } from "../types";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);

const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  tenantValidator,
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);

router.patch(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  tenantValidator,
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.update(req, res, next),
);

router.get(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getAll(req, res, next),
);

router.get(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getById(req, res, next),
);

router.delete(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.deleteById(req, res, next),
);

export default router;
