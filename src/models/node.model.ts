import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface INode extends Document {
  name: string;
  parentId: ObjectId;
  type?: "root" | "node";
}

const NodeSchema: Schema = new Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId },
  type: { type: String, required: true },
});

export default mongoose.model<INode>("Node", NodeSchema);
