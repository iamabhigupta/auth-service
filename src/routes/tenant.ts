import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { TenantController } from "../controllers/TenantController";
// import { RefreshToken } from "../entity/RefreshToken";
import { Tenant } from "../entity/Tenant";
import { User } from "../entity/User";
import { TenantService } from "../services/TenantService";
// import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { logger } from "../config/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const tenantRepository = AppDataSource.getRepository(Tenant);
const userService = new UserService(userRepository);
// const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
// const tokenService = new TokenService(refreshTokenRepository);
const tenantService = new TenantService(tenantRepository);

const tenantController = new TenantController(
  userService,
  tenantService,
  logger,
);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);

export default router;
