import mongoose from "mongoose";

const schemaOptions = {
  versionKey: false,
  timestamps: { createdAt: "creele", updatedAt: "majle" },
};
const AuthorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthday: Date,
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  schemaOptions
);

export default mongoose.model("Author", AuthorSchema);
