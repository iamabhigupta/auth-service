import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
   (validator: AnyZodObject) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         // We use parse to validate the request is valid
         await validator.parseAsync({
            body: req.body as AnyZodObject,
            query: req.query,
            params: req.params,
         });

         // Validation was successfully continue
         next();
      } catch (err) {
         // If error is instance of ZodError then return error to client to show it to user
         if (err instanceof ZodError) {
            return res.status(400).json({
               errors: [
                  {
                     type: err.name,
                     msg: err.errors[0].message,
                     location: "",
                     ...err.errors[0],
                  },
               ],
            });
         }

         // If error is not from zod then return generic error message
         return res.status(500).send("Error making request, contact support");
      }
   };
