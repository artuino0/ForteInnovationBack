import { Request, Response, NextFunction } from "express";
import Client from "../models/client.model";

export const clientExistsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cliente_id, email } = req.body;
  const existingClient = await Client.findOne({
    $or: [{ cliente_id }, { email }],
  });
  if (existingClient) {
    return res
      .status(400)
      .json({ message: "El cliente ya existe con ese ID o email" });
  }
  next();
};
