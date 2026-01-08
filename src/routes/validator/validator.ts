import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validationMiddleware =
  (schema: Joi.ObjectSchema, property: "body" | "query" | "params") =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { error } = schema.validate(req[property]);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res
        .status(400)
        .json({ message: errorMessage, error: errorMessage });
    }
    next();
  };
