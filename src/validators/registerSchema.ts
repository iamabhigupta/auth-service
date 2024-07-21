import { z } from "zod";

export const registerSchema = z.object({
   body: z.object({
      email: z.string().email({ message: "Email is required" }),
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      password: z
         .string()
         .min(6, "Password must be at least 6 characters long"),
   }),
});

export enum UserStatus {
   ACTIVE = "active",
   DELETED = "deleted",
}

export const queryStringValidator = z.object({
   query: z.object({
      // Name is required and must have 4 or more characters
      name: z
         .string({
            required_error: "Name is required",
         })
         .min(4, "Name must be bigger than 4 characters"),
      // Last name is optional
      lastName: z.string().optional(),
      // Age is required, we expect a number but, because we are receiving values from query string all will be stirngs
      age: z.string({
         required_error: "Age is required",
      }),
      // Status is required and must one of the value defined in the enum
      status: z.nativeEnum(UserStatus, {
         required_error: "Status is required",
         invalid_type_error: "Status is not valid",
      }),
   }),
});

export const bodyParamsValidator = z.object({
   body: z.object({
      // Email is required and must have email format
      email: z
         .string({
            required_error: "Email is required",
         })
         .email("Email is not valid"),
      // Password is required and must have 8 or more characters
      password: z
         .string({ required_error: "Password is required" })
         .min(8, "Password must be minimum 8 characters long"),
   }),
});

export const queryParamsValidator = z.object({
   params: z.object({
      // User id is required
      userId: z.string({
         required_error: "User id is required",
      }),
      // Book id is required
      bookId: z.string({
         required_error: "Book id is required",
      }),
   }),
});
