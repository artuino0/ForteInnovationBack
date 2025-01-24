import { Request, Response } from "express";
import Transaction from "../models/transaction.model";

import Client from "@/models/client.model";
import XLSX from "xlsx";
import { uploadToS3 } from "@/utils/s3.helper";
import { env } from "@/config/envLoad";
import clientModel from "@/models/client.model";
import moment from "moment";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { fecha, ...resto } = req.body;
    const transaction = new Transaction({
      fecha: moment(fecha).add(1, "day").valueOf(),
      ...resto,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la transacción", error });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const filters = await filterBuilder(req.query);

    console.log("filters", filters);

    const transactions = await Transaction.find({ ...filters })
      .populate("cliente_id", "nombre")
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Transaction.countDocuments(filters);

    const transformedTransactions = transactions.map((transaction) => {
      const { cliente_id, ...rest } = transaction;
      return {
        ...rest,
        cliente_nombre: isPopulated(cliente_id) ? cliente_id.nombre : null,
      };
    });

    res.status(200).json({
      data: transformedTransactions,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
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

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const filters = await filterBuilder(req.query);
    const transactions = await Transaction.find({ ...filters }).lean();

    const ingresosPorMes = Array(12).fill(0);
    const egresosPorMes = Array(12).fill(0);

    const dashboardData = transactions.reduce(
      (acc, transaction) => {
        const { cantidad, tipo, fecha } = transaction;

        const mes = new Date(fecha).getMonth();

        if (tipo === "ingreso") {
          acc.totalIngresos += cantidad;
          ingresosPorMes[mes] += cantidad;
        } else if (tipo === "egreso") {
          acc.totalEgresos += cantidad;
          egresosPorMes[mes] += cantidad;
        }

        acc.totalTransacciones++;
        return acc;
      },
      {
        totalIngresos: 0,
        totalEgresos: 0,
        totalTransacciones: 0,
        ingresosPorMes: Array(12).fill(0),
        egresosPorMes: Array(12).fill(0),
      }
    );

    dashboardData.ingresosPorMes = ingresosPorMes;
    dashboardData.egresosPorMes = egresosPorMes;

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error al generar el dashboard:", error);
    res.status(500).json({ message: "Error al generar el dashboard", error });
  }
};

const filterBuilder = async (query: Record<string, any>) => {
  const filters: Record<string, any> = {};

  if (query.cliente_id) {
    const client = await clientModel.findOne({ cliente_id: query.cliente_id });
    filters.cliente_id = client?._id;
  }

  if (query.startDate && query.endDate) {
    const startDate = moment(parseInt(query.startDate));
    const endDate = moment(parseInt(query.endDate));
    filters.fecha = {
      $gte: moment(startDate).startOf("day").valueOf(),
      $lte: moment(endDate).endOf("day").valueOf(),
    };
  }

  if (query.categoria) {
    filters.categoria = { $regex: query.categoria, $options: "i" };
  }

  return filters;
};

const isPopulated = (cliente: any): cliente is { nombre: string } => {
  return cliente && typeof cliente === "object" && "nombre" in cliente;
};
