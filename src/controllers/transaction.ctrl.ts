import { Request, Response } from "express";
import Transaction from "../models/transaction.model";

import Client from "@/models/client.model";
import XLSX from "xlsx";
import { uploadToS3 } from "@/utils/s3.helper";
import { env } from "@/config/envLoad";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la transacción", error });
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
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la transacción", error });
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
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    return res.status(200).json(updatedTransaction);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al actualizar la transacción", error });
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
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al desactivar la transacción", error });
  }
};

export const reportTransaction = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const transactions = await Transaction.find({ cliente_id: clientId });
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron transacciones para este cliente" });
    }

    const data = transactions.map((transaction) => ({
      Fecha: new Date(transaction.fecha).toISOString().split("T")[0],
      Categoría: transaction.categoria,
      Monto: transaction.cantidad,
      Tipo: transaction.tipo === "ingreso" ? "Ingreso" : "Gasto",
      Estado: transaction.estado === "activa" ? "Activa" : "Desactivada",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    const bucketName = env.AWS.AWS_S3_BUCKET_NAME || "";
    const fileName = `reports/reporte_cliente_${clientId}.xlsx`;
    const fileUrl = await uploadToS3(
      bucketName,
      fileName,
      buffer,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).json({
      message: "Reporte generado con éxito",
      cliente: client.nombre,
      fileUrl,
    });
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    res.status(500).json({ message: "Error al generar el reporte", error });
  }
};
