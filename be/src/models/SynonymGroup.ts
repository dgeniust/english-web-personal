import mongoose, { Document, Schema } from "mongoose";

export interface ISynonymGroup extends Document {
  userId: mongoose.Types.ObjectId;
  wordIds: mongoose.Types.ObjectId[];
  externalWords: string[];
}

const synonymGroupSchema = new Schema<ISynonymGroup>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Chứa ID của những từ ĐÃ TỒN TẠI trong kho
  wordIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Word" }],

  // Chứa text của những từ CHƯA TỒN TẠI
  externalWords: [{ type: String }],
});
export default mongoose.model<ISynonymGroup>(
  "SynonymGroup",
  synonymGroupSchema,
);
