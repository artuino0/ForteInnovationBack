import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  cliente_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

const ClientSchema: Schema = new Schema({
  cliente_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: { type: String },
});

export default mongoose.model<IClient>("Client", ClientSchema);
