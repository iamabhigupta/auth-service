import { Repository } from "typeorm";
import { ITenant, TenantQueryParams } from "../types";
import { Tenant } from "../entity/Tenant";

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return this.tenantRepository.save(tenantData);
  }

  async update(id: number, tenantData: ITenant) {
    return this.tenantRepository.update(id, tenantData);
  }

  async getAll(validatedQuery: TenantQueryParams) {
    const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");

    if (validatedQuery.q) {
      const searchTerm = `%${validatedQuery.q}%`;
      queryBuilder.where("CONCAT(tenant.name, ' ', tenant.address) ILike :q", {
        q: searchTerm,
      });
    }

    const result = await queryBuilder
      .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
      .take(validatedQuery.perPage)
      .orderBy("tenant.id", "DESC")
      .getManyAndCount();
    return result;
  }

  async getById(id: number) {
    return this.tenantRepository.findBy({
      id,
    });
  }

  async deleteById(id: number) {
    return this.tenantRepository.delete({
      id,
    });
  }
}
