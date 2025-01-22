import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transaccion_id: string;
  cliente_id: string;
  cantidad: number;
  categoría: string;
  fecha: number;
  tipo: "ingreso" | "gasto";
  estado: "activa" | "desactivada";
}

const TransactionSchema: Schema = new Schema({
  transaccion_id: { type: String, required: true, unique: true },
  cliente_id: { type: String, required: true },
  cantidad: { type: Number, required: true },
  categoría: { type: String, required: true },
  fecha: { type: Number, required: true },
  tipo: { type: String, enum: ["ingreso", "gasto"], required: true },
  estado: { type: String, enum: ["activa", "desactivada"], default: "activa" },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
