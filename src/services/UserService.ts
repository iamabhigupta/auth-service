import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { Repository } from "typeorm";

import { User } from "../entity/User";
import { LimitedUserData, UserData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({
    firstName,
    lastName,
    email,
    password,
    role,
    tenantId,
  }: UserData) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (user) {
      const err = createHttpError(400, "Email is already exists!");
      throw err;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        tenant: tenantId ? { id: tenantId } : undefined,
      });
    } catch (error) {
      const err = createHttpError(500, "Failed to store data in the database");
      throw err;
    }
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
      select: ["id", "firstName", "lastName", "email", "role", "password"],
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, { firstName, lastName, role }: LimitedUserData) {
    try {
      return await this.userRepository.update(id, {
        firstName,
        lastName,
        role,
      });
    } catch (error) {
      const err = createHttpError(
        500,
        "Failed to update the user in the database",
      );
      throw err;
    }
  }

  async getAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      const err = createHttpError(
        500,
        "Failed to get the user in the database",
      );
      throw err;
    }
  }

  async getById(id: number) {
    try {
      return await this.userRepository.findOneBy({
        id,
      });
    } catch (error) {
      const err = createHttpError(
        500,
        "Failed to get the user in the database",
      );
      throw err;
    }
  }

  async deleteById(id: number) {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      const err = createHttpError(
        500,
        "Failed to delete the user in the database",
      );
      throw err;
    }
  }
}
