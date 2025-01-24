import mongoose, { Schema, Document, CallbackError } from "mongoose";
import Counter from "./counter.model";

export interface ITransaction extends Document {
  Id: number;
  transaccion_id: string;
  cliente_id: mongoose.Schema.Types.ObjectId;
  cantidad: number;
  categoria: string;
  fecha: number;
  tipo: "ingreso" | "egreso";
  estado: "activa" | "desactivada";
}

const TransactionSchema: Schema = new Schema({
  Id: { type: Number },
  transaccion_id: { type: String, unique: true },
  cliente_id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  cantidad: { type: Number, required: true },
  categoria: { type: String, required: true },
  fecha: { type: Number, required: true },
  tipo: { type: String, enum: ["ingreso", "egreso"], required: true },
  estado: { type: String, enum: ["activa", "desactivada"], default: "activa" },
});

TransactionSchema.pre<ITransaction>("save", async function (next) {
  try {
    if (this.transaccion_id) {
      return next();
    }

    const counter = await Counter.findOneAndUpdate(
      { model: "Transaction" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.Id = counter!.seq;
    this.transaccion_id = `txn${counter!.seq.toString().padStart(10, "0")}`;
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
