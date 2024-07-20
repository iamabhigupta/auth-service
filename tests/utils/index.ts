import { DataSource } from "typeorm";

export const truncateTables = async (db: DataSource) => {
   const entities = db.entityMetadatas;

   for (const entity of entities) {
      const repository = db.getRepository(entity.name);
      await repository.clear();
   }
};
