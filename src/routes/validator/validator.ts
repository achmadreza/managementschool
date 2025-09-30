import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validationMiddleware =
  (schema: Joi.ObjectSchema, property: "body" | "query" | "params") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
