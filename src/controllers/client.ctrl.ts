import { Request, Response } from "express";
import Client from "@/models/client.model";

export const createClient = async (req: Request, res: Response) => {
  try {
    const { cliente_id, nombre, email, telefono, direccion } = req.body;

    const client = new Client({
      cliente_id,
      nombre,
      email,
      telefono,
      direccion,
    });
    await client.save();
    const existingClient = await Client.findOne({
      $or: [{ cliente_id }, { email }],
    });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "El cliente ya existe con ese ID o email" });
    }

    res.status(201).json(client);
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await Client.findOne({ cliente_id: id });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};
