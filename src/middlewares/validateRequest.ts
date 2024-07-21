// import { NextFunction, Request, Response } from "express";
// import { AnyZodObject, ZodError } from "zod";

// export const validateRequest =
//    (schema: AnyZodObject) =>
//    (req: Request, res: Response, next: NextFunction) => {
//       try {
//          schema.parse(req.body);
//          next();
//       } catch (err) {
//          if (err instanceof ZodError) {
//             return res.status(400).json({
//                errors: [
//                   {
//                      type: err.name,
//                      msg: err.errors[0].message,
//                      location: "",
//                      ...err.errors[0],
//                   },
//                ],
//             });
//          }
//          next(err);
//       }
//    };
