import { Request, Response } from "express";
import Transaction from "@/models/transaction.model";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la transaccion", error });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las transacciones", error });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaccion no encontrada" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la transaccion", error });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaccion no encontrada" });
    }
    return res.status(200).json(updatedTransaction);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al actualizar la transaccion", error });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { estado: "desactivada" },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaccion no encontrada" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al desactivar la transaccion", error });
  }
};
