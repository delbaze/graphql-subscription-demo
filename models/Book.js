import mongoose from "mongoose";

const schemaOptions = {
  versionKey: false,
  timestamps: { createAt: "creele", updatedAt: "majle" },
};
const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
      },
    ],
  },
  schemaOptions
);

export default mongoose.model("Book", BookSchema);
