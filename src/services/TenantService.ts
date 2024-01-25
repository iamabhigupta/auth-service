import { Repository } from "typeorm";
import { ITenant } from "../types";
import { Tenant } from "../entity/Tenant";

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return this.tenantRepository.save(tenantData);
  }

  async update(id: number, tenantData: ITenant) {
    return this.tenantRepository.update(id, tenantData);
  }

  async getAll() {
    return this.tenantRepository.find();
  }
}
